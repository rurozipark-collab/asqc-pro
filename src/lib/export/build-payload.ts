import { computeDashboardKPI } from '@/lib/data/dashboard-stats';
import type { ExportPayload } from '@/lib/export/export-data';
import type { SyncPayload } from '@/lib/supabase/data-service';

export function buildExportPayload(data?: Partial<SyncPayload>): ExportPayload {
  const findings = data?.findings ?? [];
  const complaints = data?.complaints ?? [];
  const capas = data?.capas ?? [];
  const audits = data?.audits ?? [];
  const customerExperiences = data?.customerExperiences ?? [];
  const documents = data?.documents ?? [];
  const rcas = data?.rcas ?? [];

  return {
    findings,
    complaints,
    rcas,
    capas,
    audits,
    customerExperiences,
    documents,
    kpi: computeDashboardKPI(findings, complaints, capas, audits, customerExperiences),
  };
}