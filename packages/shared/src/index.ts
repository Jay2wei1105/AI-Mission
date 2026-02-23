/** Shared types and constants for FlowEnergy SaaS */

export const PLAN_LIMITS = {
    free: {
        maxSites: 1,
        maxDevices: 5,
        dataRetentionDays: 7,
        features: ["dashboard", "csv_import", "basic_charts"],
    },
    pro: {
        maxSites: 10,
        maxDevices: 50,
        dataRetentionDays: 90,
        features: [
            "dashboard",
            "csv_import",
            "basic_charts",
            "ai_prediction",
            "optimization",
            "demand_analysis",
            "auto_reports",
            "realtime_streaming",
        ],
    },
    enterprise: {
        maxSites: -1, // unlimited
        maxDevices: -1,
        dataRetentionDays: -1,
        features: ["all"],
    },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;
