"""
Optimization API Endpoints.

Provides chiller plant optimization using SLSQP and other algorithms.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()


class OptimizeRequest(BaseModel):
    """Request body for optimization."""
    site_id: str = Field(default="demo", description="Site configuration ID")
    load_rt: float = Field(..., description="Current cooling load in RT")
    current_chw_pump_hz: float = Field(default=50.0, description="Current CHW pump frequency (Hz)")
    current_cw_pump_hz: float = Field(default=50.0, description="Current CW pump frequency (Hz)")
    current_ct_fan_hz: float = Field(default=50.0, description="Current cooling tower fan frequency (Hz)")
    outdoor_temp: float = Field(default=33.0, description="Outdoor temperature (°C)")
    outdoor_humidity: float = Field(default=70.0, description="Outdoor relative humidity (%)")


class OptimizeResponse(BaseModel):
    """Response from optimization endpoint."""
    optimal_chw_pump_hz: float
    optimal_cw_pump_hz: float
    optimal_ct_fan_hz: float
    current_kw: float
    optimized_kw: float
    savings_kw: float
    savings_percent: float
    recommended_chillers: list[str]


@router.post("/run", response_model=OptimizeResponse)
async def run_optimization(request: OptimizeRequest):
    """
    Run chiller plant optimization for given conditions.

    Uses SLSQP optimization to find optimal pump and fan frequencies
    that minimize total energy consumption.
    """
    try:
        # TODO: Load model and run actual optimization
        # Using placeholder values for now
        current_kw = 450.0
        optimized_kw = 380.0

        return OptimizeResponse(
            optimal_chw_pump_hz=42.5,
            optimal_cw_pump_hz=45.0,
            optimal_ct_fan_hz=38.0,
            current_kw=current_kw,
            optimized_kw=optimized_kw,
            savings_kw=current_kw - optimized_kw,
            savings_percent=round((current_kw - optimized_kw) / current_kw * 100, 1),
            recommended_chillers=["CH-1", "CH-3"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


class HistoryResponse(BaseModel):
    """Response for optimization history."""
    records: list[dict]
    total: int


@router.get("/history", response_model=HistoryResponse)
async def get_optimization_history(
    site_id: str = "demo",
    limit: int = 50,
):
    """
    Get optimization history for a site.
    """
    try:
        # TODO: Implement with history_tracker
        return HistoryResponse(records=[], total=0)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")
