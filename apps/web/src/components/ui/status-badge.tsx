"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full text-[var(--font-size-xs)] font-medium transition-colors",
    {
        variants: {
            variant: {
                success:
                    "bg-[var(--color-success-muted)] text-[var(--color-success-light)]",
                warning:
                    "bg-[var(--color-warning-muted)] text-[var(--color-warning)]",
                danger:
                    "bg-[var(--color-danger-muted)] text-[var(--color-danger)]",
                info: "bg-[var(--color-info-muted)] text-[var(--color-info)]",
                neutral:
                    "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]",
                accent:
                    "bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]",
            },
            size: {
                sm: "px-2 py-0.5 text-[10px]",
                md: "px-2.5 py-1",
                lg: "px-3 py-1.5 text-[var(--font-size-sm)]",
            },
        },
        defaultVariants: {
            variant: "neutral",
            size: "md",
        },
    }
);

interface StatusBadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
    /** Show animated pulse dot */
    pulse?: boolean;
    children: React.ReactNode;
}

/**
 * StatusBadge - A status indicator badge with optional pulse animation.
 *
 * @usage
 * ```tsx
 * <StatusBadge variant="success" pulse>Online</StatusBadge>
 * <StatusBadge variant="danger">Offline</StatusBadge>
 * <StatusBadge variant="accent" size="lg">Pro</StatusBadge>
 * ```
 */
export function StatusBadge({
    variant,
    size,
    pulse = false,
    className,
    children,
    ...props
}: StatusBadgeProps) {
    return (
        <span
            className={cn(statusBadgeVariants({ variant, size }), className)}
            {...props}
        >
            {pulse && (
                <span className="relative flex h-2 w-2">
                    <span
                        className={cn(
                            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                            variant === "success" && "bg-[var(--color-success)]",
                            variant === "warning" && "bg-[var(--color-warning)]",
                            variant === "danger" && "bg-[var(--color-danger)]",
                            variant === "info" && "bg-[var(--color-info)]",
                            variant === "accent" && "bg-[var(--color-accent-primary)]",
                            (!variant || variant === "neutral") && "bg-[var(--color-text-tertiary)]"
                        )}
                    />
                    <span
                        className={cn(
                            "relative inline-flex h-2 w-2 rounded-full",
                            variant === "success" && "bg-[var(--color-success)]",
                            variant === "warning" && "bg-[var(--color-warning)]",
                            variant === "danger" && "bg-[var(--color-danger)]",
                            variant === "info" && "bg-[var(--color-info)]",
                            variant === "accent" && "bg-[var(--color-accent-primary)]",
                            (!variant || variant === "neutral") && "bg-[var(--color-text-tertiary)]"
                        )}
                    />
                </span>
            )}
            {children}
        </span>
    );
}
