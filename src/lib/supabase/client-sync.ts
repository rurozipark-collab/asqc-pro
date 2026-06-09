'use client';

import type { SyncEntity } from '@/lib/supabase/config';
import type { SyncPayload } from '@/lib/supabase/data-service';
import { prepareRecordForSync, pushPayloadRecords } from '@/lib/sync/prepare-record';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error' | 'offline';

export async function fetchRemoteData(): Promise<{
  configured: boolean;
  data?: SyncPayload;
  error?: string;
}> {
  const res = await fetch('/api/sync');
  return res.json();
}

async function postSync(body: unknown) {
  const res = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || `Sync failed (${res.status})`);
  }
  return json;
}

export async function remoteUpsert(entity: SyncEntity, record: { id: string }) {
  await postSync({ action: 'upsert', entity, record: prepareRecordForSync(entity, record) });
}

export async function remoteDelete(entity: SyncEntity, id: string) {
  await postSync({ action: 'delete', entity, id });
}

export async function remotePushAll(data: SyncPayload) {
  await pushPayloadRecords(data, remoteUpsert);
}