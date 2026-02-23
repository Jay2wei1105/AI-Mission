"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumGate } from "@/components/ui/premium-gate";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUserPlan } from "@/contexts/user-plan";
import {
    FileText,
    Download,
    Mail,
    Eye,
    CheckSquare,
    Square,
    Calendar,
    Building2,
    BarChart3,
    TrendingUp,
    AlertTriangle,
    Zap,
    Leaf,
    Settings2,
    FileBarChart,
    Clock,
    Loader2,
    Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Report Modules ───
interface ReportModule {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    premium: boolean;
    pages: number;
}

const reportModules: ReportModule[] = [
    { id: "executive", name: "Executive Summary", description: "KPIs, trends overview, and key highlights", icon: FileBarChart, premium: false, pages: 2 },
    { id: "consumption", name: "Consumption Analysis", description: "Usage breakdown by time, equipment, and site", icon: BarChart3, premium: false, pages: 4 },
    { id: "cost", name: "Cost Analysis", description: "Billing breakdown, tariff optimization, and savings", icon: TrendingUp, premium: true, pages: 3 },
    { id: "anomaly", name: "Anomaly Report", description: "ML-detected anomalies and root-cause analysis", icon: AlertTriangle, premium: true, pages: 3 },
    { id: "benchmark", name: "Benchmarking", description: "EUI across sites vs industry standards", icon: Building2, premium: true, pages: 2 },
    { id: "efficiency", name: "Efficiency Report", description: "Equipment COP/kW/RT performance analysis", icon: Zap, premium: true, pages: 4 },
    { id: "carbon", name: "Carbon & ESG", description: "GHG emissions, scope tracking, sustainability", icon: Leaf, premium: true, pages: 3 },
    { id: "custom", name: "Custom Charts", description: "Include selected dashboard charts in report", icon: Settings2, premium: true, pages: 2 },
];

// ─── Previous Reports ───
const previousReports = [
    { id: "r1", name: "January 2026 Monthly Report", date: "2026-02-01", modules: 5, pages: 18, status: "ready" as const },
    { id: "r2", name: "Q4 2025 Quarterly Review", date: "2026-01-05", modules: 7, pages: 24, status: "ready" as const },
    { id: "r3", name: "2025 Annual Energy Report", date: "2026-01-15", modules: 8, pages: 32, status: "ready" as const },
];

export default function ReportsPage() {
    const { userPlan } = useUserPlan();
    const [selectedModules, setSelectedModules] = useState<string[]>(["executive", "consumption"]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const isPremium = userPlan !== "free";

    const toggleModule = (id: string) => {
        const mod = reportModules.find((m) => m.id === id);
        if (mod?.premium && !isPremium) return;
        setSelectedModules((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const totalPages = selectedModules.reduce((sum, id) => {
        const mod = reportModules.find((m) => m.id === id);
        return sum + (mod?.pages ?? 0);
    }, 0);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setShowPreview(true);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Report Builder</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        Select analysis modules and generate professional energy reports
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ─── Module Selector (Left) ─── */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            Report Modules
                        </h3>
                        <span className="text-xs text-[var(--color-text-muted)]">
                            {selectedModules.length} selected · ~{totalPages} pages
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {reportModules.map((mod) => {
                            const Icon = mod.icon;
                            const isSelected = selectedModules.includes(mod.id);
                            const isLocked = mod.premium && !isPremium;

                            return (
                                <button
                                    key={mod.id}
                                    onClick={() => toggleModule(mod.id)}
                                    className={cn(
                                        "glass-card !p-4 text-left transition-all duration-200",
                                        isLocked && "opacity-50 cursor-not-allowed",
                                        isSelected && !isLocked && "ring-1 ring-[var(--color-accent-primary)]/50 bg-[var(--color-accent-muted)]/30"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                            isSelected ? "bg-[var(--color-accent-primary)]/20" : "bg-[var(--color-bg-surface)]"
                                        )}>
                                            {isLocked ? (
                                                <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
                                            ) : (
                                                <Icon className={cn(
                                                    "h-4 w-4",
                                                    isSelected ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"
                                                )} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{mod.name}</p>
                                                {mod.premium && (
                                                    <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]">
                                                        PRO
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{mod.description}</p>
                                            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">~{mod.pages} pages</p>
                                        </div>
                                        {!isLocked && (
                                            <div className={cn(
                                                "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5",
                                                isSelected
                                                    ? "bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)]"
                                                    : "border-[var(--color-border-strong)]"
                                            )}>
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ─── Config & Actions (Right) ─── */}
                <div className="space-y-4">
                    {/* Report Config */}
                    <GlassCard>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Report Configuration</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Report Title</label>
                                <input type="text" defaultValue="February 2026 Energy Report" className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Date Range</label>
                                <div className="flex items-center gap-2">
                                    <input type="date" defaultValue="2026-02-01" className="flex-1 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]" />
                                    <span className="text-xs text-[var(--color-text-muted)]">to</span>
                                    <input type="date" defaultValue="2026-02-28" className="flex-1 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Site</label>
                                <select className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]">
                                    <option>All Sites</option>
                                    <option>Taipei HQ</option>
                                    <option>Taichung Plant</option>
                                    <option>Kaohsiung Warehouse</option>
                                </select>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Summary & Generate */}
                    <GlassCard glow>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Report Summary</h4>
                        <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                            <div className="flex justify-between">
                                <span>Modules</span>
                                <span className="font-semibold">{selectedModules.length} of {reportModules.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Pages</span>
                                <span className="font-semibold">~{totalPages}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Format</span>
                                <span className="font-semibold">PDF</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleGenerate}
                                disabled={selectedModules.length === 0 || isGenerating}
                                className={cn(
                                    "flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition-all",
                                    selectedModules.length === 0
                                        ? "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] cursor-not-allowed"
                                        : "bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)] text-white hover:opacity-90 shadow-lg shadow-[var(--color-accent-primary)]/20"
                                )}
                            >
                                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                                {isGenerating ? "Generating..." : "Generate Report"}
                            </button>
                        </div>
                    </GlassCard>

                    {/* Export Options */}
                    {showPreview && (
                        <GlassCard>
                            <div className="flex items-center gap-2 mb-3">
                                <StatusBadge variant="success" size="sm">
                                    <FileText className="h-3 w-3" />
                                    Ready
                                </StatusBadge>
                                <span className="text-xs text-[var(--color-text-muted)]">Generated just now</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <Download className="h-4 w-4" />
                                    PDF
                                </button>
                                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <Download className="h-4 w-4" />
                                    Excel
                                </button>
                                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </button>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>

            {/* ─── Report History ─── */}
            <GlassCard noPadding>
                <div className="px-6 py-4 border-b border-[var(--color-border-default)] flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Report History</h3>
                    <span className="text-xs text-[var(--color-text-muted)]">{previousReports.length} reports</span>
                </div>
                <div className="divide-y divide-[var(--color-border-subtle)]">
                    {previousReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--color-glass-hover)] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-bg-surface)]">
                                    <FileText className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{report.name}</p>
                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--color-text-muted)]">
                                        <span><Calendar className="inline h-3 w-3 mr-1" />{report.date}</span>
                                        <span>{report.modules} modules</span>
                                        <span>{report.pages} pages</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge variant="success" size="sm">Ready</StatusBadge>
                                <button className="p-2 rounded-md hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <Download className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                                </button>
                                <button className="p-2 rounded-md hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <Eye className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
