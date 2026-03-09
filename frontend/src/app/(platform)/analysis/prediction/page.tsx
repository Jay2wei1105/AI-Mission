"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumGate } from "@/components/ui/premium-gate";
import { EnergyChart } from "@/components/charts/energy-chart";
import { useUserPlan } from "@/contexts/user-plan";
import {
    TrendingUp,
    Brain,
    Target,
    Lightbulb,
} from "lucide-react";

// Mock prediction data
const mockPredictionData = Array.from({ length: 14 }, (_, i) => {
    const base = 275 + Math.sin(i / 2) * 55;
    return {
        day: `Day ${i + 1}`,
        actual: i < 7 ? Math.round(280 + Math.sin(i / 2) * 60 + (i * 7) % 13) : 0,
        predicted: Math.round(base + (i * 5) % 11),
        upper: Math.round(310 + Math.sin(i / 2) * 55),
        lower: Math.round(240 + Math.sin(i / 2) * 55),
    };
});

const insights = [
    {
        icon: TrendingUp,
        title: "Consumption Trend",
        description: "Energy usage is trending 5.2% lower than last month, primarily due to HVAC optimization.",
        type: "positive",
    },
    {
        icon: Target,
        title: "Peak Demand Alert",
        description: "Predicted peak demand on Day 5 may exceed contracted capacity. Consider load shifting.",
        type: "warning",
    },
    {
        icon: Lightbulb,
        title: "Savings Opportunity",
        description: "Shifting 15% of daytime load to off-peak hours could save NT$8,500/month.",
        type: "info",
    },
];

/**
 * Energy Prediction Analysis Page
 * 
 * @extensibility This page is designed to integrate with:
 * - FastAPI backend for LightGBM/Scikit-learn predictions
 * - WebSocket for real-time prediction updates
 * - Export functionality for reports
 */
export default function PredictionPage() {
    const { userPlan } = useUserPlan();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    Energy Prediction
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    AI-powered energy consumption forecasting and anomaly detection
                </p>
            </div>

            <PremiumGate
                featureName="Energy Prediction Analysis"
                isPremium={userPlan !== "free"}
                description="Unlock AI-powered energy predictions with confidence intervals, anomaly detection, and actionable optimization recommendations."
            >
                <div className="space-y-6">
                    {/* Prediction Chart */}
                    <GlassCard>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-info-muted)]">
                                    <Brain className="h-5 w-5 text-[var(--color-info)]" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                                        14-Day Forecast
                                    </h3>
                                    <p className="text-xs text-[var(--color-text-tertiary)]">
                                        LightGBM model · 94.2% accuracy · Last trained 2h ago
                                    </p>
                                </div>
                            </div>
                        </div>
                        <EnergyChart
                            data={mockPredictionData}
                            dataKeys={[
                                { key: "actual", label: "Actual", color: "var(--color-chart-1)" },
                                { key: "predicted", label: "Predicted", color: "var(--color-chart-2)" },
                                { key: "upper", label: "Upper CI", color: "var(--color-chart-4)" },
                                { key: "lower", label: "Lower CI", color: "var(--color-chart-3)" },
                            ]}
                            xAxisKey="day"
                            yUnit="kWh"
                            height={360}
                        />
                    </GlassCard>

                    {/* AI Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {insights.map((insight) => (
                            <GlassCard key={insight.title} glow>
                                <div className="flex items-start gap-3">
                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${insight.type === "positive" ? "bg-[var(--color-success-muted)]" :
                                        insight.type === "warning" ? "bg-[var(--color-warning-muted)]" :
                                            "bg-[var(--color-info-muted)]"
                                        }`}>
                                        <insight.icon className={`h-4 w-4 ${insight.type === "positive" ? "text-[var(--color-success)]" :
                                            insight.type === "warning" ? "text-[var(--color-warning)]" :
                                                "text-[var(--color-info)]"
                                            }`} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                                            {insight.title}
                                        </h4>
                                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                            {insight.description}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </PremiumGate>
        </div>
    );
}
