"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    Database,
    Cpu,
    Server,
    ChevronRight,
    Upload,
    Link as LinkIcon,
    Terminal,
    ArrowRightLeft,
    Plus,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface TopologyNode {
    id: string;
    name: string;
    type: "site" | "building" | "equipment";
    status?: "online" | "warning" | "offline";
    children?: TopologyNode[];
}

// --- Mock Topology Data ---
const topologyData: TopologyNode[] = [
    {
        id: "site-1",
        name: "Taipei HQ",
        type: "site",
        children: [
            {
                id: "bldg-1a",
                name: "Building A",
                type: "building",
                children: [
                    { id: "eq-1", name: "Chiller-1 (Main)", type: "equipment", status: "online" },
                    { id: "eq-2", name: "AHU-Roof", type: "equipment", status: "warning" },
                    { id: "eq-3", name: "Smart Meter (Floor 5)", type: "equipment", status: "online" }
                ]
            },
            {
                id: "bldg-1b",
                name: "Data Center Annex",
                type: "building",
                children: [
                    { id: "eq-4", name: "CRAC-1", type: "equipment", status: "online" },
                    { id: "eq-5", name: "UPS Bank A", type: "equipment", status: "online" }
                ]
            }
        ]
    },
    {
        id: "site-2",
        name: "Taichung Plant",
        type: "site",
        children: [
            {
                id: "bldg-2a",
                name: "Fab 1",
                type: "building",
                children: [
                    { id: "eq-6", name: "Air Compressor 01", type: "equipment", status: "offline" }
                ]
            }
        ]
    }
];

// --- Mock Mapping Data ---
const mockCsvHeaders = ["T_in", "T_out", "Flow_Rate", "Power_kW", "Timestamp_Raw"];
const systemVariables = [
    { id: "sys_temp_in", label: "Chilled Water Inlet Temp (°C)" },
    { id: "sys_temp_out", label: "Chilled Water Outlet Temp (°C)" },
    { id: "sys_flow", label: "Water Flow Rate (L/s)" },
    { id: "sys_power", label: "Active Power (kW)" },
    { id: "sys_energy", label: "Accumulated Energy (kWh)" },
    { id: "sys_time", label: "Observation Time" },
];

const mockLogs = [
    { id: 1, time: "10:45:01", type: "success", msg: "API Sync complete: 140 records fetched (Chiller-1)" },
    { id: 2, time: "10:30:12", type: "warning", msg: "CSV Parse Warning: Row 45 detected Null value in [Flow_Rate]" },
    { id: 3, time: "10:15:00", type: "info", msg: "Stream initialized for Smart Meter (Floor 5)" },
    { id: 4, time: "09:00:23", type: "success", msg: "Nightly batch processing completed." },
    { id: 5, time: "08:42:11", type: "error", msg: "Connection timeout to CRAC-1 MQTT Broker." },
];

// --- Component Props ---
interface TreeNodeProps {
    node: TopologyNode;
    level?: number;
    expandedNodes: Record<string, boolean>;
    selectedEquipment: string;
    toggleNode: (id: string, e: React.MouseEvent) => void;
    setSelectedEquipment: (id: string) => void;
}

