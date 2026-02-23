"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Enable hover glow effect */
    glow?: boolean;
    /** Remove padding */
    noPadding?: boolean;
    /** Add gradient animated border */
    gradientBorder?: boolean;
    children: React.ReactNode;
}

/**
 * GlassCard - A glassmorphism card component with optional glow & gradient border effects.
 * 
 * @usage
 * ```tsx
 * <GlassCard glow>
 *   <h3>Energy Usage</h3>
 *   <p>1,234 kWh</p>
 * </GlassCard>
 * ```
 * 
 * @extensibility This component can be wrapped to add AI-powered tooltips,
 * real-time data streaming, or Python backend integration.
 */
export function GlassCard({
    glow = false,
    noPadding = false,
    gradientBorder = false,
    className,
    children,
    ...props
}: GlassCardProps) {
    if (gradientBorder) {
        return (
            <div className={cn("gradient-border", className)} {...props}>
                <div className={cn("relative z-10", !noPadding && "p-6")}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "glass-card",
                !noPadding && "p-6",
                glow && "hover:shadow-[var(--shadow-glow)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
