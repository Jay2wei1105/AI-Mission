// ===== User & Auth Types =====
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    plan: "free" | "pro" | "enterprise";
    organization?: Organization;
    createdAt: string;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    plan: "free" | "pro" | "enterprise";
    sites: Site[];
}

export interface Site {
    id: string;
    name: string;
    location?: string;
    timezone: string;
    devices: Device[];
    createdAt: string;
}

export interface Device {
    id: string;
    name: string;
    type: "meter" | "sensor" | "controller";
    status: "online" | "offline" | "warning";
    lastReading?: number;
    unit: string;
}

// ===== Dashboard Types =====
export interface DashboardMetric {
    id: string;
    label: string;
    value: number;
    previousValue?: number;
    unit: string;
    trend: "up" | "down" | "neutral";
    trendPercent?: number;
    icon?: string;
    color?: "accent" | "success" | "warning" | "danger" | "info";
}

export interface TimeSeriesDataPoint {
    timestamp: string;
    value: number;
    label?: string;
}

export interface ChartData {
    id: string;
    name: string;
    data: TimeSeriesDataPoint[];
    color?: string;
    unit?: string;
}

// ===== Energy Analysis Types =====
export interface EnergyPrediction {
    id: string;
    period: string;
    predictedConsumption: number;
    confidence: number;
    upperBound: number;
    lowerBound: number;
    recommendations: string[];
}

export interface OptimizationResult {
    id: string;
    parameter: string;
    currentValue: number;
    optimalValue: number;
    potentialSavings: number;
    savingsPercent: number;
    risk: "low" | "medium" | "high";
}

export interface DemandAnalysis {
    id: string;
    peakDemand: number;
    averageDemand: number;
    loadFactor: number;
    demandCharge: number;
    recommendations: string[];
}

// ===== Report Types =====
export interface Report {
    id: string;
    title: string;
    type: "daily" | "weekly" | "monthly" | "custom";
    status: "draft" | "generating" | "completed" | "failed";
    createdAt: string;
    summary?: string;
    downloadUrl?: string;
}

// ===== CSV Import Types =====
export interface CSVImportResult {
    fileName: string;
    rowCount: number;
    columns: string[];
    previewData: Record<string, string | number>[];
    errors?: string[];
    warnings?: string[];
}

// ===== Navigation Types =====
export interface NavItem {
    label: string;
    href: string;
    icon: string;
    badge?: string;
    isPremium?: boolean;
    children?: NavItem[];
}

// ===== API Response Types =====
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    meta?: {
        page: number;
        pageSize: number;
        total: number;
    };
}
