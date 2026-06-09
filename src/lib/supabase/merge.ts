import type { SyncPayload } from '@/lib/supabase/data-service';

type Identifiable = { id: string; date?: string; time?: string };

function recordKey(record: Identifiable): string {
  return `${record.date ?? ''}T${record.time ?? ''}`;
}

export function mergeRecords<T extends Identifiable>(local: T[], cloud: T[]): T[] {
  const map = new Map<string, T>();

  for (const record of cloud) map.set(record.id, record);

  for (const record of local) {
    const existing = map.get(record.id);
    if (!existing || recordKey(record) >= recordKey(existing)) {
      map.set(record.id, record);
    }
  }

  return Array.from(map.values());
}

export function mergeSyncPayload(local: SyncPayload, cloud: SyncPayload): SyncPayload {
  return {
    findings: mergeRecords(local.findings, cloud.findings),
    complaints: mergeRecords(local.complaints, cloud.complaints),
    rcas: mergeRecords(local.rcas, cloud.rcas),
    capas: mergeRecords(local.capas, cloud.capas),
    audits: mergeRecords(local.audits, cloud.audits),
    customerExperiences: mergeRecords(local.customerExperiences, cloud.customerExperiences),
    documents: mergeRecords(local.documents, cloud.documents),
  };
}

export const emptySyncPayload = (): SyncPayload => ({
  findings: [],
  complaints: [],
  rcas: [],
  capas: [],
  audits: [],
  customerExperiences: [],
  documents: [],
});