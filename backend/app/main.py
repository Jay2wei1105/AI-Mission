"""
HVAC Analytics - FastAPI Application Entry Point.

Provides REST API for:
- ETL Pipeline (parse, clean, feature engineering)
- ML Predictions (energy consumption forecasting)
- Optimization (chiller plant optimization)
- Topology Management (equipment hierarchy)
- Report Generation
"""

import sys
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure app modules are importable
sys.path.insert(0, str(Path(__file__).parent))

from api.v1 import etl, predict, optimize, topology


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    # Startup
    print("🚀 HVAC Analytics API starting up...")
    yield
    # Shutdown
    print("👋 HVAC Analytics API shutting down...")


app = FastAPI(
    title="HVAC Analytics API",
    description="Energy Management System - Analytics & Optimization Engine",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(etl.router, prefix="/api/v1/etl", tags=["ETL Pipeline"])
app.include_router(predict.router, prefix="/api/v1/predict", tags=["Predictions"])
app.include_router(optimize.router, prefix="/api/v1/optimize", tags=["Optimization"])
app.include_router(topology.router, prefix="/api/v1/topology", tags=["Topology"])


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "HVAC Analytics API",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "components": {
            "api": "up",
            "etl_engine": "up",
            "ml_models": "up",
            "optimizer": "up",
        }
    }
