import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatName(name: string | null | undefined): string {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function safeDate(date: any, fallback: string = "N/A"): string {
  if (!date) return fallback;
  const d = new Date(date);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString();
}