// Recursive component for Topology Tree
const TreeNode = ({ node, level = 0, expandedNodes, selectedEquipment, toggleNode, setSelectedEquipment }: TreeNodeProps) => {
    const isExpanded = expandedNodes[node.id];
    const isSelected = selectedEquipment === node.id;
    const hasChildren = node.children && node.children.length > 0;

    let Icon = Building2;
    if (node.type === "building") Icon = Server;
    if (node.type === "equipment") Icon = Cpu;

    return (
        <div className="flex flex-col">
            <div
                className={cn(
                    "flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent group",
                    isSelected
                        ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-300 shadow-[inset_2px_0_0_rgb(6,182,212)]"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
                    level > 0 && "ml-4"
                )}
                onClick={() => node.type === "equipment" ? setSelectedEquipment(node.id) : null}
            >
                <div onClick={(e) => toggleNode(node.id, e)} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                    {hasChildren ? (
                        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform duration-200", isExpanded && "rotate-90")} />
                    ) : (
                        <div className="w-3.5 h-3.5" /> // Spacer
                    )}
                </div>
                <Icon className={cn("w-4 h-4", isSelected ? "text-cyan-400" : "text-zinc-500")} />
                <span className="text-sm font-medium truncate">{node.name}</span>

                {node.type === "equipment" && (
                    <div className={cn(
                        "ml-auto w-1.5 h-1.5 rounded-full",
                        node.status === "online" ? "bg-emerald-500 shadow-[0_0_5px_theme(colors.emerald.500)]" :
                            node.status === "warning" ? "bg-amber-500 shadow-[0_0_5px_theme(colors.amber.500)]" :
                                "bg-red-500 shadow-[0_0_5px_theme(colors.red.500)]"
                    )} />
                )}
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden border-l border-white/5 ml-5 mt-1"
                    >
                        {node.children && node.children.map((child: TopologyNode) => (
                            <TreeNode
                                key={child.id}
                                node={child}
                                level={level + 1}
                                expandedNodes={expandedNodes}
                                selectedEquipment={selectedEquipment}
                                toggleNode={toggleNode}
                                setSelectedEquipment={setSelectedEquipment}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function DataHubPage() {
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ "site-1": true, "bldg-1a": true });
    const [selectedEquipment, setSelectedEquipment] = useState<string>("eq-1");

    // To simulate different ingest states
    const [ingestMode, setIngestMode] = useState<"idle" | "csv" | "api">("csv");

    const toggleNode = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Helper to find selected node details globally
    const getSelectedNodeInfo = (id: string, nodes: TopologyNode[]): TopologyNode | null => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = getSelectedNodeInfo(id, node.children);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedNodeInfo = getSelectedNodeInfo(selectedEquipment, topologyData);

    // Modal state for Add Asset
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 text-white min-h-[600px]">
            {/* Background elements inherited from layout, we just add local glow */}

            {/* 1. Left Panel: Topology Tree */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-1/4 max-w-[300px] min-w-[240px] flex flex-col bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 opacity-50" />

                <div className="px-5 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h3 className="text-xs font-syne font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Asset Topology
                    </h3>
                    <button
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-cyan-300 transition-colors"
                        title="Add Asset"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                    {topologyData.map(site => (
                        <TreeNode
                            key={site.id}
                            node={site}
                            expandedNodes={expandedNodes}
                            selectedEquipment={selectedEquipment}
                            toggleNode={toggleNode}
                            setSelectedEquipment={setSelectedEquipment}
                        />
                    ))}
                </div>
            </motion.div>

            {/* 2. Central Panel: Ingestion & Schema Mapping */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 flex flex-col gap-6"
            >
                {/* Header Context */}
                <div className="bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[60px] rounded-full" />

                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Target Asset</p>
                            <h2 className="text-2xl font-syne font-bold text-white flex items-center gap-3">
                                {selectedNodeInfo?.name || "Select an Asset"}
                                {selectedNodeInfo?.type === "equipment" && selectedNodeInfo?.status && (
                                    <span className={cn(
                                        "text-xs font-sans px-2 py-1 rounded border",
                                        selectedNodeInfo.status === "online" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                                            selectedNodeInfo.status === "warning" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                                                "bg-red-500/20 text-red-300 border-red-500/30"
                                    )}>
                                        {selectedNodeInfo.status.charAt(0).toUpperCase() + selectedNodeInfo.status.slice(1)}
                                    </span>
                                )}
                            </h2>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIngestMode("api")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                                    ingestMode === "api"
                                        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                        : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <LinkIcon className="w-4 h-4" /> Connect API
                            </button>
                            <button
                                onClick={() => setIngestMode("csv")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                                    ingestMode === "csv"
                                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                        : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Upload className="w-4 h-4" /> Inject CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Mapping Area */}
                <div className="flex-1 bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="text-sm font-syne font-bold text-white">Schema Neuronal Mapping</h3>
                        <p className="text-xs text-zinc-500 mt-1">Bind incoming payload fields to standard system variables.</p>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {/* Fake connecting lines background logic */}
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                            <svg className="w-full h-full">
                                <path d="M 300 100 C 400 100, 400 120, 500 120" stroke="url(#cyan-grad)" strokeWidth="2" fill="none" />
                                <path d="M 300 200 C 400 200, 400 180, 500 180" stroke="url(#cyan-grad)" strokeWidth="2" fill="none" />
                                <defs>
                                    <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 lg:gap-8 relative z-10 w-full h-full">
                            {/* Source Column */}
                            <div className="space-y-4 flex flex-col items-center">
                                <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase px-2 mb-2 w-full text-center border-b border-white/5 pb-2">Payload Headers</div>
                                {mockCsvHeaders.map((header, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all w-full max-w-[200px]">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm text-zinc-300">{header}</span>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                    </div>
                                ))}
                            </div>

                            {/* Center Connections */}
                            <div className="flex flex-col items-center justify-center text-zinc-600 gap-8 lg:gap-14 pt-10 px-2 lg:px-4 hidden sm:flex">
                                {/* Visual representation of mapping */}
                                <ArrowRightLeft className="w-5 h-5 opacity-20" />
                                <ArrowRightLeft className="w-5 h-5 opacity-20" />
                                <ArrowRightLeft className="w-5 h-5 opacity-20" />
                                <ArrowRightLeft className="w-5 h-5 opacity-20" />
                            </div>

                            {/* Target Column */}
                            <div className="space-y-4 flex flex-col items-center">
                                <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase px-2 mb-2 w-full text-center border-b border-white/5 pb-2">System Variables</div>
                                {mockCsvHeaders.map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-indigo-950/20 border border-indigo-500/20 focus-within:border-indigo-400/50 transition-all w-full max-w-[280px]">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500/50 ml-2 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                        <select
                                            defaultValue={i === 0 ? "sys_temp_in" : i === 1 ? "sys_temp_out" : i === 3 ? "sys_power" : ""}
                                            className="flex-1 bg-transparent border-none text-sm text-indigo-100 outline-none p-1 font-medium cursor-pointer"
                                        >
                                            <option value="" className="bg-[#121215] text-zinc-400">Select mapping...</option>
                                            {systemVariables.map(v => (
                                                <option key={v.id} value={v.id} className="bg-[#121215]">{v.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3 z-10">
                        <button className="px-5 py-2 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Discard</button>
                        <button className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all">Activate Pipeline</button>
                    </div>
                </div>
            </motion.div>

            {/* 3. Right Panel: Stream Health & Logs */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-1/4 max-w-[320px] min-w-[260px] flex flex-col bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h3 className="text-xs font-syne font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Stream Pulse
                    </h3>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-500 tracking-wider">LIVE</span>
                    </div>
                </div>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/5">
                    <div className="bg-[#0c0c0e]/80 p-4">
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Throughput</div>
                        <div className="text-lg font-mono text-white">24<span className="text-xs text-zinc-500 ml-1">pts/s</span></div>
                    </div>
                    <div className="bg-[#0c0c0e]/80 p-4">
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Completeness</div>
                        <div className="text-lg font-mono text-emerald-400">99.8<span className="text-xs text-emerald-500/50 ml-1">%</span></div>
                    </div>
                </div>

                {/* Logs Terminal */}
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs flex flex-col gap-3">
                    {mockLogs.map(log => (
                        <div key={log.id} className="flex gap-2">
                            <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                            <span className={cn(
                                "flex-1",
                                log.type === "success" ? "text-emerald-400" :
                                    log.type === "warning" ? "text-amber-400" :
                                        log.type === "error" ? "text-red-400" :
                                            "text-zinc-300"
                            )}>
                                {log.msg}
                            </span>
                        </div>
                    ))}

                    {/* Blinking cursor */}
                    <div className="flex gap-2 text-zinc-600 mt-2">
                        <span>{">"} _</span>
                        <span className="w-2 h-3 bg-zinc-500 animate-pulse" />
                    </div>
                </div>

            </motion.div>

            {/* Simulated Add Asset Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[#0c0c0e] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
                                <h3 className="text-sm font-syne font-bold uppercase tracking-widest text-cyan-400">
                                    Register New Asset
                                </h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body (Mock Form) */}
                            <div className="p-5 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Asset Type</label>
                                    <select className="w-full bg-[#121215] border border-white/10 rounded-lg p-2.5 text-sm text-zinc-300 outline-none focus:border-cyan-500/50">
                                        <option value="equipment">Equipment (Sensors / Devices)</option>
                                        <option value="building">Building / Sub-facility</option>
                                        <option value="site">Major Site / HQ</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Asset Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Pump-02, Zone B"
                                        className="w-full bg-[#121215] border border-white/10 rounded-lg p-2.5 text-sm text-zinc-300 outline-none focus:border-cyan-500/50 placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Parent Node</label>
                                    <select className="w-full bg-[#121215] border border-white/10 rounded-lg p-2.5 text-sm text-zinc-300 outline-none focus:border-cyan-500/50">
                                        <option value="">{selectedNodeInfo?.name || "Root (No Parent)"}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-5 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: Actual append logic
                                        setIsAddModalOpen(false);
                                    }}
                                    className="px-4 py-2 text-sm font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30 rounded-lg transition-colors shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                                >
                                    Confirm Registration
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
