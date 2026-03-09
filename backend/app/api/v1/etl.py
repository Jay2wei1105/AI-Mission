"""
ETL Pipeline API Endpoints.

Provides HTTP endpoints for:
- File parsing (CSV → structured data)
- Data cleaning & validation
- Feature engineering
- Full pipeline execution
"""

import io
import tempfile
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()


class ParseResponse(BaseModel):
    """Response from parse endpoint."""
    rows: int
    columns: int
    column_names: list[str]
    preview: list[dict]


class CleanResponse(BaseModel):
    """Response from clean endpoint."""
    original_rows: int
    cleaned_rows: int
    columns: int
    violations_detected: int
    metadata: dict


class PipelineResponse(BaseModel):
    """Response from full pipeline."""
    parse_rows: int
    cleaned_rows: int
    model_metrics: dict | None = None
    optimization_result: dict | None = None


@router.post("/parse", response_model=ParseResponse)
async def parse_file(
    file: UploadFile = File(...),
    site_id: str = Query(default="demo", description="Site configuration ID"),
):
    """
    Parse a raw HVAC CSV file into structured data.

    Accepts a CSV file upload and returns parsed data preview.
    """
    try:
        from container import ETLContainer

        content = await file.read()

        # Save to temp file for parser
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        container = ETLContainer(site_id=site_id)
        container.initialize_all()
        parser = container.get_parser()
        df = parser.parse_file(tmp_path)

        # Clean up temp file
        Path(tmp_path).unlink(missing_ok=True)

        return ParseResponse(
            rows=len(df),
            columns=len(df.columns),
            column_names=df.columns,
            preview=df.head(10).to_dicts(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parse failed: {str(e)}")


@router.post("/clean", response_model=CleanResponse)
async def clean_file(
    file: UploadFile = File(...),
    site_id: str = Query(default="demo", description="Site configuration ID"),
    interval: str = Query(default="5m", description="Resample interval"),
    filter_invalid: bool = Query(default=False, description="Remove invalid rows"),
):
    """
    Parse and clean a raw HVAC CSV file.

    Performs data validation, resampling, and quality checks.
    """
    try:
        from container import ETLContainer

        content = await file.read()
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        container = ETLContainer(site_id=site_id)
        container.initialize_all()
        parser = container.get_parser()
        cleaner = container.get_cleaner()

        df = parser.parse_file(tmp_path)
        df_clean, metadata, audit = cleaner.clean(df)

        Path(tmp_path).unlink(missing_ok=True)

        return CleanResponse(
            original_rows=len(df),
            cleaned_rows=len(df_clean),
            columns=len(df_clean.columns),
            violations_detected=audit.get("violations_detected", 0),
            metadata=metadata if isinstance(metadata, dict) else {},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clean failed: {str(e)}")


@router.post("/pipeline", response_model=PipelineResponse)
async def run_pipeline(
    file: UploadFile = File(...),
    site_id: str = Query(default="demo", description="Site configuration ID"),
):
    """
    Run the full ETL + Training pipeline on uploaded data.

    Steps: Parse → Clean → Train (if enough data) → Optimize (demo).
    """
    try:
        from container import ETLContainer
        from ml_models.energy_model import ChillerEnergyModel
        from optimization.optimizer import ChillerOptimizer, OptimizationContext

        content = await file.read()
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        container = ETLContainer(site_id=site_id)
        container.initialize_all()

        # Parse
        df = container.get_parser().parse_file(tmp_path)
        parse_rows = len(df)

        # Clean
        df_clean, _, _ = container.get_cleaner().clean(df)
        cleaned_rows = len(df_clean)

        Path(tmp_path).unlink(missing_ok=True)

        model_metrics = None
        optimization_result = None

        # Train (if enough data)
        if cleaned_rows >= 50:
            model = ChillerEnergyModel()
            try:
                metrics = model.train(df_clean)
                model_metrics = {
                    "mape": round(metrics["mape"], 2),
                    "rmse": round(metrics["rmse"], 2),
                    "r2": round(metrics["r2"], 4),
                }

                # Optimize
                optimizer = ChillerOptimizer(model)
                context = OptimizationContext(
                    load_rt=500,
                    current_chw_pump_hz=50,
                    current_cw_pump_hz=50,
                    current_ct_fan_hz=50,
                )
                result = optimizer.optimize_slsqp(context)
                optimization_result = {
                    "savings_percent": round(result.savings_percent, 1),
                }
            except Exception:
                pass

        return PipelineResponse(
            parse_rows=parse_rows,
            cleaned_rows=cleaned_rows,
            model_metrics=model_metrics,
            optimization_result=optimization_result,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")
