"use client";

import React from "react";
import {
    BarChart3,
    LineChart,
    Activity,
    Gauge,
    Grid3X3,
    TrendingUp,
    AlertTriangle,
    Building2,
    GitBranch,
    PieChart,
    Zap,
    Layers,
    Lock,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChartConfig {
    id: string;
    name: string;
    description: string;
    category: "basic" | "advanced" | "ai";
    icon: React.ElementType;
    premium: boolean;
}

export const availableCharts: ChartConfig[] = [
    // ─── Basic (Free) ───
    { id: "consumption", name: "Energy Consumption", description: "kWh usage over time with trend analysis", category: "basic", icon: LineChart, premium: false },
    { id: "cost", name: "Cost Tracking", description: "NT$ billing by period with rate breakdown", category: "basic", icon: BarChart3, premium: false },
    { id: "equipment", name: "Equipment Comparison", description: "Side-by-side equipment energy usage", category: "basic", icon: Layers, premium: false },
    { id: "peak", name: "Peak Demand Profile", description: "Demand vs contracted capacity over time", category: "basic", icon: Activity, premium: false },
    { id: "powerfactor", name: "Power Factor", description: "Monthly power factor trend with target line", category: "basic", icon: Gauge, premium: false },

    // ─── Advanced (Premium) ───
    { id: "heatmap", name: "Load Profile Heatmap", description: "24h × 7day energy pattern visualization", category: "advanced", icon: Grid3X3, premium: true },
    { id: "regression", name: "Regression Analysis", description: "kWh vs temperature/occupancy correlation", category: "advanced", icon: TrendingUp, premium: true },
    { id: "anomaly", name: "Anomaly Detection", description: "ML-based baseline deviation highlighting", category: "advanced", icon: AlertTriangle, premium: true },
    { id: "eui", name: "EUI Benchmarking", description: "kWh/m² compared to industry standards", category: "advanced", icon: Building2, premium: true },

    // ─── AI-Powered (Premium) ───
    { id: "sankey", name: "Sankey Energy Flow", description: "Energy distribution from source to end-use", category: "ai", icon: GitBranch, premium: true },
    { id: "pareto", name: "Pareto Analysis (80/20)", description: "Top energy consumers ranked by impact", category: "ai", icon: PieChart, premium: true },
    { id: "efficiency", name: "Efficiency Curve (kW/RT)", description: "Chiller performance across load range", category: "ai", icon: Zap, premium: true },
    { id: "demand_response", name: "Demand Response Sim", description: "What-if load shifting scenarios", category: "ai", icon: Layers, premium: true },
];

const categoryLabels = {
    basic: { label: "Basic Charts", desc: "Free" },
    advanced: { label: "Advanced Analytics", desc: "Pro" },
    ai: { label: "AI-Powered", desc: "Pro" },
};

interface ChartSelectorProps {
    enabledCharts: string[];
    onToggle: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
    isPremium: boolean;
}

export function ChartSelector({ enabledCharts, onToggle, isOpen, onClose, isPremium }: ChartSelectorProps) {
    if (!isOpen) return null;

    const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

            {/* Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-[380px] bg-[var(--color-bg-primary)] border-l border-[var(--color-border-default)] z-50 overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-[var(--color-bg-primary)]/90 backdrop-blur-xl border-b border-[var(--color-border-default)] px-5 py-4 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Chart Gallery</h3>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                {enabledCharts.length} of {availableCharts.length} charts active
                            </p>
                        </div>
                        <button onClick={onClose} className="px-3 py-1.5 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors">
                            Done
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-6">
                    {categories.map((cat) => {
                        const charts = availableCharts.filter((c) => c.category === cat);
                        const catMeta = categoryLabels[cat];
                        return (
                            <div key={cat}>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                        {catMeta.label}
                                    </h4>
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                        cat === "basic"
                                            ? "bg-[var(--color-success-muted)] text-[var(--color-success)]"
                                            : "bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]"
                                    )}>
                                        {catMeta.desc}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {charts.map((chart) => {
                                        const Icon = chart.icon;
                                        const isEnabled = enabledCharts.includes(chart.id);
                                        const isLocked = chart.premium && !isPremium;

                                        return (
                                            <button
                                                key={chart.id}
                                                onClick={() => {
                                                    if (!isLocked) onToggle(chart.id);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3 rounded-[var(--radius-md)] text-left transition-all",
                                                    isLocked
                                                        ? "opacity-50 cursor-not-allowed bg-[var(--color-bg-surface)]"
                                                        : isEnabled
                                                            ? "bg-[var(--color-accent-muted)]/40 ring-1 ring-[var(--color-accent-primary)]/30"
                                                            : "bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-hover)]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                                    isEnabled ? "bg-[var(--color-accent-primary)]/20" : "bg-[var(--color-bg-hover)]"
                                                )}>
                                                    {isLocked ? (
                                                        <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
                                                    ) : (
                                                        <Icon className={cn(
                                                            "h-4 w-4",
                                                            isEnabled ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"
                                                        )} />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{chart.name}</p>
                                                        {isLocked && (
                                                            <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]">
                                                                PRO
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-[var(--color-text-muted)] truncate">{chart.description}</p>
                                                </div>
                                                {!isLocked && (
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                                                        isEnabled
                                                            ? "bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)]"
                                                            : "border-[var(--color-border-strong)]"
                                                    )}>
                                                        {isEnabled && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
