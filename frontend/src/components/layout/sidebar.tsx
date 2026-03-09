"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Database,
    TrendingUp,
    Gauge,
    BarChart3,
    Brain,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    Crown,
    Zap,
    Lock,
    Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    userPlan?: "free" | "pro" | "enterprise";
    collapsed?: boolean;
    onToggle?: () => void;
}

const navSections = [
    {
        title: "Main",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, isPremium: false },
            { label: "Data Hub", href: "/data-hub", icon: Database, isPremium: false },
        ],
    },
    {
        title: "Data Analysis",
        items: [
            { label: "Prediction", href: "/analysis/prediction", icon: TrendingUp, isPremium: true },
            { label: "Optimization", href: "/analysis/optimization", icon: Gauge, isPremium: true },
            { label: "Demand Analysis", href: "/analysis/demand", icon: BarChart3, isPremium: true },
            { label: "AI Insights", href: "/analysis/insights", icon: Brain, isPremium: true },
        ],
    },
    {
        title: "Output",
        items: [
            { label: "Reports", href: "/reports", icon: FileText, isPremium: false },
            { label: "Settings", href: "/settings", icon: Settings, isPremium: false },
        ],
    },
];

export function Sidebar({ userPlan = "free", collapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const isPremiumUser = userPlan !== "free";

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/5 bg-[#09090b]/80 backdrop-blur-2xl transition-all duration-300 shadow-[20px_0_40px_rgba(0,0,0,0.5)]",
                collapsed ? "w-[80px]" : "w-[260px]"
            )}
        >
            {/* Logo */}
            <div className="flex h-20 items-center justify-center border-b border-white/5">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full px-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-syne font-bold tracking-tight text-white line-clamp-1">
                            FlowEnergy
                        </span>
                    )}
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                {navSections.map((section) => (
                    <div key={section.title} className="mb-6">
                        {!collapsed && (
                            <p className="mb-3 px-2 text-[10px] font-syne font-bold uppercase tracking-widest text-zinc-500">
                                {section.title}
                            </p>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                                const isLocked = item.isPremium && !isPremiumUser;

                                return (
                                    <Link
                                        key={item.href}
                                        href={isLocked ? "#" : item.href}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 overflow-hidden relative",
                                            isActive
                                                ? "text-cyan-400 bg-cyan-950/30 border border-cyan-500/20"
                                                : isLocked
                                                    ? "text-zinc-600 cursor-not-allowed"
                                                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent",
                                            collapsed && "justify-center"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-full" />}
                                        <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", isActive && "text-cyan-400", !isActive && !isLocked && "group-hover:scale-110")} />
                                        {!collapsed && (
                                            <>
                                                <span className="flex-1 truncate tracking-wide">{item.label}</span>
                                                {isLocked && <Lock className="h-3 w-3 text-zinc-600" />}
                                                {item.isPremium && !isLocked && (
                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap tracking-wider">
                                                        PRO
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Upgrade CTA (free users only) */}
            {!isPremiumUser && !collapsed && (
                <div className="mx-4 mb-4 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-syne font-bold text-white">Upgrade Neural Net</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
                        Unlock advanced prediction models, anomaly detection, and automated reports.
                    </p>
                    <button className="w-full py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        Unlock Pro Access
                    </button>
                </div>
            )}

            {/* Collapse toggle */}
            <div className="p-4 border-t border-white/5 relative bg-[#09090b]">
                <button
                    onClick={onToggle}
                    className="flex w-full items-center justify-center h-10 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10 group"
                >
                    <div className="w-full flex items-center justify-center relative">
                        {collapsed ? <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /> : <ChevronLeft className="h-5 w-5 absolute left-3 group-hover:-translate-x-1 transition-transform" />}
                        {!collapsed && <span className="text-xs font-medium tracking-wide">Collapse</span>}
                    </div>
                </button>
            </div>
        </aside>
    );
}
