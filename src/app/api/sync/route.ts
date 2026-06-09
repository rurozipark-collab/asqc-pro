import { NextResponse } from 'next/server';
import {
  deleteRecord,
  loadAllFromSupabase,
  pushAllToSupabase,
  upsertRecord,
  type SyncPayload,
} from '@/lib/supabase/data-service';
import { isSupabaseConfigured, type SyncEntity } from '@/lib/supabase/config';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false });
  }

  try {
    const data = await loadAllFromSupabase();
    return NextResponse.json({ configured: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync load failed';
    return NextResponse.json({ configured: true, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false });
  }

  try {
    const body = await request.json();
    const { action } = body as {
      action: 'upsert' | 'delete' | 'push_all';
      entity?: SyncEntity;
      record?: { id: string };
      id?: string;
      data?: SyncPayload;
    };

    if (action === 'upsert' && body.entity && body.record) {
      await upsertRecord(body.entity, body.record);
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete' && body.entity && body.id) {
      await deleteRecord(body.entity, body.id);
      return NextResponse.json({ ok: true });
    }

    if (action === 'push_all' && body.data) {
      await pushAllToSupabase(body.data);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid sync action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}