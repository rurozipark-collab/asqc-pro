import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Touch-friendly form controls for mobile */
export const INPUT_CLASS =
  'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 md:py-2 text-base md:text-sm text-slate-200 focus:border-cyan-500 focus:outline-none min-h-[44px]';

export const TABLE_SCROLL_CLASS = 'overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0';

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getCreatedAtDisplay(record: {
  createdAt?: string;
  date?: string;
  time?: string;
}): string {
  if (record.createdAt) return formatDateTime(record.createdAt);
  if (record.date && record.time) return `${formatDate(record.date)} ${record.time}`;
  if (record.date) return formatDate(record.date);
  return '-';
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format: FND-08jun2026 (hari + bulan singkat + tahun) */
export function generateReferenceCode(prefix: string, existingCodes: string[] = [], date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const base = `${prefix}-${day}${months[date.getMonth()]}${date.getFullYear()}`;
  const sameDay = existingCodes.filter((c) => c === base || c.startsWith(`${base}-`));
  if (sameDay.length === 0) return base;
  return `${base}-${sameDay.length + 1}`;
}

/** @deprecated use generateReferenceCode */
export function generateNumber(prefix: string, count: number): string {
  return generateReferenceCode(prefix, Array.from({ length: count }, (_, i) => `${prefix}-placeholder-${i}`));
}

export function getRiskColor(risk: string): string {
  const colors: Record<string, string> = {
    Low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[risk] || colors.Low;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'In Progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Verification: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Closed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
    Assigned: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Resolved: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  };
  return colors[status] || colors.Open;
}