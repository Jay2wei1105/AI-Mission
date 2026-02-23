"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formatNumber, formatPercent } from "@/lib/utils";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    type LucideIcon,
} from "lucide-react";

interface MetricCardProps {
    /** Label displayed above the value */
    label: string;
    /** Main numeric value */
    value: number;
    /** Unit displayed next to value (kWh, $, %, etc.) */
    unit?: string;
    /** Trend direction */
    trend?: "up" | "down" | "neutral";
    /** Percentage change */
    trendPercent?: number;
    /** Whether "up" trend is good (true) or bad (false) */
    trendUpIsGood?: boolean;
    /** Icon component from lucide-react */
    icon?: LucideIcon;
    /** Card color theme */
    color?: "accent" | "success" | "warning" | "danger" | "info";
    /** Number of decimal places */
    decimals?: number;
    /** Custom formatter for the value */
    formatValue?: (value: number) => string;
    /** Additional CSS classes */
    className?: string;
    /** Click handler for drill-down */
    onClick?: () => void;
}

const colorMap = {
    accent: {
        bg: "bg-[var(--color-accent-muted)]",
        text: "text-[var(--color-accent-primary)]",
        icon: "text-[var(--color-accent-primary)]",
    },
    success: {
        bg: "bg-[var(--color-success-muted)]",
        text: "text-[var(--color-success)]",
        icon: "text-[var(--color-success)]",
    },
    warning: {
        bg: "bg-[var(--color-warning-muted)]",
        text: "text-[var(--color-warning)]",
        icon: "text-[var(--color-warning)]",
    },
    danger: {
        bg: "bg-[var(--color-danger-muted)]",
        text: "text-[var(--color-danger)]",
        icon: "text-[var(--color-danger)]",
    },
    info: {
        bg: "bg-[var(--color-info-muted)]",
        text: "text-[var(--color-info)]",
        icon: "text-[var(--color-info)]",
    },
};

/**
 * MetricCard - Displays a key metric with trend indicator.
 *
 * @usage
 * ```tsx
 * <MetricCard
 *   label="Total Consumption"
 *   value={12450}
 *   unit="kWh"
 *   trend="down"
 *   trendPercent={-5.2}
 *   trendUpIsGood={false}
 *   icon={Zap}
 *   color="accent"
 * />
 * ```
 *
 * @extensibility Add onClick for drill-down, or wrap with real-time
 * data subscription from Python/FastAPI backend.
 */
export function MetricCard({
    label,
    value,
    unit,
    trend = "neutral",
    trendPercent,
    trendUpIsGood = true,
    icon: Icon,
    color = "accent",
    decimals = 0,
    formatValue,
    className,
    onClick,
}: MetricCardProps) {
    const colors = colorMap[color];
    const displayValue = formatValue ? formatValue(value) : formatNumber(value, decimals);

    const trendIsPositive =
        trend === "neutral" ? null : trendUpIsGood ? trend === "up" : trend === "down";

    const TrendIcon =
        trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

    return (
        <div
            className={cn(
                "glass-card group relative overflow-hidden",
                "p-5 transition-all duration-300",
                onClick && "cursor-pointer hover:scale-[1.02]",
                className
            )}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* Background glow */}
            <div
                className={cn(
                    "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
                    colors.bg
                )}
            />

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-[var(--font-size-sm)] font-medium text-[var(--color-text-secondary)] mb-1">
                        {label}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[var(--font-size-3xl)] font-bold tracking-tight text-[var(--color-text-primary)]">
                            {displayValue}
                        </span>
                        {unit && (
                            <span className="text-[var(--font-size-sm)] font-medium text-[var(--color-text-tertiary)]">
                                {unit}
                            </span>
                        )}
                    </div>
                    {trendPercent !== undefined && (
                        <div className="mt-2 flex items-center gap-1">
                            <TrendIcon
                                className={cn(
                                    "h-3.5 w-3.5",
                                    trendIsPositive === null
                                        ? "text-[var(--color-text-tertiary)]"
                                        : trendIsPositive
                                            ? "text-[var(--color-success)]"
                                            : "text-[var(--color-danger)]"
                                )}
                            />
                            <span
                                className={cn(
                                    "text-[var(--font-size-xs)] font-semibold",
                                    trendIsPositive === null
                                        ? "text-[var(--color-text-tertiary)]"
                                        : trendIsPositive
                                            ? "text-[var(--color-success)]"
                                            : "text-[var(--color-danger)]"
                                )}
                            >
                                {formatPercent(trendPercent)}
                            </span>
                            <span className="text-[var(--font-size-xs)] text-[var(--color-text-muted)]">
                                vs 上期
                            </span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div
                        className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]",
                            colors.bg
                        )}
                    >
                        <Icon className={cn("h-5 w-5", colors.icon)} />
                    </div>
                )}
            </div>
        </div>
    );
}
