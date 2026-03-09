"use client";

import React, { useState } from "react";
import {
    Building2,
    Cpu,
    Calendar,
    ChevronDown,
    X,
    Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock filter options ───
const buildings = [
    { id: "all", name: "All Sites" },
    { id: "s1", name: "Taipei HQ" },
    { id: "s2", name: "Taichung Plant" },
    { id: "s3", name: "Kaohsiung Warehouse" },
];

const equipmentGroups = [
    {
        group: "Chillers",
        items: [
            { id: "ch1", name: "Chiller-1 (500RT)" },
            { id: "ch2", name: "Chiller-2 (500RT)" },
            { id: "ch3", name: "Chiller-3 (350RT)" },
        ],
    },
    {
        group: "AHU",
        items: [
            { id: "ahu1", name: "AHU-1F" },
            { id: "ahu2", name: "AHU-2F" },
            { id: "ahu3", name: "AHU-3F" },
        ],
    },
    {
        group: "Others",
        items: [
            { id: "pump1", name: "CW Pump" },
            { id: "ct1", name: "Cooling Tower" },
            { id: "solar", name: "Solar PV" },
            { id: "lighting", name: "Lighting System" },
        ],
    },
];

const timeRanges = [
    { key: "1D", label: "Today" },
    { key: "1W", label: "This Week" },
    { key: "1M", label: "This Month" },
    { key: "3M", label: "3 Months" },
    { key: "1Y", label: "1 Year" },
    { key: "custom", label: "Custom" },
];

interface FilterBarProps {
    selectedBuilding: string;
    onBuildingChange: (id: string) => void;
    selectedEquipment: string[];
    onEquipmentChange: (ids: string[]) => void;
    selectedTimeRange: string;
    onTimeRangeChange: (key: string) => void;
}

export function FilterBar({
    selectedBuilding,
    onBuildingChange,
    selectedEquipment,
    onEquipmentChange,
    selectedTimeRange,
    onTimeRangeChange,
}: FilterBarProps) {
    const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
    const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);
    const [equipSearch, setEquipSearch] = useState("");

    const selectedBuildingName = buildings.find((b) => b.id === selectedBuilding)?.name ?? "All Sites";

    const toggleEquipment = (id: string) => {
        if (selectedEquipment.includes(id)) {
            onEquipmentChange(selectedEquipment.filter((e) => e !== id));
        } else {
            onEquipmentChange([...selectedEquipment, id]);
        }
    };

    const selectAll = () => {
        const allIds = equipmentGroups.flatMap((g) => g.items.map((i) => i.id));
        onEquipmentChange(allIds);
    };

    const clearAll = () => onEquipmentChange([]);

    return (
        <div className="glass-card !p-3 flex flex-wrap items-center gap-3">
            {/* Building Selector */}
            <div className="relative">
                <button
                    onClick={() => { setShowBuildingDropdown(!showBuildingDropdown); setShowEquipmentDropdown(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] transition-colors min-w-[160px]"
                >
                    <Building2 className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                    <span className="flex-1 text-left">{selectedBuildingName}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                </button>
                {showBuildingDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-56 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] shadow-xl z-50 py-1">
                        {buildings.map((b) => (
                            <button
                                key={b.id}
                                onClick={() => { onBuildingChange(b.id); setShowBuildingDropdown(false); }}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm transition-colors",
                                    selectedBuilding === b.id
                                        ? "bg-[var(--color-accent-muted)] text-[var(--color-accent-light)] font-medium"
                                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                                )}
                            >
                                {b.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Equipment Multi-Select */}
            <div className="relative">
                <button
                    onClick={() => { setShowEquipmentDropdown(!showEquipmentDropdown); setShowBuildingDropdown(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] transition-colors min-w-[200px]"
                >
                    <Cpu className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                    <span className="flex-1 text-left">
                        {selectedEquipment.length === 0
                            ? "Select Equipment"
                            : `${selectedEquipment.length} selected`}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                </button>
                {showEquipmentDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-72 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] shadow-xl z-50 max-h-80 overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-[var(--color-border-subtle)]">
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[var(--color-bg-surface)]">
                                <Search className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search equipment..."
                                    value={equipSearch}
                                    onChange={(e) => setEquipSearch(e.target.value)}
                                    className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                                />
                            </div>
                        </div>
                        {/* Select all / Clear */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--color-border-subtle)]">
                            <button onClick={selectAll} className="text-xs text-[var(--color-accent-light)] hover:underline">Select All</button>
                            <button onClick={clearAll} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">Clear</button>
                        </div>
                        {/* Groups */}
                        <div className="overflow-y-auto max-h-52 py-1">
                            {equipmentGroups.map((group) => (
                                <div key={group.group}>
                                    <p className="px-3 py-1 text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                        {group.group}
                                    </p>
                                    {group.items
                                        .filter((item) => item.name.toLowerCase().includes(equipSearch.toLowerCase()))
                                        .map((item) => (
                                            <label
                                                key={item.id}
                                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEquipment.includes(item.id)}
                                                    onChange={() => toggleEquipment(item.id)}
                                                    className="rounded border-[var(--color-border-default)] text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)]"
                                                />
                                                <span className="text-sm text-[var(--color-text-secondary)]">{item.name}</span>
                                            </label>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-0.5 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]">
                <Calendar className="h-4 w-4 text-[var(--color-text-tertiary)] ml-2" />
                {timeRanges.map((tr) => (
                    <button
                        key={tr.key}
                        onClick={() => onTimeRangeChange(tr.key)}
                        className={cn(
                            "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                            selectedTimeRange === tr.key
                                ? "bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                        )}
                    >
                        {tr.label}
                    </button>
                ))}
            </div>

            {/* Active filter tags */}
            {selectedEquipment.length > 0 && (
                <div className="flex items-center gap-1 ml-auto">
                    {selectedEquipment.slice(0, 3).map((id) => {
                        const item = equipmentGroups.flatMap((g) => g.items).find((i) => i.id === id);
                        return (
                            <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-accent-muted)] text-[10px] font-medium text-[var(--color-accent-light)]">
                                {item?.name}
                                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => toggleEquipment(id)} />
                            </span>
                        );
                    })}
                    {selectedEquipment.length > 3 && (
                        <span className="text-[10px] text-[var(--color-text-muted)]">+{selectedEquipment.length - 3} more</span>
                    )}
                </div>
            )}
        </div>
    );
}
