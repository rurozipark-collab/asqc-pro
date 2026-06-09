'use client';

import type { SyncEntity } from '@/lib/supabase/config';
import type { SyncPayload } from '@/lib/supabase/data-service';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error' | 'offline';

export async function fetchRemoteData(): Promise<{
  configured: boolean;
  data?: SyncPayload;
  error?: string;
}> {
  const res = await fetch('/api/sync');
  return res.json();
}

export async function remoteUpsert(entity: SyncEntity, record: { id: string }) {
  await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'upsert', entity, record }),
  });
}

export async function remoteDelete(entity: SyncEntity, id: string) {
  await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', entity, id }),
  });
}

export async function remotePushAll(data: SyncPayload) {
  await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'push_all', data }),
  });
}