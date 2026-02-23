import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const syne = Syne({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-syne",
});

const manrope = Manrope({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-manrope",
});

export const metadata: Metadata = {
    title: "FlowEnergy | Advanced Energy Management & Analytics",
    description:
        "Enterprise-grade energy management platform with AI-powered analytics, real-time monitoring, and automated reporting for smarter energy decisions.",
    keywords: ["energy management", "analytics", "SaaS", "dashboard", "AI", "energy optimization"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-TW" className="dark scroll-smooth">
            <body className={`${syne.variable} ${manrope.variable} font-sans antialiased bg-[#09090b] text-white selection:bg-cyan-500/30 selection:text-cyan-50`}>
                {children}
            </body>
        </html>
    );
}
