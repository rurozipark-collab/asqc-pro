import { supabase } from '@/lib/supabase/client';
import { isSupabaseConfigured, SYNC_TABLES, type SyncEntity } from '@/lib/supabase/config';
import type {
  Finding,
  Complaint,
  RCA,
  CAPA,
  Audit,
  CustomerExperience,
  Document,
} from '@/types';

export type SyncPayload = {
  findings: Finding[];
  complaints: Complaint[];
  rcas: RCA[];
  capas: CAPA[];
  audits: Audit[];
  customerExperiences: CustomerExperience[];
  documents: Document[];
};

type Row = { id: string; payload: unknown };

async function fetchTable<T>(table: string): Promise<T[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(table)
    .select('payload')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data as Row[] | null)?.map((r) => r.payload as T) ?? [];
}

export async function loadAllFromSupabase(): Promise<SyncPayload | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  const [findings, complaints, rcas, capas, audits, customerExperiences, documents] =
    await Promise.all([
      fetchTable<Finding>(SYNC_TABLES.findings),
      fetchTable<Complaint>(SYNC_TABLES.complaints),
      fetchTable<RCA>(SYNC_TABLES.rcas),
      fetchTable<CAPA>(SYNC_TABLES.capas),
      fetchTable<Audit>(SYNC_TABLES.audits),
      fetchTable<CustomerExperience>(SYNC_TABLES.customerExperiences),
      fetchTable<Document>(SYNC_TABLES.documents),
    ]);

  return { findings, complaints, rcas, capas, audits, customerExperiences, documents };
}

export async function upsertRecord(entity: SyncEntity, record: { id: string }): Promise<void> {
  if (!supabase) return;
  const table = SYNC_TABLES[entity];
  const { error } = await supabase.from(table).upsert(
    { id: record.id, payload: record, updated_at: new Date().toISOString() },
    { onConflict: 'id' },
  );
  if (error) throw error;
}

export async function deleteRecord(entity: SyncEntity, id: string): Promise<void> {
  if (!supabase) return;
  const table = SYNC_TABLES[entity];
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function getReferenceNumbers(
  entity: 'findings' | 'complaints',
  field: 'findingNumber' | 'complaintNumber',
): Promise<string[]> {
  const table = SYNC_TABLES[entity];
  const rows = await fetchTable<Record<string, string>>(table);
  return rows.map((r) => r[field]).filter(Boolean);
}

export async function pushAllToSupabase(data: SyncPayload): Promise<void> {
  if (!supabase) return;

  const tasks: Promise<void>[] = [];

  const push = <T extends { id: string }>(entity: SyncEntity, records: T[]) => {
    records.forEach((record) => tasks.push(upsertRecord(entity, record)));
  };

  push('findings', data.findings);
  push('complaints', data.complaints);
  push('rcas', data.rcas);
  push('capas', data.capas);
  push('audits', data.audits);
  push('customerExperiences', data.customerExperiences);
  push('documents', data.documents);

  await Promise.all(tasks);
}