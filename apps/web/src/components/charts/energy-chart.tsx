"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

interface EnergyChartProps {
    /** Chart data points */
    data: Array<Record<string, string | number>>;
    /** Data keys to display as area lines */
    dataKeys: Array<{
        key: string;
        label: string;
        color: string;
    }>;
    /** X-axis data key */
    xAxisKey?: string;
    /** Chart height */
    height?: number;
    /** Show grid lines */
    showGrid?: boolean;
    /** Y-axis unit label */
    yUnit?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * EnergyChart - A premium area chart component for energy time-series data.
 * Built on Recharts with custom dark theme styling.
 *
 * @usage
 * ```tsx
 * <EnergyChart
 *   data={timeSeriesData}
 *   dataKeys={[
 *     { key: "consumption", label: "Consumption", color: "var(--color-chart-1)" },
 *     { key: "prediction", label: "Prediction", color: "var(--color-chart-2)" },
 *   ]}
 *   xAxisKey="time"
 *   yUnit="kWh"
 * />
 * ```
 *
 * @extensibility Add real-time streaming data, annotations for anomaly detection,
 * or zoom/pan capabilities for detailed analysis.
 */
export function EnergyChart({
    data,
    dataKeys,
    xAxisKey = "time",
    height = 320,
    showGrid = true,
    yUnit = "",
    className,
}: EnergyChartProps) {
    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    {/* Gradient definitions */}
                    <defs>
                        {dataKeys.map((dk) => (
                            <linearGradient
                                key={dk.key}
                                id={`gradient-${dk.key}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor={dk.color} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={dk.color} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>

                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                        />
                    )}

                    <XAxis
                        dataKey={xAxisKey}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                        dy={8}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                        dx={-4}
                        tickFormatter={(v: number) => `${v}${yUnit ? ` ${yUnit}` : ""}`}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--color-bg-elevated)",
                            border: "1px solid var(--color-border-strong)",
                            borderRadius: "var(--radius-md)",
                            boxShadow: "var(--shadow-lg)",
                            color: "var(--color-text-primary)",
                            fontSize: "var(--font-size-sm)",
                        }}
                        labelStyle={{ color: "var(--color-text-secondary)", marginBottom: 4 }}
                        cursor={{ stroke: "var(--color-accent-primary)", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ paddingBottom: 12, fontSize: "var(--font-size-xs)" }}
                        iconType="circle"
                        iconSize={8}
                    />

                    {dataKeys.map((dk) => (
                        <Area
                            key={dk.key}
                            type="monotone"
                            dataKey={dk.key}
                            name={dk.label}
                            stroke={dk.color}
                            strokeWidth={2}
                            fill={`url(#gradient-${dk.key})`}
                            dot={false}
                            activeDot={{
                                r: 4,
                                stroke: dk.color,
                                strokeWidth: 2,
                                fill: "var(--color-bg-primary)",
                            }}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
