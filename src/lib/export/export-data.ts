import type { SyncPayload } from '@/lib/supabase/data-service';
import type { DashboardKPI } from '@/types';

export type ExportPayload = SyncPayload & { kpi: DashboardKPI };

export const EXPORT_LABELS = {
  appName: 'ASQC PRO',
  subtitle: 'Platform Manajemen Kualitas Layanan & Pengalaman Pelanggan Bandara',
  period: 'Periode',
  generated: 'Dibuat',
  reportNo: 'No. Laporan',
  executiveSummary: 'Ringkasan Eksekutif',
  kpiDashboard: 'Dashboard KPI',
  findingsSummary: 'Ringkasan Temuan',
  complaintSummary: 'Ringkasan Keluhan',
  capaSummary: 'Ringkasan CAPA',
  aiRecommendations: 'Rekomendasi AI',
  approval: 'Persetujuan & Tanda Tangan',
  preparedBy: 'Disusun oleh',
  reviewedBy: 'Direview oleh',
  approvedBy: 'Disetujui oleh',
  metric: 'Metrik',
  value: 'Nilai',
  status: 'Status',
  tracking: 'Pemantauan',
  normal: 'Normal',
  attention: 'Perlu Perhatian',
  critical: 'Kritis',
  onTarget: 'On Target',
  belowTarget: 'Di Bawah Target',
  good: 'Baik',
  yes: 'Ya',
  no: 'Tidak',
  sheets: {
    executive: 'Dashboard Eksekutif',
    findings: 'Temuan',
    complaints: 'Keluhan',
    audits: 'Audit',
    capa: 'CAPA',
    cx: 'Pengalaman Pelanggan',
    trend: 'Analisis Tren',
    raw: 'Data Mentah',
  },
  reportTypes: {
    Daily: 'Laporan Harian',
    Weekly: 'Laporan Mingguan',
    Monthly: 'Laporan Bulanan',
    Quarterly: 'Laporan Triwulan',
    Annual: 'Laporan Tahunan',
    Audit: 'Laporan Audit',
    Complaint: 'Laporan Keluhan',
    CAPA: 'Laporan CAPA',
    CX: 'Laporan Pengalaman Pelanggan',
    GM: 'Laporan General Manager',
    Board: 'Laporan Dewan',
  } as Record<string, string>,
  findingStatus: {
    Open: 'Terbuka',
    'In Progress': 'Dalam Proses',
    Verification: 'Verifikasi',
    Closed: 'Tertutup',
    Overdue: 'Terlambat',
  } as Record<string, string>,
  risk: {
    Low: 'Rendah',
    Medium: 'Sedang',
    High: 'Tinggi',
    Critical: 'Kritis',
  } as Record<string, string>,
  priority: {
    Low: 'Rendah',
    Medium: 'Sedang',
    High: 'Tinggi',
    Urgent: 'Mendesak',
  } as Record<string, string>,
};

export function labelStatus(value: string): string {
  return EXPORT_LABELS.findingStatus[value] ?? value;
}

export function labelRisk(value: string): string {
  return EXPORT_LABELS.risk[value] ?? value;
}

export function labelPriority(value: string): string {
  return EXPORT_LABELS.priority[value] ?? value;
}

export function reportTitle(type: string): string {
  return EXPORT_LABELS.reportTypes[type] ?? `Laporan ${type}`;
}