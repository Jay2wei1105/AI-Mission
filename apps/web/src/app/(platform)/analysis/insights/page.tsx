"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumGate } from "@/components/ui/premium-gate";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUserPlan } from "@/contexts/user-plan";
import {
    Brain,
    Lightbulb,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Zap,
    ThermometerSun,
    Clock,
    CheckCircle,
    ChevronRight,
    Sparkles,
    Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock AI insights
const mockInsights = [
    {
        id: "1",
        category: "anomaly",
        severity: "high" as const,
        title: "Abnormal night-time energy spike detected",
        description: "Energy consumption between 02:00–04:00 increased by 45% compared to baseline. This may indicate equipment malfunction or unauthorized usage.",
        metric: "+45% vs baseline",
        timestamp: "Today, 04:23",
        actionable: true,
        actions: ["Inspect HVAC controls", "Check security logs"],
    },
    {
        id: "2",
        category: "savings",
        severity: "medium" as const,
        title: "Chiller sequencing inefficiency identified",
        description: "Running 2 chillers at 40% load each instead of 1 at 80% wastes approximately NT$4,200/month. Consider implementing optimal staging logic.",
        metric: "NT$4,200/mo wasted",
        timestamp: "Yesterday",
        actionable: true,
        actions: ["Optimize staging", "Review schedule"],
    },
    {
        id: "3",
        category: "trend",
        severity: "low" as const,
        title: "Weekday vs Weekend pattern shift",
        description: "Weekend consumption has increased 12% over the past month, suggesting changed occupancy patterns or equipment schedules not adjusted for weekends.",
        metric: "+12% weekend usage",
        timestamp: "This week",
        actionable: true,
        actions: ["Adjust weekend schedule"],
    },
    {
        id: "4",
        category: "savings",
        severity: "medium" as const,
        title: "Outdoor air damper optimization opportunity",
        description: "Current economizer settings miss free cooling opportunities when outdoor temp drops below 18°C. Adjusting setpoints could save 8% on cooling costs.",
        metric: "8% cooling reduction",
        timestamp: "This week",
        actionable: true,
        actions: ["Update damper controls"],
    },
    {
        id: "5",
        category: "anomaly",
        severity: "low" as const,
        title: "Lighting schedule drift detected",
        description: "Floor 3 lights are turning on 30 minutes earlier than scheduled over the past 2 weeks, possibly due to a timer configuration issue.",
        metric: "30 min early activation",
        timestamp: "2 days ago",
        actionable: true,
        actions: ["Reset timer", "Check BMS schedule"],
    },
];

const categories = [
    { key: "all", label: "All Insights", count: 5 },
    { key: "anomaly", label: "Anomalies", count: 2 },
    { key: "savings", label: "Savings", count: 2 },
    { key: "trend", label: "Trends", count: 1 },
];

const severityConfig = {
    high: { color: "danger" as const, icon: AlertTriangle, label: "Critical" },
    medium: { color: "warning" as const, icon: Zap, label: "Important" },
    low: { color: "info" as const, icon: Lightbulb, label: "Suggestion" },
};

const categoryIcon = {
    anomaly: Activity,
    savings: TrendingDown,
    trend: TrendingUp,
};

export default function AIInsightsPage() {
    const { userPlan } = useUserPlan();
    const [activeCategory, setActiveCategory] = useState("all");
    const [expandedInsight, setExpandedInsight] = useState<string | null>("1");

    const filteredInsights = activeCategory === "all"
        ? mockInsights
        : mockInsights.filter((i) => i.category === activeCategory);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        AI Insights
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        AI-powered anomaly detection, energy saving tips, and operational intelligence
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge variant="accent" pulse size="sm">
                        <Sparkles className="h-3 w-3" />
                        5 new insights
                    </StatusBadge>
                </div>
            </div>

            <PremiumGate featureName="AI Insights" isPremium={userPlan !== "free"}>
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <GlassCard className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-danger-muted)]">
                                <AlertTriangle className="h-6 w-6 text-[var(--color-danger)]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--color-text-primary)]">1</p>
                                <p className="text-xs text-[var(--color-text-secondary)]">Critical Alert</p>
                            </div>
                        </GlassCard>
                        <GlassCard className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-success-muted)]">
                                <TrendingDown className="h-6 w-6 text-[var(--color-success)]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--color-text-primary)]">NT$8,400</p>
                                <p className="text-xs text-[var(--color-text-secondary)]">Monthly Savings Found</p>
                            </div>
                        </GlassCard>
                        <GlassCard className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-muted)]">
                                <Brain className="h-6 w-6 text-[var(--color-accent-primary)]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--color-text-primary)]">94.2%</p>
                                <p className="text-xs text-[var(--color-text-secondary)]">Model Confidence</p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all",
                                    activeCategory === cat.key
                                        ? "bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]"
                                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
                                )}
                            >
                                {cat.label}
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                                    activeCategory === cat.key
                                        ? "bg-[var(--color-accent-primary)]/30 text-[var(--color-accent-light)]"
                                        : "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)]"
                                )}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Insights List */}
                    <div className="space-y-3">
                        {filteredInsights.map((insight) => {
                            const sev = severityConfig[insight.severity];
                            const SevIcon = sev.icon;
                            const CatIcon = categoryIcon[insight.category as keyof typeof categoryIcon] || Brain;
                            const isExpanded = expandedInsight === insight.id;

                            return (
                                <GlassCard key={insight.id} noPadding>
                                    <button
                                        onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                                        className="w-full text-left p-5"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                                    insight.severity === "high" ? "bg-[var(--color-danger-muted)]" :
                                                        insight.severity === "medium" ? "bg-[var(--color-warning-muted)]" :
                                                            "bg-[var(--color-info-muted)]"
                                                )}>
                                                    <SevIcon className={cn(
                                                        "h-5 w-5",
                                                        insight.severity === "high" ? "text-[var(--color-danger)]" :
                                                            insight.severity === "medium" ? "text-[var(--color-warning)]" :
                                                                "text-[var(--color-info)]"
                                                    )} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                                                            {insight.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                                        {insight.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 ml-4">
                                                <StatusBadge variant={sev.color} size="sm">{sev.label}</StatusBadge>
                                                <ChevronRight className={cn(
                                                    "h-4 w-4 text-[var(--color-text-muted)] transition-transform",
                                                    isExpanded && "rotate-90"
                                                )} />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded Actions */}
                                    {isExpanded && (
                                        <div className="px-5 pb-5 pt-0 border-t border-[var(--color-border-subtle)] mt-0">
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                                                    <span className="flex items-center gap-1">
                                                        <CatIcon className="h-3 w-3" />
                                                        {insight.category}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {insight.timestamp}
                                                    </span>
                                                    <span className="font-semibold text-[var(--color-text-secondary)]">
                                                        {insight.metric}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {insight.actions.map((action) => (
                                                        <button
                                                            key={action}
                                                            className="px-3 py-1.5 rounded-md bg-[var(--color-accent-muted)] text-xs font-semibold text-[var(--color-accent-light)] hover:bg-[var(--color-accent-primary)]/30 transition-colors"
                                                        >
                                                            {action}
                                                        </button>
                                                    ))}
                                                    <button className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </GlassCard>
                            );
                        })}
                    </div>
                </div>
            </PremiumGate>
        </div>
    );
}
