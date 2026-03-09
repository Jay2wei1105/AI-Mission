"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { MetricCard } from "@/components/ui/metric-card";
import { PremiumGate } from "@/components/ui/premium-gate";
import { useUserPlan } from "@/contexts/user-plan";
import { StatusBadge } from "@/components/ui/status-badge";
import { EnergyChart } from "@/components/charts/energy-chart";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { ChartSelector, availableCharts } from "@/components/dashboard/chart-selector";
import {
    Zap,
    DollarSign,
    TrendingDown,
    Activity,
    Settings2,
    LayoutGrid,
    BarChart3,
    Gauge,
    Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock data generators (deterministic, no Math.random) ───
const mockConsumptionData = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    consumption: Math.round(180 + Math.sin(i / 3) * 80 + (i * 7) % 19),
    prediction: Math.round(175 + Math.sin(i / 3) * 75 + (i * 5) % 11),
}));

const mockCostData = [
    { period: "Sep", onPeak: 18500, offPeak: 8200, demand: 5500 },
    { period: "Oct", onPeak: 17200, offPeak: 7800, demand: 5200 },
    { period: "Nov", onPeak: 15800, offPeak: 7200, demand: 4800 },
    { period: "Dec", onPeak: 14500, offPeak: 6800, demand: 4500 },
    { period: "Jan", onPeak: 16200, offPeak: 7400, demand: 5100 },
    { period: "Feb", onPeak: 17800, offPeak: 8000, demand: 5400 },
];

const mockEquipmentData = [
    { name: "Chiller-1", kWh: 12400 },
    { name: "Chiller-2", kWh: 11800 },
    { name: "AHU-1F", kWh: 4500 },
    { name: "AHU-2F", kWh: 4200 },
    { name: "CW Pump", kWh: 3100 },
    { name: "CT", kWh: 2800 },
    { name: "Lighting", kWh: 2200 },
    { name: "Solar PV", kWh: -1800 },
];

const mockPeakData = Array.from({ length: 24 }, (_, i) => {
    const base = 180 + Math.sin((i - 6) / 3.8) * 120;
    return {
        time: `${String(i).padStart(2, "0")}:00`,
        demand: Math.round(Math.max(80, base + (i * 7) % 23)),
        contracted: 350,
    };
});

const mockPFData = [
    { month: "Sep", pf: 0.92 },
    { month: "Oct", pf: 0.91 },
    { month: "Nov", pf: 0.93 },
    { month: "Dec", pf: 0.94 },
    { month: "Jan", pf: 0.90 },
    { month: "Feb", pf: 0.89 },
];

// Premium mock data
const mockRegressionData = Array.from({ length: 30 }, (_, i) => ({
    temp: `${20 + i * 0.5}`,
    kWh: Math.round(150 + (i * 8) + Math.sin(i / 4) * 30),
    baseline: Math.round(160 + i * 7.5),
}));

const mockEUIData = [
    { building: "Taipei HQ", eui: 185, benchmark: 210 },
    { building: "Taichung", eui: 245, benchmark: 280 },
    { building: "Kaohsiung", eui: 120, benchmark: 150 },
    { building: "Industry Avg", eui: 220, benchmark: 220 },
];

const mockParetoData = [
    { name: "Chiller-1", kWh: 12400, cumPct: 28 },
    { name: "Chiller-2", kWh: 11800, cumPct: 55 },
    { name: "AHU-1F", kWh: 4500, cumPct: 65 },
    { name: "AHU-2F", kWh: 4200, cumPct: 75 },
    { name: "CW Pump", kWh: 3100, cumPct: 82 },
    { name: "CT", kWh: 2800, cumPct: 88 },
    { name: "Lighting", kWh: 2200, cumPct: 93 },
    { name: "Others", kWh: 3000, cumPct: 100 },
];

