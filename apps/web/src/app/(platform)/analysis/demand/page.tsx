"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { MetricCard } from "@/components/ui/metric-card";
import { PremiumGate } from "@/components/ui/premium-gate";
import { useUserPlan } from "@/contexts/user-plan";
import { StatusBadge } from "@/components/ui/status-badge";
import { EnergyChart } from "@/components/charts/energy-chart";
import {
    BarChart3,
    Zap,
    Clock,
    DollarSign,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock 24-hour demand profile
const mockDemandProfile = Array.from({ length: 24 }, (_, i) => {
    const base = 180 + Math.sin((i - 6) / 3.8) * 120;
    return {
        time: `${String(i).padStart(2, "0")}:00`,
        demand: Math.round(Math.max(80, base + (i * 7) % 23)),
        contracted: 350,
        target: 300,
    };
});

// Mock monthly peak data
const mockMonthlyPeak = [
    { month: "Sep", peak: 312, cost: 28500 },
    { month: "Oct", peak: 298, cost: 26200 },
    { month: "Nov", peak: 276, cost: 23800 },
    { month: "Dec", peak: 265, cost: 22100 },
    { month: "Jan", peak: 288, cost: 25500 },
    { month: "Feb", peak: 301, cost: 27200 },
];

// Mock load shifting suggestions
const mockShiftingSuggestions = [
    {
        from: "13:00–15:00",
        to: "22:00–00:00",
        load: "45 kW",
        saving: "NT$3,200/mo",
        equipment: "Ice Storage Charging",
        difficulty: "easy" as const,
    },
    {
        from: "10:00–12:00",
        to: "06:00–08:00",
        load: "28 kW",
        saving: "NT$1,800/mo",
        equipment: "Pre-cooling HVAC",
        difficulty: "easy" as const,
    },
    {
        from: "14:00–16:00",
        to: "20:00–22:00",
        load: "35 kW",
        saving: "NT$2,500/mo",
        equipment: "EV Charging Schedule",
        difficulty: "medium" as const,
    },
];

export default function DemandAnalysisPage() {
    const { userPlan } = useUserPlan();
    const [selectedMonth, setSelectedMonth] = useState("Feb");

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    Demand Analysis
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Peak demand monitoring, load factor analysis, and demand charge optimization
                </p>
            </div>

            <PremiumGate featureName="Demand Analysis" isPremium={userPlan !== "free"}>
                <div className="space-y-6">
                    {/* KPI Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard label="Peak Demand" value={301} unit="kW" trend="up" trendPercent={4.5} trendUpIsGood={false} icon={Zap} color="warning" />
                        <MetricCard label="Contracted Capacity" value={350} unit="kW" trend="neutral" icon={Target} color="accent" />
                        <MetricCard label="Load Factor" value={68.5} unit="%" decimals={1} trend="up" trendPercent={2.1} trendUpIsGood={true} icon={BarChart3} color="info" />
                        <MetricCard label="Demand Charge" value={27200} unit="NT$/mo" trend="up" trendPercent={6.5} trendUpIsGood={false} icon={DollarSign} color="danger" />
                    </div>

                    {/* Main Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 24h Demand Profile */}
                        <GlassCard className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                                        24-Hour Demand Profile
                                    </h3>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                                        Demand vs contracted capacity
                                    </p>
                                </div>
                                <StatusBadge variant="warning" size="sm">
                                    <AlertTriangle className="h-3 w-3" />
                                    Near Peak
                                </StatusBadge>
                            </div>
                            <EnergyChart
                                data={mockDemandProfile}
                                dataKeys={[
                                    { key: "demand", label: "Demand", color: "var(--color-chart-1)" },
                                    { key: "contracted", label: "Contract", color: "var(--color-chart-5)" },
                                    { key: "target", label: "Target", color: "var(--color-chart-3)" },
                                ]}
                                xAxisKey="time"
                                yUnit="kW"
                                height={320}
                            />
                        </GlassCard>

                        {/* Monthly Peak Trends */}
                        <GlassCard>
                            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                                Monthly Peak Trends
                            </h3>
                            <div className="space-y-3">
                                {mockMonthlyPeak.map((m) => {
                                    const pctOfContract = (m.peak / 350) * 100;
                                    const isSelected = m.month === selectedMonth;
                                    return (
                                        <button
                                            key={m.month}
                                            onClick={() => setSelectedMonth(m.month)}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 rounded-[var(--radius-md)] transition-all text-left",
                                                isSelected
                                                    ? "bg-[var(--color-accent-muted)]/40 ring-1 ring-[var(--color-accent-primary)]/30"
                                                    : "hover:bg-[var(--color-glass-hover)]"
                                            )}
                                        >
                                            <span className="w-8 text-xs font-semibold text-[var(--color-text-secondary)]">{m.month}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-mono font-semibold text-[var(--color-text-primary)]">{m.peak} kW</span>
                                                    <span className="text-xs text-[var(--color-text-muted)]">NT${m.cost.toLocaleString()}</span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-[var(--color-bg-surface)] overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all",
                                                            pctOfContract > 90 ? "bg-[var(--color-danger)]" :
                                                                pctOfContract > 75 ? "bg-[var(--color-warning)]" :
                                                                    "bg-[var(--color-success)]"
                                                        )}
                                                        style={{ width: `${pctOfContract}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Load Shifting Recommendations */}
                    <GlassCard>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                                    Load Shifting Recommendations
                                </h3>
                                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                                    Move loads from peak to off-peak periods to reduce demand charges
                                </p>
                            </div>
                            <span className="text-sm font-semibold text-[var(--color-success)]">
                                Total: NT$7,500/mo potential
                            </span>
                        </div>
                        <div className="space-y-3">
                            {mockShiftingSuggestions.map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
                                                <ArrowDown className="h-3 w-3" />
                                                <span className="font-mono">{s.from}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                                                <ArrowUp className="h-3 w-3" />
                                                <span className="font-mono">{s.to}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{s.equipment}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">Shift {s.load} load</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <StatusBadge variant={s.difficulty === "easy" ? "success" : "warning"} size="sm">
                                            {s.difficulty}
                                        </StatusBadge>
                                        <span className="text-sm font-semibold text-[var(--color-success)]">{s.saving}</span>
                                        <button className="px-3 py-1.5 rounded-md bg-[var(--color-accent-muted)] text-xs font-semibold text-[var(--color-accent-light)] hover:bg-[var(--color-accent-primary)]/30 transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </PremiumGate>
        </div>
    );
}
