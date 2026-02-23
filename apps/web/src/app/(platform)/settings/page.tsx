"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    Settings,
    User,
    Building2,
    Bell,
    Database,
    Shield,
    Globe,
    Palette,
    Mail,
    Key,
    Save,
    Plus,
    Trash2,
    ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "organization", label: "Organization", icon: Building2 },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "data", label: "Data Sources", icon: Database },
    { key: "api", label: "API Keys", icon: Key },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Manage your account, organization, and platform preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all",
                                    activeTab === tab.key
                                        ? "bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]"
                                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Settings */}
                    {activeTab === "profile" && (
                        <>
                            <GlassCard>
                                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                                    Personal Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-info)]">
                                            <User className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <button className="px-3 py-1.5 rounded-md bg-[var(--color-bg-surface)] text-xs font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                                Change Avatar
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Full Name</label>
                                            <input type="text" defaultValue="Demo User" className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                                            <input type="email" defaultValue="demo@flowenergy.io" className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Role</label>
                                            <input type="text" defaultValue="Energy Manager" className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Timezone</label>
                                            <select className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] outline-none transition-colors">
                                                <option>Asia/Taipei (UTC+8)</option>
                                                <option>Asia/Tokyo (UTC+9)</option>
                                                <option>America/New_York (UTC-5)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button className="inline-flex items-center gap-2 px-5 py-2 rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </GlassCard>

                            <GlassCard>
                                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                                    Subscription Plan
                                </h3>
                                <div className="flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)]">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-[var(--color-accent-primary)]" />
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Free Plan</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">1 site · Basic dashboard · 7-day retention</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                        Upgrade to Pro
                                    </button>
                                </div>
                            </GlassCard>
                        </>
                    )}

                    {/* Organization Settings */}
                    {activeTab === "organization" && (
                        <GlassCard>
                            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                                Organization Details
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Organization Name</label>
                                        <input type="text" defaultValue="FlowEnergy Demo" className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent-primary)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Industry</label>
                                        <select className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent-primary)]">
                                            <option>Commercial Building</option>
                                            <option>Manufacturing</option>
                                            <option>Data Center</option>
                                            <option>Hospital / Healthcare</option>
                                            <option>Retail</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 mt-6">Sites / Locations</h4>
                                    <div className="space-y-2">
                                        {[
                                            { name: "Taipei HQ", loc: "Taipei, Taiwan", devices: 4, status: "active" },
                                        ].map((site) => (
                                            <div key={site.name} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)]">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                                                    <div>
                                                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{site.name}</p>
                                                        <p className="text-xs text-[var(--color-text-muted)]">{site.loc} · {site.devices} devices</p>
                                                    </div>
                                                </div>
                                                <StatusBadge variant="success" size="sm">{site.status}</StatusBadge>
                                            </div>
                                        ))}
                                        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-default)] text-sm text-[var(--color-text-muted)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-colors">
                                            <Plus className="h-4 w-4" />
                                            Add Site
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button className="inline-flex items-center gap-2 px-5 py-2 rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                    <Save className="h-4 w-4" />
                                    Save
                                </button>
                            </div>
                        </GlassCard>
                    )}

                    {/* Notifications */}
                    {activeTab === "notifications" && (
                        <GlassCard>
                            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                                Notification Preferences
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Anomaly Alerts", desc: "Get notified when AI detects abnormal energy patterns", enabled: true },
                                    { label: "Daily Summary", desc: "Receive daily energy consumption digest", enabled: true },
                                    { label: "Peak Demand Warning", desc: "Alert when demand approaches contracted capacity", enabled: true },
                                    { label: "Report Ready", desc: "Notification when automated reports are generated", enabled: false },
                                    { label: "System Updates", desc: "Platform updates and maintenance notices", enabled: false },
                                ].map((notif) => (
                                    <div key={notif.label} className="flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)]">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text-primary)]">{notif.label}</p>
                                                <p className="text-xs text-[var(--color-text-muted)]">{notif.desc}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer">
                                            <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                                            <div className="w-9 h-5 rounded-full bg-[var(--color-bg-hover)] peer-checked:bg-[var(--color-accent-primary)] peer-focus:ring-2 peer-focus:ring-[var(--color-accent-primary)]/30 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* Data Sources */}
                    {activeTab === "data" && (
                        <GlassCard>
                            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                                Connected Data Sources
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: "CSV Import", status: "connected", desc: "Manual file upload", type: "file" },
                                    { name: "Modbus TCP", status: "available", desc: "Connect to Modbus-enabled meters", type: "realtime" },
                                    { name: "MQTT Broker", status: "available", desc: "IoT sensor data streaming", type: "realtime" },
                                    { name: "REST API", status: "available", desc: "Custom data feed integration", type: "api" },
                                ].map((source) => (
                                    <div key={source.name} className="flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)]">
                                        <div className="flex items-center gap-3">
                                            <Database className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text-primary)]">{source.name}</p>
                                                <p className="text-xs text-[var(--color-text-muted)]">{source.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge variant={source.status === "connected" ? "success" : "neutral"} size="sm">
                                                {source.status}
                                            </StatusBadge>
                                            <button className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--color-accent-light)] hover:bg-[var(--color-accent-muted)] transition-colors">
                                                {source.status === "connected" ? "Configure" : "Connect"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* API Keys */}
                    {activeTab === "api" && (
                        <GlassCard>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">API Keys</h3>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Manage API keys for programmatic access</p>
                                </div>
                                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <Plus className="h-4 w-4" />
                                    Generate Key
                                </button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: "Production Key", key: "fe_live_****...x8k2", created: "2026-01-10", lastUsed: "2 hours ago" },
                                    { name: "Development Key", key: "fe_test_****...m3j7", created: "2026-02-01", lastUsed: "5 min ago" },
                                ].map((apiKey) => (
                                    <div key={apiKey.name} className="flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)]">
                                        <div>
                                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{apiKey.name}</p>
                                            <p className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5">{apiKey.key}</p>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-1">Created {apiKey.created} · Last used {apiKey.lastUsed}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors">
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </button>
                                            <button className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)] transition-colors">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
}
