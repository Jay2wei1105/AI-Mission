import React from "react";
import Link from "next/link";
import { Zap, ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 grid-pattern opacity-40" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-accent-primary)]/8 rounded-full blur-[100px]" />

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-info)] mb-4 shadow-lg shadow-[var(--color-accent-primary)]/20">
                        <Zap className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        Welcome back
                    </h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        Sign in to your FlowEnergy account
                    </p>
                </div>

                {/* Form */}
                <div className="glass-card p-8">
                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-10 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-[var(--color-accent-primary)] hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-10 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <Link
                            href="/dashboard"
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-accent-primary)]/20"
                        >
                            Sign In
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-[var(--color-text-muted)]">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="text-[var(--color-accent-primary)] hover:underline font-medium">
                                Start free
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
