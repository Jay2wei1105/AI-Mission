"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import {
    Zap,
    BarChart3,
    Brain,
    FileText,
    ArrowRight,
    Check,
    Terminal,
    BatteryCharging,
    Cpu,
    Network
} from "lucide-react";

// Animation Variants
const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const fadeUpText = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const bentoCardAnim = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const LiveCounter = () => {
    const [value, setValue] = useState(1240);
    useEffect(() => {
        const interval = setInterval(() => {
            setValue(v => v + Math.floor(Math.random() * 11) - 5);
        }, 800);
        return () => clearInterval(interval);
    }, []);
    return <span>{value.toLocaleString()}</span>;
};

const LiveStream = () => {
    const [logs, setLogs] = useState<string[]>([]);
    useEffect(() => {
        const messages = [
            "Analyzing payload 0x8F...",
            "Validating AC-DC conversion rate: 94.2%",
            "Grid sync optimized. Current draw stable.",
            "Detecting anomaly in Sector 7... Resolved.",
            "Energy draw at peak. Rerouting 40kW to Battery B.",
            "Machine Learning model updated. Loss: 0.041"
        ];

        setLogs([
            `[${new Date().toISOString().substring(11, 19)}] System initialized.`,
            `[${new Date().toISOString().substring(11, 19)}] Establishing secure connection...`,
            `[${new Date().toISOString().substring(11, 19)}] Waiting for telemetry...`
        ]);

        const interval = setInterval(() => {
            setLogs(prev => {
                const newLogs = [...prev, `[${new Date().toISOString().substring(11, 19)}] ${messages[Math.floor(Math.random() * messages.length)]}`];
                if (newLogs.length > 4) return newLogs.slice(newLogs.length - 4);
                return newLogs;
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono text-[10px] sm:text-[11px] text-cyan-400/80 flex flex-col gap-1 tracking-wider">
            {logs.map((log, i) => (
                <div key={i} className="animate-in fade-in duration-300">{log}</div>
            ))}
        </div>
    );
};

export default function LandingPage() {
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
    const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

    // Auto-hiding Navbar State
    const [isNavVisible, setIsNavVisible] = useState(true);
    const lastYRef = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastYRef.current;
        const diff = latest - previous;

        // If scrolling down significantly, hide nav
        if (latest > 100 && diff > 5) {
            setIsNavVisible(false);
        }
        // If scrolling up significantly, show nav
        else if (diff < -5 || latest < 50) {
            setIsNavVisible(false);
            // using a slight delay check before setting to true creates a smoother effect, 
            // but for immediate response we just set it based on direction.
            setIsNavVisible(true);
        }
        lastYRef.current = latest;
    });

    const featuresRef = useRef(null);
    const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });

    return (
        <div className="min-h-screen bg-[#09090b] text-white relative flex flex-col items-center overflow-x-hidden selection:bg-cyan-500/30">
            {/* NOISE & GRADIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none noise-overlay z-50 opacity-[0.25] mix-blend-overlay"></div>
            <div className="fixed inset-0 pointer-events-none grid-pattern opacity-30 z-0 mask-image-radial-center"></div>

            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] blur-[100px] z-0" />

            {/* HEADER */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{
                    y: isNavVisible ? 0 : -100,
                    opacity: isNavVisible ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-6 glass-card border-none rounded-none border-b border-white/5 bg-black/40"
            >
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-glow group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-500">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-syne font-bold tracking-tight text-white hover:text-cyan-100 transition-colors">
                        FlowEnergy
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-10">
                    <a href="#solutions" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300">Platform</a>
                    <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300">Features</a>
                    <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300">Pricing</a>
                </nav>

                <div className="flex items-center gap-6">
                    <Link href="/login" className="hidden md:block text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link
                        href="/dashboard"
                        className="relative group overflow-hidden inline-flex justify-center items-center px-6 py-2.5 rounded-full bg-white text-black font-semibold tracking-wide text-sm transition-all duration-300 hover:scale-105"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Deploy Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                    </Link>
                </div>
            </motion.header>

            {/* HERO SECTION */}
            <section className="relative w-full max-w-[1400px] min-h-[100svh] flex flex-col justify-center items-center pt-32 px-6 z-10">
                <motion.div
                    style={{ y: yHero, opacity: opacityHero }}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center text-center max-w-5xl"
                >

                    <motion.h1 variants={fadeUpText} className="font-syne text-6xl md:text-8xl font-black leading-[0.9] tracking-[[-0.03em]] mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
                        Architect {" "}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Intelligence</span>
                            <div className="absolute -bottom-2 left-0 w-full h-4 bg-cyan-500/20 blur-xl z-0" />
                        </span>
                        <br />
                        Into Every Joule.
                    </motion.h1>

                    <motion.p variants={fadeUpText} className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed mb-14 font-light">
                        The ultimate interface for managing industrial energy flows. Predict demand, optimize routing, and completely automate power distribution with military-grade precision.
                    </motion.p>

                    <motion.div variants={fadeUpText} className="flex flex-col sm:flex-row items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[24px] bg-white text-black font-bold text-lg overflow-hidden transition-all hover:scale-[1.02]"
                        >
                            <span className="relative z-10">Initialize Dashboard</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-teal-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-[24px] bg-white/5 border border-white/10 text-white font-medium text-lg backdrop-blur-md hover:bg-white/10 transition-all"
                        >
                            View Architecture
                        </a>
                    </motion.div>
                </motion.div>

                {/* Data Analysis Visualizer Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="mt-16 w-full max-w-6xl aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-[32px] border border-white/10 bg-[#09090b]/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 flex flex-col p-6 md:p-10 z-10 w-full h-full text-left">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-white/5 pb-4 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="animate-pulse w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                                <span className="font-syne font-bold tracking-widest text-white/80 uppercase text-xs md:text-sm">Live System Analysis</span>
                            </div>
                            <div className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">NODE: EU-WEST-01</div>
                        </div>

                        {/* Data Grids */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
                            {/* Column 1: KPIs */}
                            <div className="col-span-1 flex flex-col gap-4">
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none" />
                                    <div className="text-zinc-500 text-xs mb-2 uppercase tracking-widest font-semibold flex items-center justify-between">
                                        Total Power Draw <Zap className="w-3 h-3 text-cyan-500" />
                                    </div>
                                    <div className="font-syne text-4xl font-bold text-white flex items-baseline gap-2 mt-4">
                                        <LiveCounter /> <span className="text-cyan-500 text-lg">kW</span>
                                    </div>
                                    <div className="mt-5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "82%" }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                                            className="h-full bg-cyan-500"
                                        />
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 backdrop-blur-md flex-1 flex flex-col justify-center">
                                    <div className="text-zinc-500 text-xs mb-2 uppercase tracking-widest font-semibold">Efficiency Delta</div>
                                    <div className="font-syne text-4xl font-bold text-emerald-400 flex items-baseline gap-2 mt-2">
                                        +14.2<span className="text-lg text-emerald-400/50">%</span>
                                    </div>
                                    <div className="mt-4 font-mono text-[10px] text-zinc-400 leading-relaxed uppercase tracking-wider">
                                        Versus 30-day baseline.<br />
                                        Optimization active.
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 & 3: Main Chart and Data Stream */}
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
                                    <div className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-4 relative z-10 flex justify-between">
                                        <span className="flex items-center gap-2"><Brain className="w-3 h-3" /> Neural Demand Prediction</span>
                                        <span className="text-cyan-400 animate-pulse">Live</span>
                                    </div>
                                    <div className="flex-1 relative z-10 w-full min-h-[120px] mt-2">
                                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                            {/* Grid lines */}
                                            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                                            {/* Glow path */}
                                            <motion.path
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
                                                d="M0,80 Q10,75 20,60 T40,50 T60,20 T80,30 T100,10"
                                                fill="none"
                                                stroke="url(#lineGrad)"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                            />
                                            {/* Area fill */}
                                            <motion.path
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 1.5, delay: 2 }}
                                                d="M0,80 Q10,75 20,60 T40,50 T60,20 T80,30 T100,10 L100,100 L0,100 Z"
                                                fill="url(#areaGrad)"
                                            />
                                            <defs>
                                                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#8b5cf6" />
                                                    <stop offset="100%" stopColor="#06b6d4" />
                                                </linearGradient>
                                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                <div className="h-28 bg-[#050505] border border-white/5 rounded-xl p-4 overflow-hidden relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-indigo-500" />
                                    <LiveStream />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* PLATFORM ARCHITECTURE */}
            <section id="solutions" className="relative w-full max-w-[1400px] py-32 px-6 z-10 flex flex-col items-center">
                <div className="text-center mb-24 max-w-3xl">
                    <h2 className="font-syne text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        System Architecture
                    </h2>
                    <p className="text-xl text-zinc-400 font-light">
                        Built on edge computing and distributed neural networks, FlowEnergy OS operates at the intersection of physical hardware and cloud intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent z-0" />

                    {[
                        { step: "01", title: "Ingestion Core", desc: "Native integrations with industrial sensors. Real-time sub-second data streaming via WebSockets.", color: "from-cyan-500" },
                        { step: "02", title: "Neural Logic", desc: "Proprietary forecasting models analyze historical loads and market pricing to predict optimal grid states.", color: "from-indigo-500" },
                        { step: "03", title: "Active Actuation", desc: "Closed-loop control systems execute automated load balancing directly to local hardware.", color: "from-purple-500" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.2, duration: 0.8 }}
                            className="relative z-10 flex flex-col items-center text-center bg-[#0a0a0c]/80 backdrop-blur-md p-10 border border-white/5 rounded-[32px] hover:border-white/10 transition-colors"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-8 relative overflow-hidden shadow-xl shadow-black">
                                <div className={`absolute inset-0 bg-gradient-to-b ${item.color} to-transparent opacity-20`} />
                                <span className={`font-syne font-black text-2xl bg-gradient-to-b ${item.color} to-white bg-clip-text text-transparent`}>{item.step}</span>
                            </div>
                            <h3 className="font-syne text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-zinc-500 text-base leading-relaxed font-light">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* BENTO GRID FEATURES */}
            <section id="features" ref={featuresRef} className="relative w-full max-w-[1400px] py-40 px-6 z-10 flex flex-col items-center">
                <div className="text-center mb-24 max-w-3xl">
                    <h2 className="font-syne text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        Information Topology
                    </h2>
                    <p className="text-xl text-zinc-400 font-light">
                        A seamless fusion between complex infrastructural data and beautiful human-centric design. Experience monitoring with zero friction.
                    </p>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isFeaturesInView ? "show" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 w-full max-w-7xl auto-rows-[300px]"
                >
                    {/* Bento Box 1: AI Prediction */}
                    <motion.div variants={bentoCardAnim} className="md:col-span-2 group relative rounded-[32px] border border-white/10 bg-[#121215]/80 backdrop-blur-xl p-10 overflow-hidden flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-colors duration-700" />
                        <div className="relative z-10">
                            <Brain className="w-8 h-8 text-cyan-400 mb-6" />
                            <h3 className="font-syne text-3xl font-bold mb-3">Predictive Engine</h3>
                            <p className="text-zinc-400 text-lg max-w-sm">Neural-net driven forecasting that anticipates peak loads 48 hours in advance, ensuring 100% SLA compliance.</p>
                        </div>
                        <div className="relative z-10 w-full h-1 bg-white/5 rounded-full overflow-hidden mt-6">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 w-[78%] relative">
                                <div className="absolute right-0 top-0 bottom-0 w-10 bg-white/50 blur mix-blend-overlay" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Bento Box 2: Node Routing */}
                    <motion.div variants={bentoCardAnim} className="md:col-span-1 group relative rounded-[32px] border border-white/10 bg-[#121215]/80 backdrop-blur-xl p-10 overflow-hidden hover:border-indigo-500/30 transition-colors">
                        <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-indigo-500/10 blur-[60px] rounded-full" />
                        <Network className="w-8 h-8 text-indigo-400 mb-6" />
                        <h3 className="font-syne text-2xl font-bold mb-3">Dynamic Traversal</h3>
                        <p className="text-zinc-400 text-base">Reroute power instantaneously using intelligent nodal logic.</p>
                    </motion.div>

                    {/* Bento Box 3: Live Telemetry */}
                    <motion.div variants={bentoCardAnim} className="md:col-span-1 group relative rounded-[32px] border border-white/10 bg-[#121215]/80 backdrop-blur-xl p-10 overflow-hidden hover:border-emerald-500/30 transition-colors">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[50px] rounded-full" />
                        <BarChart3 className="w-8 h-8 text-emerald-400 mb-6" />
                        <h3 className="font-syne text-2xl font-bold mb-3">Live Telemetry</h3>
                        <p className="text-zinc-400 text-base">Milliseconds matter. We stream data via WebSockets.</p>
                    </motion.div>

                    {/* Bento Box 4: Command Center */}
                    <motion.div variants={bentoCardAnim} className="md:col-span-2 group relative rounded-[32px] border border-white/10 bg-[#121215]/80 backdrop-blur-xl p-10 overflow-hidden flex flex-row items-center justify-between hover:border-purple-500/30 transition-colors">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-500/10 to-transparent" />
                        <div className="relative z-10 max-w-md">
                            <Terminal className="w-8 h-8 text-purple-400 mb-6" />
                            <h3 className="font-syne text-3xl font-bold mb-3">CLI & API First</h3>
                            <p className="text-zinc-400 text-lg">Every action available in the UI is available via our powerful GraphQL API or terminal interface.</p>
                        </div>
                        <div className="hidden lg:flex flex-col relative z-10 w-full max-w-[300px] bg-black/50 border border-white/10 rounded-xl p-6 font-mono text-xs text-zinc-500 overflow-hidden break-all">
                            <div className="text-green-400 mb-2 truncate">$ flow-cli analyze --site &quot;HQ&quot;</div>
                            <div className="truncate">&gt; Establishing secure connection...</div>
                            <div className="truncate">&gt; Digesting 4.2M records...</div>
                            <div className="text-cyan-400 truncate">&gt; Optimal configuration found.</div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="relative w-full max-w-[1400px] py-40 px-6 z-10 flex flex-col items-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

                <div className="text-center mb-24 max-w-3xl relative z-10">
                    <h2 className="font-syne text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        Transparent Scale
                    </h2>
                    <p className="text-xl text-zinc-400 font-light">
                        Deploy your first facility in minutes. Scale to hundreds seamlessly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10 items-center">
                    {/* Free Tier */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col p-10 rounded-[32px] border border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl"
                    >
                        <h3 className="font-syne text-2xl font-bold mb-2">Developer</h3>
                        <p className="text-zinc-500 text-sm mb-8 h-10">Sandbox testing and small deployments.</p>
                        <div className="font-syne text-6xl font-black mb-8">Free</div>
                        <ul className="flex flex-col gap-4 text-sm text-zinc-400 mb-10 flex-1">
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> Up to 3 Data Nodes</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> 24h Data Retention</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> Community Support</li>
                        </ul>
                        <Link href="/dashboard" className="w-full flex justify-center items-center py-4 rounded-full border border-white/10 hover:bg-white/5 hover:text-white text-zinc-400 transition-colors font-medium">Start Deploying</Link>
                    </motion.div>

                    {/* Pro Tier (Popular) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col p-10 rounded-[32px] border border-cyan-500/30 bg-gradient-to-b from-[#121215] to-[#0c0c0e] backdrop-blur-xl relative shadow-[0_0_80px_rgba(6,182,212,0.08)] transform md:-translate-y-4"
                    >
                        <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20">Most Adopted</div>
                        <h3 className="font-syne text-2xl font-bold mb-2 text-cyan-400">Professional</h3>
                        <p className="text-zinc-400 text-sm mb-8 h-10">Full neural-net access for mid operations.</p>
                        <div className="font-syne text-6xl font-black mb-2 text-white">$499<span className="text-lg text-zinc-500 font-sans font-normal ml-2">/mo</span></div>
                        <div className="text-xs text-zinc-600 mb-8">Billed annually, or $599 month-to-month</div>
                        <ul className="flex flex-col gap-4 text-sm text-zinc-300 mb-10 flex-1">
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> Unlimited Data Nodes</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> Neural Demand Prediction</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> 1-Year Data Retention</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> Automated Optimization</li>
                        </ul>
                        <Link href="/dashboard" className="w-full flex justify-center items-center py-4 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition-colors font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]">Deploy Professional</Link>
                    </motion.div>

                    {/* Enterprise Tier */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col p-10 rounded-[32px] border border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl"
                    >
                        <h3 className="font-syne text-2xl font-bold mb-2">Enterprise</h3>
                        <p className="text-zinc-500 text-sm mb-8 h-10">Military-grade deployments for vast zones.</p>
                        <div className="font-syne text-5xl font-black mb-8 mt-2 text-white">Custom</div>
                        <ul className="flex flex-col gap-4 text-sm text-zinc-400 mb-10 flex-1">
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> Active Load Balancing</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> On-Premise Deployment</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> 10-Year Data Retention</li>
                            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> Dedicated Systems Engineer</li>
                        </ul>
                        <a href="mailto:sales@flowenergy.io" className="w-full flex justify-center items-center py-4 rounded-full border border-white/10 hover:bg-white/5 hover:text-white text-zinc-400 transition-colors font-medium">Contact Dynamics</a>
                    </motion.div>
                </div>
            </section>

            {/* SPACER FOR SCROLL */}
            <div className="h-40" />

            {/* DARK FOOTER */}
            <footer className="w-full border-t border-white/5 py-16 px-6 relative z-10 bg-black/50">
                <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-cyan-500" />
                        <span className="text-lg font-syne font-bold text-white">FlowEnergy OS</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-zinc-500 dark">
                        <a href="#" className="hover:text-white transition-colors">Architecture</a>
                        <a href="#" className="hover:text-white transition-colors">API Docs</a>
                        <a href="#" className="hover:text-white transition-colors">Status</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
