"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Crown, User } from "lucide-react";
import { UserPlanProvider, useUserPlan } from "@/contexts/user-plan";

function PlatformInner({ children }: { children: React.ReactNode }) {
    const { userPlan, setUserPlan } = useUserPlan();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#09090b]">
            <div className="fixed inset-0 pointer-events-none grid-pattern opacity-10 z-0 mask-image-radial-center" />

            {/* Sidebar */}
            <Sidebar
                userPlan={userPlan}
                collapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 relative z-10 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[260px]'}`}>
                <Navbar
                    title="Platform"
                    userName="Demo User"
                    userPlan={userPlan}
                />
                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* 🔧 Dev Mode Toggle - Right bottom corner to switch Free/Pro */}
            <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] p-1 shadow-lg">
                <button
                    onClick={() => setUserPlan("free")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${userPlan === "free"
                        ? "bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                        }`}
                >
                    <User className="h-3 w-3" />
                    Free
                </button>
                <button
                    onClick={() => setUserPlan("pro")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${userPlan === "pro"
                        ? "bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)] text-white shadow-sm"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                        }`}
                >
                    <Crown className="h-3 w-3" />
                    Pro
                </button>
            </div>
        </div>
    );
}

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserPlanProvider>
            <PlatformInner>{children}</PlatformInner>
        </UserPlanProvider>
    );
}
