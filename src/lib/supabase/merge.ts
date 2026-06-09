import type { SyncEntity } from '@/lib/supabase/config';
import type { SyncPayload } from '@/lib/supabase/data-service';
import type { DeletedIds } from '@/lib/sync/deleted-ids';
import { filterDeleted } from '@/lib/sync/deleted-ids';

type Identifiable = { id: string; date?: string; time?: string; createdAt?: string };

function recordKey(record: Identifiable): string {
  return record.createdAt ?? `${record.date ?? ''}T${record.time ?? ''}`;
}

export function mergeRecords<T extends Identifiable>(
  local: T[],
  cloud: T[],
  deletedIds: DeletedIds,
  entity: SyncEntity,
): T[] {
  const deleted = new Set(deletedIds[entity] ?? []);
  const map = new Map<string, T>();

  for (const record of cloud) {
    if (!deleted.has(record.id)) map.set(record.id, record);
  }

  for (const record of local) {
    if (deleted.has(record.id)) continue;
    const existing = map.get(record.id);
    if (!existing || recordKey(record) >= recordKey(existing)) {
      map.set(record.id, record);
    }
  }

  return filterDeleted(Array.from(map.values()), entity, deletedIds);
}

export function mergeSyncPayload(local: SyncPayload, cloud: SyncPayload, deletedIds: DeletedIds = {}): SyncPayload {
  return {
    findings: mergeRecords(local.findings, cloud.findings, deletedIds, 'findings'),
    complaints: mergeRecords(local.complaints, cloud.complaints, deletedIds, 'complaints'),
    rcas: mergeRecords(local.rcas, cloud.rcas, deletedIds, 'rcas'),
    capas: mergeRecords(local.capas, cloud.capas, deletedIds, 'capas'),
    audits: mergeRecords(local.audits, cloud.audits, deletedIds, 'audits'),
    customerExperiences: mergeRecords(local.customerExperiences, cloud.customerExperiences, deletedIds, 'customerExperiences'),
    documents: mergeRecords(local.documents, cloud.documents, deletedIds, 'documents'),
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