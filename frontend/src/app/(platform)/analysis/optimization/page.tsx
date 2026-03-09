"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { MetricCard } from "@/components/ui/metric-card";
import { PremiumGate } from "@/components/ui/premium-gate";
import { useUserPlan } from "@/contexts/user-plan";
import { StatusBadge } from "@/components/ui/status-badge";
import { EnergyChart } from "@/components/charts/energy-chart";
import {
    Gauge,
    Zap,
    ThermometerSun,
    Droplets,
    Wind,
    ArrowRight,
    CheckCircle,
    AlertTriangle,
    Settings2,
    Play,
    RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock optimization parameters
const mockParameters = [
    {
        id: "1",
        name: "Chiller Supply Temp",
        unit: "°C",
        current: 7.0,
        optimal: 8.2,
        savings: 12500,
        savingsPercent: 8.5,
        risk: "low" as const,
        icon: ThermometerSun,
    },
    {
        id: "2",
        name: "AHU Supply Air Temp",
        unit: "°C",
        current: 14.0,
        optimal: 15.5,
        savings: 8200,
        savingsPercent: 5.2,
        risk: "low" as const,
        icon: Wind,
    },
    {
        id: "3",
        name: "Condenser Water Temp",
        unit: "°C",
        current: 32.0,
        optimal: 29.5,
        savings: 18900,
        savingsPercent: 11.3,
        risk: "medium" as const,
        icon: Droplets,
    },
    {
        id: "4",
        name: "Chiller Loading",
        unit: "%",
        current: 65,
        optimal: 78,
        savings: 6800,
        savingsPercent: 4.1,
        risk: "low" as const,
        icon: Gauge,
    },
];

// Mock efficiency curve data
const mockEfficiencyData = Array.from({ length: 20 }, (_, i) => {
    const load = (i + 1) * 5;
    return {
        load: `${load}%`,
        current: Math.round(0.55 + Math.sin(load / 30) * 0.15 + (load > 60 ? 0.1 : 0) + (i * 3 % 7) * 0.01),
        optimal: +(0.50 + Math.sin(load / 30) * 0.12).toFixed(3),
    };
});

export default function OptimizationPage() {
    const { userPlan } = useUserPlan();
    const [selectedParam, setSelectedParam] = useState<string>("1");
    const [isRunning, setIsRunning] = useState(false);

    const totalSavings = mockParameters.reduce((sum, p) => sum + p.savings, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        Optimization Engine
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        AI-driven control parameter optimization for maximum efficiency
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={cn(
                            "inline-flex items-center gap-2 px-5 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-all",
                            isRunning
                                ? "bg-[var(--color-warning-muted)] text-[var(--color-warning)]"
                                : "bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)] text-white hover:opacity-90 shadow-lg shadow-[var(--color-accent-primary)]/20"
                        )}
                    >
                        {isRunning ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        {isRunning ? "Running..." : "Run Optimization"}
                    </button>
                </div>
            </div>

            <PremiumGate featureName="Optimization Engine" isPremium={userPlan !== "free"}>
                <div className="space-y-6">
                    {/* Summary Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetricCard
                            label="Total Potential Savings"
                            value={totalSavings}
                            unit="NT$/mo"
                            trend="down"
                            trendPercent={-7.8}
                            trendUpIsGood={false}
                            icon={Zap}
                            color="success"
                        />
                        <MetricCard
                            label="Parameters to Optimize"
                            value={mockParameters.length}
                            unit="items"
                            trend="neutral"
                            icon={Settings2}
                            color="accent"
                        />
                        <MetricCard
                            label="Avg Efficiency Gain"
                            value={7.3}
                            unit="%"
                            decimals={1}
                            trend="up"
                            trendPercent={7.3}
                            trendUpIsGood={true}
                            icon={Gauge}
                            color="info"
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Parameter List */}
                        <div className="lg:col-span-2 space-y-3">
                            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider px-1">
                                Optimization Parameters
                            </h3>
                            {mockParameters.map((param) => {
                                const Icon = param.icon;
                                const isSelected = selectedParam === param.id;
                                return (
                                    <button
                                        key={param.id}
                                        onClick={() => setSelectedParam(param.id)}
                                        className={cn(
                                            "w-full glass-card p-4 text-left transition-all duration-200",
                                            isSelected && "ring-1 ring-[var(--color-accent-primary)]/50 bg-[var(--color-accent-muted)]/30"
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg-surface)]">
                                                    <Icon className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{param.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-[var(--color-text-muted)]">
                                                            Current: <span className="font-mono text-[var(--color-text-secondary)]">{param.current}{param.unit}</span>
                                                        </span>
                                                        <ArrowRight className="h-3 w-3 text-[var(--color-text-muted)]" />
                                                        <span className="text-xs font-mono font-semibold text-[var(--color-success)]">
                                                            {param.optimal}{param.unit}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <StatusBadge
                                                variant={param.risk === "low" ? "success" : param.risk === "medium" ? "warning" : "danger"}
                                                size="sm"
                                            >
                                                {param.risk}
                                            </StatusBadge>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between text-xs">
                                            <span className="text-[var(--color-text-muted)]">Potential savings</span>
                                            <span className="font-semibold text-[var(--color-success)]">
                                                NT${param.savings.toLocaleString()}/mo ({param.savingsPercent}%)
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="mt-2 h-1.5 rounded-full bg-[var(--color-bg-surface)] overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[var(--color-success)] to-[var(--color-accent-primary)] transition-all duration-500"
                                                style={{ width: `${param.savingsPercent * 6}%` }}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Efficiency Curve */}
                        <GlassCard className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                                        Efficiency Curve Analysis
                                    </h3>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                                        Current vs Optimal kW/RT across load range
                                    </p>
                                </div>
                            </div>
                            <EnergyChart
                                data={mockEfficiencyData}
                                dataKeys={[
                                    { key: "current", label: "Current", color: "var(--color-chart-4)" },
                                    { key: "optimal", label: "Optimal", color: "var(--color-chart-3)" },
                                ]}
                                xAxisKey="load"
                                yUnit="kW/RT"
                                height={360}
                            />
                        </GlassCard>
                    </div>

                    {/* Recommendations */}
                    <GlassCard>
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                            Optimization Recommendations
                        </h3>
                        <div className="space-y-3">
                            {[
                                { priority: "high", text: "Lower condenser water temperature to 29.5°C to improve chiller COP by 11.3%", action: "Apply Now" },
                                { priority: "medium", text: "Raise chiller supply temperature to 8.2°C during partial load conditions", action: "Schedule" },
                                { priority: "low", text: "Increase chiller loading ratio to 78% by optimizing staging sequence", action: "Review" },
                            ].map((rec, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <div className="flex items-center gap-3">
                                        {rec.priority === "high" ? (
                                            <AlertTriangle className="h-4 w-4 text-[var(--color-warning)] shrink-0" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 text-[var(--color-success)] shrink-0" />
                                        )}
                                        <span className="text-sm text-[var(--color-text-primary)]">{rec.text}</span>
                                    </div>
                                    <button className="shrink-0 px-3 py-1.5 rounded-md bg-[var(--color-accent-muted)] text-xs font-semibold text-[var(--color-accent-light)] hover:bg-[var(--color-accent-primary)]/30 transition-colors">
                                        {rec.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </PremiumGate>
        </div>
    );
}
