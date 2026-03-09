"use client";

import React, { useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    AlertTriangle,
    Trash2,
    Eye,
    ArrowRight,
    FileUp,
    Table,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock previously imported files
const mockImportedFiles = [
    {
        id: "1",
        name: "chiller_data_2026_01.csv",
        rows: 8760,
        columns: 12,
        size: "2.4 MB",
        importedAt: "2026-01-15",
        status: "success" as const,
    },
    {
        id: "2",
        name: "ahu_hourly_readings.csv",
        rows: 4380,
        columns: 8,
        size: "1.1 MB",
        importedAt: "2026-02-01",
        status: "success" as const,
    },
    {
        id: "3",
        name: "solar_panel_output.csv",
        rows: 2190,
        columns: 6,
        size: "0.5 MB",
        importedAt: "2026-02-18",
        status: "warning" as const,
    },
];

// Mock preview data
const mockPreviewData = [
    { timestamp: "2026-01-01 00:00", kW: 245.3, kWh: 245.3, temp: 22.1, humidity: 65, cost: 980 },
    { timestamp: "2026-01-01 01:00", kW: 238.7, kWh: 238.7, temp: 21.8, humidity: 66, cost: 955 },
    { timestamp: "2026-01-01 02:00", kW: 221.5, kWh: 221.5, temp: 21.3, humidity: 67, cost: 886 },
    { timestamp: "2026-01-01 03:00", kW: 215.2, kWh: 215.2, temp: 20.9, humidity: 68, cost: 861 },
    { timestamp: "2026-01-01 04:00", kW: 218.9, kWh: 218.9, temp: 20.5, humidity: 69, cost: 876 },
];

export default function DataImportPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setUploadedFile({ name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` });
            setShowPreview(true);
        }
    }, []);

    const handleFileSelect = useCallback(() => {
        // Simulate file selection
        setUploadedFile({ name: "energy_data_2026.csv", size: "3.2 MB" });
        setShowPreview(true);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    Data Import
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Upload CSV files or connect real-time data sources
                </p>
            </div>

            {/* Upload Zone */}
            <GlassCard noPadding>
                <div
                    className={cn(
                        "relative flex flex-col items-center justify-center py-16 px-8 border-2 border-dashed rounded-[var(--radius-lg)] m-1 transition-all duration-300",
                        isDragging
                            ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-muted)]"
                            : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-muted)] mb-4">
                        <FileUp className="h-8 w-8 text-[var(--color-accent-primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                        {isDragging ? "Drop your file here" : "Upload CSV File"}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                        Drag and drop or click to browse. Supports .csv, .xlsx formats.
                    </p>
                    <button
                        onClick={handleFileSelect}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                        <Upload className="h-4 w-4" />
                        Browse Files
                    </button>
                    <div className="flex items-center gap-6 mt-6 text-xs text-[var(--color-text-muted)]">
                        <span>Max 50MB</span>
                        <span>•</span>
                        <span>UTF-8 Encoding</span>
                        <span>•</span>
                        <span>Headers Required</span>
                    </div>
                </div>
            </GlassCard>

            {/* File Preview */}
            {showPreview && uploadedFile && (
                <GlassCard>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-success-muted)]">
                                <FileSpreadsheet className="h-5 w-5 text-[var(--color-success)]" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{uploadedFile.name}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{uploadedFile.size} · 5 columns · 8,760 rows</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setShowPreview(false); setUploadedFile(null); }}
                                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--color-bg-hover)] transition-colors"
                            >
                                <X className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                            </button>
                        </div>
                    </div>

                    {/* Column Mapping */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Column Mapping</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {["timestamp → Time", "kW → Power (kW)", "kWh → Energy (kWh)", "temp → Temperature (°C)", "humidity → Humidity (%)", "cost → Cost (NT$)"].map((mapping) => (
                                <div key={mapping} className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-bg-surface)] text-xs">
                                    <CheckCircle className="h-3.5 w-3.5 text-[var(--color-success)] shrink-0" />
                                    <span className="text-[var(--color-text-secondary)]">{mapping}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Preview Table */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Data Preview</h4>
                        <div className="overflow-x-auto rounded-lg border border-[var(--color-border-default)]">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-[var(--color-bg-surface)]">
                                        {Object.keys(mockPreviewData[0]).map((col) => (
                                            <th key={col} className="px-4 py-2.5 text-left font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-default)]">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockPreviewData.map((row, i) => (
                                        <tr key={i} className="hover:bg-[var(--color-glass-hover)] transition-colors">
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} className="px-4 py-2 text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] font-mono">
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={() => { setShowPreview(false); setUploadedFile(null); }}
                            className="px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button className="inline-flex items-center gap-2 px-6 py-2 rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-info)] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-accent-primary)]/20">
                            <Upload className="h-4 w-4" />
                            Confirm Import
                        </button>
                    </div>
                </GlassCard>
            )}

            {/* Import History */}
            <GlassCard noPadding>
                <div className="px-6 py-4 border-b border-[var(--color-border-default)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Table className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                            Import History
                        </h3>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{mockImportedFiles.length} files</span>
                </div>
                <div className="divide-y divide-[var(--color-border-subtle)]">
                    {mockImportedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--color-glass-hover)] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-bg-surface)]">
                                    <FileSpreadsheet className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{file.name}</p>
                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--color-text-muted)]">
                                        <span>{file.rows.toLocaleString()} rows</span>
                                        <span>•</span>
                                        <span>{file.columns} columns</span>
                                        <span>•</span>
                                        <span>{file.size}</span>
                                        <span>•</span>
                                        <span>{file.importedAt}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge variant={file.status === "success" ? "success" : "warning"} size="sm">
                                    {file.status === "success" ? (
                                        <><CheckCircle className="h-3 w-3" /> Complete</>
                                    ) : (
                                        <><AlertTriangle className="h-3 w-3" /> Partial</>
                                    )}
                                </StatusBadge>
                                <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--color-bg-hover)] transition-colors">
                                    <Eye className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--color-danger-muted)] transition-colors">
                                    <Trash2 className="h-4 w-4 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
