"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    Bell,
    Search,
    Moon,
    Sun,
    User,
    LogOut,
    Settings,
    ChevronDown,
} from "lucide-react";

interface NavbarProps {
    /** Page title */
    title?: string;
    /** Page subtitle / breadcrumb */
    subtitle?: string;
    /** User name */
    userName?: string;
    /** User plan */
    userPlan?: "free" | "pro" | "enterprise";
}

/**
 * Navbar - Top navigation bar with search, notifications, and user menu.
 *
 * @extensibility Add notification dropdown, search with AI-powered suggestions,
 * or real-time alert indicators from backend WebSocket connections.
 */
export function Navbar({
    title = "Dashboard",
    subtitle,
    userName = "User",
    userPlan = "free",
}: NavbarProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const pathname = usePathname();

    // Map pathnames to Titles and Subtitles
    const getPageInfo = () => {
        if (pathname === "/dashboard") return { title: "Dashboard", subtitle: "Visual neural-net analytics — filter by site, equipment, and node" };
        if (pathname === "/data-hub") return { title: "Data Hub", subtitle: "Manage connections, schemas, and live stream telemetry" };
        if (pathname?.includes("/prediction")) return { title: "Prediction", subtitle: "Deep learning forecasts and trend extrapolations" };
        if (pathname?.includes("/optimization")) return { title: "Optimization", subtitle: "Algorithmic tuning and setpoint recommendations" };
        if (pathname?.includes("/demand")) return { title: "Demand Analysis", subtitle: "Load profiling and peak demand analytics" };
        if (pathname?.includes("/insights")) return { title: "AI Insights", subtitle: "Automated anomaly detection and heuristic reports" };
        if (pathname?.includes("/reports")) return { title: "Reports", subtitle: "Generated summaries and exportable dossiers" };
        if (pathname?.includes("/settings")) return { title: "Settings", subtitle: "System configurations and preferences" };
        return { title: title || "Platform", subtitle: subtitle || "System Interface" };
    };

    const { title: activeTitle, subtitle: activeSubtitle } = getPageInfo();

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#09090b]/60 backdrop-blur-xl px-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            {/* Left - Prominent Active Section Title & Subtitle */}
            <div className="flex flex-col">
                <motion.h1
                    key={activeTitle}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-syne font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
                >
                    {activeTitle}
                </motion.h1>
                <motion.p
                    key={activeSubtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-sm text-zinc-400 font-light mt-0.5 tracking-wide"
                >
                    {activeSubtitle}
                </motion.p>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
                {/* Search */}
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex h-10 items-center gap-2 rounded-full bg-white/[0.03] border border-white/10 px-4 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-all min-w-[240px] focus:outline-none focus:ring-1 focus:ring-cyan-500/50 shadow-inner tracking-wide"
                >
                    <Search className="h-4 w-4" />
                    <span>Search topology...</span>
                    <kbd className="ml-auto hidden rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-zinc-300 sm:inline border border-white/10 shadow-sm">
                        ⌘K
                    </kbd>
                </button>

                {/* Notifications */}
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white transition-all bg-white/[0.03] border border-white/5">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                </button>

                {/* Divider */}
                <div className="mx-2 h-6 w-px bg-white/10" />

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 rounded-full pl-1.5 pr-4 py-1.5 hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="hidden sm:flex flex-col items-start gap-0.5 mt-0.5">
                            <span className="text-sm font-semibold text-white leading-none font-syne tracking-wide">
                                {userName}
                            </span>
                            <StatusBadge
                                variant={userPlan === "free" ? "neutral" : "accent"}
                                size="sm"
                            >
                                {userPlan === "free" ? "Free Node" : userPlan === "pro" ? "Pro Access" : "Enterprise"}
                            </StatusBadge>
                        </div>
                        <ChevronDown className="h-4 w-4 text-zinc-400 ml-1" />
                    </button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsUserMenuOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[#0c0c0e]/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 z-50 pointer-events-auto"
                                >
                                    <div className="flex flex-col">
                                        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                                            <User className="w-4 h-4" /> Profile Settings
                                        </button>
                                        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                                            <Settings className="w-4 h-4" /> Preferences
                                        </button>
                                        <div className="h-px bg-white/10 my-1 mx-2" />
                                        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                                            <LogOut className="w-4 h-4" /> Terminate Session
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Search Modal Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
                            onClick={() => setIsSearchOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-2xl bg-[#121215] border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
                            >
                                <div className="flex items-center px-4 py-4 border-b border-white/5">
                                    <Search className="w-5 h-5 text-cyan-400 mr-3" />
                                    <input
                                        type="text"
                                        placeholder="Search logic nodes, reports, or queries..."
                                        className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-zinc-600 font-medium"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <kbd className="hidden rounded bg-white/5 px-2 py-1 text-xs font-mono text-zinc-500 sm:inline ml-3 border border-white/10">
                                        ESC
                                    </kbd>
                                </div>
                                <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {searchQuery ? (
                                        <div className="py-8 text-center text-zinc-500 text-sm">
                                            Searching neural pathways for <span className="text-cyan-400 font-bold">&quot;{searchQuery}&quot;</span>...
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 px-2">Recent Nodes</div>
                                            <div className="flex flex-col gap-1">
                                                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-zinc-300 transition-colors text-left w-full">
                                                    <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">
                                                        <Search className="w-3 h-3 text-indigo-400" />
                                                    </div>
                                                    Monthly Cost Neural Prediction
                                                </button>
                                                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-zinc-300 transition-colors text-left w-full">
                                                    <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
                                                        <Search className="w-3 h-3 text-emerald-400" />
                                                    </div>
                                                    Optimization Matrix: Chiller-1
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
