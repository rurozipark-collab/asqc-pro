import type { SyncEntity } from '@/lib/supabase/config';
import type { SyncPayload } from '@/lib/supabase/data-service';

export type DeletedIds = Partial<Record<SyncEntity, string[]>>;

export function getDeletedSet(deletedIds: DeletedIds, entity: SyncEntity): Set<string> {
  return new Set(deletedIds[entity] ?? []);
}

export function addDeletedId(deletedIds: DeletedIds, entity: SyncEntity, id: string): DeletedIds {
  const current = deletedIds[entity] ?? [];
  if (current.includes(id)) return deletedIds;
  return { ...deletedIds, [entity]: [...current, id] };
}

export function filterDeleted<T extends { id: string }>(rows: T[], entity: SyncEntity, deletedIds: DeletedIds): T[] {
  const deleted = getDeletedSet(deletedIds, entity);
  if (deleted.size === 0) return rows;
  return rows.filter((row) => !deleted.has(row.id));
}

export function filterPayloadDeleted(data: SyncPayload, deletedIds: DeletedIds): SyncPayload {
  return {
    findings: filterDeleted(data.findings, 'findings', deletedIds),
    complaints: filterDeleted(data.complaints, 'complaints', deletedIds),
    rcas: filterDeleted(data.rcas, 'rcas', deletedIds),
    capas: filterDeleted(data.capas, 'capas', deletedIds),
    audits: filterDeleted(data.audits, 'audits', deletedIds),
    customerExperiences: filterDeleted(data.customerExperiences, 'customerExperiences', deletedIds),
    documents: filterDeleted(data.documents, 'documents', deletedIds),
  };
}