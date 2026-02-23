"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Lock, Sparkles } from "lucide-react";

interface PremiumGateProps {
    /** The feature name shown in the upgrade prompt */
    featureName: string;
    /** Whether this user has premium access */
    isPremium?: boolean;
    /** Description of what the premium feature does */
    description?: string;
    /** The feature content (shown when premium, blurred when free) */
    children: React.ReactNode;
    /** Callback when upgrade button is clicked */
    onUpgradeClick?: () => void;
    /** Additional CSS classes */
    className?: string;
}

/**
 * PremiumGate - Wraps premium features with an upgrade prompt for free users.
 * Shows a blurred preview of the content with an overlay upgrade CTA.
 *
 * @usage
 * ```tsx
 * <PremiumGate
 *   featureName="Energy Prediction"
 *   isPremium={user.plan !== 'free'}
 *   onUpgradeClick={() => router.push('/pricing')}
 * >
 *   <EnergyPredictionChart data={data} />
 * </PremiumGate>
 * ```
 *
 * @extensibility Connect onUpgradeClick to your payment flow (Stripe, etc.)
 */
export function PremiumGate({
    featureName,
    isPremium = false,
    description,
    children,
    onUpgradeClick,
    className,
}: PremiumGateProps) {
    if (isPremium) {
        return <>{children}</>;
    }

    return (
        <div className={cn("relative overflow-hidden rounded-[var(--radius-lg)]", className)}>
            {/* Blurred preview of actual content */}
            <div className="pointer-events-none select-none blur-[6px] opacity-50 saturate-50">
                {children}
            </div>

            {/* Upgrade overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-primary)]/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 p-8 text-center max-w-sm">
                    {/* Icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-muted)] ring-1 ring-[var(--color-accent-primary)]/20">
                        <Lock className="h-6 w-6 text-[var(--color-accent-primary)]" />
                    </div>

                    {/* Text */}
                    <div>
                        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--color-text-primary)] mb-1">
                            {featureName}
                        </h3>
                        <p className="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] leading-relaxed">
                            {description || `升級至 Pro 方案以解鎖${featureName}功能，獲得更深入的能源分析洞察。`}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onUpgradeClick}
                        className={cn(
                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-full)]",
                            "bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)]",
                            "text-white text-[var(--font-size-sm)] font-semibold",
                            "shadow-lg shadow-[var(--color-accent-primary)]/25",
                            "hover:shadow-xl hover:shadow-[var(--color-accent-primary)]/30",
                            "hover:scale-105 active:scale-95",
                            "transition-all duration-200"
                        )}
                    >
                        <Sparkles className="h-4 w-4" />
                        升級 Pro
                    </button>
                </div>
            </div>
        </div>
    );
}
