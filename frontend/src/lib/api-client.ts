/**
 * HVAC Analytics Backend API Client.
 *
 * Centralized client for communicating with the Python FastAPI backend.
 * All API calls go through this module for consistent error handling,
 * typing, and configuration.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// ============================================================
// Types
// ============================================================

export interface ParseResponse {
    rows: number;
    columns: number;
    column_names: string[];
    preview: Record<string, unknown>[];
}

export interface CleanResponse {
    original_rows: number;
    cleaned_rows: number;
    columns: number;
    violations_detected: number;
    metadata: Record<string, unknown>;
}

export interface PipelineResponse {
    parse_rows: number;
    cleaned_rows: number;
    model_metrics: {
        mape: number;
        rmse: number;
        r2: number;
    } | null;
    optimization_result: {
        savings_percent: number;
    } | null;
}

export interface PredictionRequest {
    site_id?: string;
    load_rt: number;
    chw_supply_temp?: number;
    chw_return_temp?: number;
    cw_supply_temp?: number;
    cw_return_temp?: number;
    outdoor_temp?: number;
    outdoor_humidity?: number;
}

export interface PredictionResponse {
    predicted_kw: number;
    predicted_cop: number;
    confidence: number;
    model_version: string;
}

export interface OptimizeRequest {
    site_id?: string;
    load_rt: number;
    current_chw_pump_hz?: number;
    current_cw_pump_hz?: number;
    current_ct_fan_hz?: number;
    outdoor_temp?: number;
    outdoor_humidity?: number;
}

export interface OptimizeResponse {
    optimal_chw_pump_hz: number;
    optimal_cw_pump_hz: number;
    optimal_ct_fan_hz: number;
    current_kw: number;
    optimized_kw: number;
    savings_kw: number;
    savings_percent: number;
    recommended_chillers: string[];
}

export interface TopologyNode {
    id: string;
    name: string;
    type: string;
    parent_id: string | null;
    metadata: Record<string, unknown>;
    children: TopologyNode[];
}

export interface TopologyResponse {
    site_id: string;
    root: TopologyNode;
    total_nodes: number;
}

// ============================================================
// API Client
// ============================================================

class ApiError extends Error {
    constructor(
        public status: number,
        public detail: string,
    ) {
        super(`API Error ${status}: ${detail}`);
        this.name = "ApiError";
    }
}

async function request<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const url = `${BACKEND_URL}${path}`;

    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options?.headers,
            },
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({ detail: res.statusText }));
            throw new ApiError(res.status, body.detail || "Unknown error");
        }

        return res.json();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(0, `Network error: ${(error as Error).message}`);
    }
}

// ============================================================
// ETL Endpoints
// ============================================================

export const etlApi = {
    /**
     * Parse a CSV file and return structured data preview.
     */
    async parseFile(file: File, siteId = "demo"): Promise<ParseResponse> {
        const formData = new FormData();
        formData.append("file", file);
        return request<ParseResponse>(`/api/v1/etl/parse?site_id=${siteId}`, {
            method: "POST",
            body: formData,
        });
    },

    /**
     * Parse, clean, and validate a CSV file.
     */
    async cleanFile(
        file: File,
        siteId = "demo",
        interval = "5m",
        filterInvalid = false,
    ): Promise<CleanResponse> {
        const formData = new FormData();
        formData.append("file", file);
        const params = new URLSearchParams({
            site_id: siteId,
            interval,
            filter_invalid: String(filterInvalid),
        });
        return request<CleanResponse>(`/api/v1/etl/clean?${params}`, {
            method: "POST",
            body: formData,
        });
    },

    /**
     * Run the full ETL + Training + Optimization pipeline.
     */
    async runPipeline(file: File, siteId = "demo"): Promise<PipelineResponse> {
        const formData = new FormData();
        formData.append("file", file);
        return request<PipelineResponse>(`/api/v1/etl/pipeline?site_id=${siteId}`, {
            method: "POST",
            body: formData,
        });
    },
};

// ============================================================
// Prediction Endpoints
// ============================================================

export const predictApi = {
    /**
     * Predict energy consumption for given operating conditions.
     */
    async predictEnergy(params: PredictionRequest): Promise<PredictionResponse> {
        return request<PredictionResponse>("/api/v1/predict/energy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        });
    },
};

// ============================================================
// Optimization Endpoints
// ============================================================

export const optimizeApi = {
    /**
     * Run chiller plant optimization.
     */
    async runOptimization(params: OptimizeRequest): Promise<OptimizeResponse> {
        return request<OptimizeResponse>("/api/v1/optimize/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        });
    },
};

// ============================================================
// Topology Endpoints
// ============================================================

export const topologyApi = {
    /**
     * Get equipment topology for a site.
     */
    async getTopology(siteId: string): Promise<TopologyResponse> {
        return request<TopologyResponse>(`/api/v1/topology/${siteId}`);
    },

    /**
     * Add a node to the topology.
     */
    async addNode(
        siteId: string,
        node: { name: string; type: string; parent_id: string; metadata?: Record<string, unknown> },
    ) {
        return request(`/api/v1/topology/${siteId}/nodes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(node),
        });
    },
};

// ============================================================
// Health Check
// ============================================================

export async function checkBackendHealth(): Promise<boolean> {
    try {
        const res = await fetch(`${BACKEND_URL}/health`);
        return res.ok;
    } catch {
        return false;
    }
}