const mockEfficiencyData = Array.from({ length: 20 }, (_, i) => ({
    load: `${(i + 1) * 5}%`,
    kwrt: +(0.55 + Math.sin((i + 1) * 5 / 30) * 0.15 + (i > 12 ? 0.08 : 0)).toFixed(3),
    optimal: +(0.50 + Math.sin((i + 1) * 5 / 30) * 0.12).toFixed(3),
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Chart Render Map
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderChart(chartId: string, isPremium: boolean) {
    const chartConfig = availableCharts.find((c) => c.id === chartId);
    if (!chartConfig) return null;

    const isLocked = chartConfig.premium && !isPremium;

    const content = (() => {
        switch (chartId) {
            case "consumption":
                return (
                    <EnergyChart
                        data={mockConsumptionData}
                        dataKeys={[
                            { key: "consumption", label: "Actual", color: "var(--color-chart-1)" },
                            { key: "prediction", label: "Predicted", color: "var(--color-chart-2)" },
                        ]}
                        xAxisKey="time" yUnit="kW" height={280}
                    />
                );
            case "cost":
                return (
                    <EnergyChart
                        data={mockCostData}
                        dataKeys={[
                            { key: "onPeak", label: "On-Peak", color: "var(--color-chart-4)" },
                            { key: "offPeak", label: "Off-Peak", color: "var(--color-chart-3)" },
                            { key: "demand", label: "Demand", color: "var(--color-chart-1)" },
                        ]}
                        xAxisKey="period" yUnit="NT$" height={280}
                    />
                );
            case "equipment":
                return (
                    <EnergyChart
                        data={mockEquipmentData}
                        dataKeys={[{ key: "kWh", label: "Energy", color: "var(--color-chart-1)" }]}
                        xAxisKey="name" yUnit="kWh" height={280}
                    />
                );
            case "peak":
                return (
                    <EnergyChart
                        data={mockPeakData}
                        dataKeys={[
                            { key: "demand", label: "Demand", color: "var(--color-chart-4)" },
                            { key: "contracted", label: "Contract", color: "var(--color-chart-5)" },
                        ]}
                        xAxisKey="time" yUnit="kW" height={280}
                    />
                );
            case "powerfactor":
                return (
                    <EnergyChart
                        data={mockPFData}
                        dataKeys={[{ key: "pf", label: "Power Factor", color: "var(--color-chart-3)" }]}
                        xAxisKey="month" yUnit="" height={280}
                    />
                );
            case "regression":
                return (
                    <EnergyChart
                        data={mockRegressionData}
                        dataKeys={[
                            { key: "kWh", label: "Actual kWh", color: "var(--color-chart-1)" },
                            { key: "baseline", label: "Regression", color: "var(--color-chart-2)" },
                        ]}
                        xAxisKey="temp" yUnit="kWh" height={280}
                    />
                );
            case "eui":
                return (
                    <EnergyChart
                        data={mockEUIData}
                        dataKeys={[
                            { key: "eui", label: "EUI (kWh/m²)", color: "var(--color-chart-1)" },
                            { key: "benchmark", label: "Benchmark", color: "var(--color-chart-5)" },
                        ]}
                        xAxisKey="building" yUnit="kWh/m²" height={280}
                    />
                );
            case "pareto":
                return (
                    <EnergyChart
                        data={mockParetoData}
                        dataKeys={[
                            { key: "kWh", label: "Energy (kWh)", color: "var(--color-chart-1)" },
                            { key: "cumPct", label: "Cumulative %", color: "var(--color-chart-4)" },
                        ]}
                        xAxisKey="name" yUnit="kWh" height={280}
                    />
                );
            case "efficiency":
                return (
                    <EnergyChart
                        data={mockEfficiencyData}
                        dataKeys={[
                            { key: "kwrt", label: "Current kW/RT", color: "var(--color-chart-4)" },
                            { key: "optimal", label: "Optimal", color: "var(--color-chart-3)" },
                        ]}
                        xAxisKey="load" yUnit="kW/RT" height={280}
                    />
                );
            // Placeholder for charts that need specialized renderers
            case "heatmap":
            case "anomaly":
            case "sankey":
            case "demand_response":
                return (
                    <div className="flex items-center justify-center h-[280px] text-sm text-[var(--color-text-muted)]">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto mb-3 text-[var(--color-text-tertiary)]" />
                            <p className="font-medium text-[var(--color-text-secondary)]">{chartConfig.name}</p>
                            <p className="text-xs mt-1">Specialized visualization — coming with backend integration</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    })();

    const Icon = chartConfig.icon;

    return (
        <GlassCard key={chartId}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{chartConfig.name}</h3>
                    {chartConfig.premium && (
                        <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]">PRO</span>
                    )}
                </div>
            </div>
            {isLocked ? (
                <PremiumGate
                    featureName={chartConfig.name}
                    isPremium={false}
                    description={chartConfig.description}
                >
                    {content}
                </PremiumGate>
            ) : (
                content
            )}
        </GlassCard>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Dashboard Page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function DashboardPage() {
    const { userPlan } = useUserPlan();
    const [selectedBuilding, setSelectedBuilding] = useState("all");
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [selectedTimeRange, setSelectedTimeRange] = useState("1M");
    const [enabledCharts, setEnabledCharts] = useState(["consumption", "cost", "equipment", "peak", "powerfactor"]);
    const [selectorOpen, setSelectorOpen] = useState(false);

    const isPremium = userPlan !== "free";

    const containerAnim = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
    };

    const toggleChart = (id: string) => {
        setEnabledCharts((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const freeCharts = enabledCharts.filter((id) => !availableCharts.find((c) => c.id === id)?.premium);
    const premiumCharts = enabledCharts.filter((id) => availableCharts.find((c) => c.id === id)?.premium);

    return (
        <motion.div variants={containerAnim} initial="hidden" animate="show" className="space-y-8 relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none grid-pattern opacity-10 z-0 mask-image-radial-center" />
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />

            {/* Header / Actions */}
            <motion.div variants={itemAnim} className="flex justify-end relative z-10">
                <div className="flex items-center gap-4">
                    <StatusBadge variant="success" pulse size="sm">Live WebSockets</StatusBadge>
                    <button
                        onClick={() => setSelectorOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] backdrop-blur-md"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Views ({enabledCharts.length})
                    </button>
                </div>
            </motion.div>

            {/* Filter Bar */}
            <motion.div variants={itemAnim} className="relative z-10">
                <FilterBar
                    selectedBuilding={selectedBuilding}
                    onBuildingChange={setSelectedBuilding}
                    selectedEquipment={selectedEquipment}
                    onEquipmentChange={setSelectedEquipment}
                    selectedTimeRange={selectedTimeRange}
                    onTimeRangeChange={setSelectedTimeRange}
                />
            </motion.div>

            {/* KPI Summary */}
            <motion.div variants={itemAnim} className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <MetricCard label="Total Consumption" value={48500} unit="kWh" trend="down" trendPercent={-5.2} trendUpIsGood={false} icon={Zap} color="accent" />
                <MetricCard label="Energy Cost" value={87200} unit="NT$" trend="down" trendPercent={-3.8} trendUpIsGood={false} icon={DollarSign} color="success" />
                <MetricCard label="Peak Demand" value={301} unit="kW" trend="up" trendPercent={4.5} trendUpIsGood={false} icon={Activity} color="warning" />
                <MetricCard label="Carbon Emissions" value={26.4} unit="tCO₂e" decimals={1} trend="down" trendPercent={-7.3} trendUpIsGood={false} icon={TrendingDown} color="info" />
            </motion.div>

            {/* Chart Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10 auto-rows-max">
                <AnimatePresence>
                    {enabledCharts.map((chartId) => (
                        <motion.div
                            key={chartId}
                            variants={itemAnim}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="h-full"
                        >
                            {renderChart(chartId, isPremium)}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty state if no charts */}
            {enabledCharts.length === 0 && (
                <motion.div variants={itemAnim} className="relative z-10 w-full h-[300px] flex justify-center items-center">
                    <div className="absolute inset-0 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-3xl" />
                    <div className="relative text-center p-12">
                        <LayoutGrid className="h-16 w-16 mx-auto text-zinc-600 mb-6 drop-shadow-md" />
                        <p className="text-xl font-syne font-bold text-white mb-2">Telemetry Grid Empty</p>
                        <p className="text-sm text-zinc-400 mb-8 max-w-sm">
                            Click &quot;Views&quot; to inject neural-net analytical visualizers into this dashboard instance.
                        </p>
                        <button
                            onClick={() => setSelectorOpen(true)}
                            className="px-8 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                        >
                            Open Node Interface
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Chart Selector Panel */}
            <div className="relative z-50">
                <ChartSelector
                    enabledCharts={enabledCharts}
                    onToggle={toggleChart}
                    isOpen={selectorOpen}
                    onClose={() => setSelectorOpen(false)}
                    isPremium={isPremium}
                />
            </div>
        </motion.div>
    );
}
