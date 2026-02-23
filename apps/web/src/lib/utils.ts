import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Format number with locale-aware separators */
export function formatNumber(value: number, decimals = 0): string {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/** Format energy value (kWh, MWh, etc.) */
export function formatEnergy(kwh: number): string {
    if (kwh >= 1_000_000) return `${formatNumber(kwh / 1_000_000, 1)} GWh`;
    if (kwh >= 1_000) return `${formatNumber(kwh / 1_000, 1)} MWh`;
    return `${formatNumber(kwh, 1)} kWh`;
}

/** Format currency */
export function formatCurrency(amount: number, currency = "TWD"): string {
    return new Intl.NumberFormat("zh-TW", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/** Format percentage */
export function formatPercent(value: number, decimals = 1): string {
    return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/** Format relative time */
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "剛剛";
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    if (days < 7) return `${days} 天前`;
    return date.toLocaleDateString("zh-TW");
}

/** Generate a random ID */
export function generateId(prefix = ""): string {
    const id = Math.random().toString(36).substring(2, 9);
    return prefix ? `${prefix}_${id}` : id;
}

/** Delay utility for async operations */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
