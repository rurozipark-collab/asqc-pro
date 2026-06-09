import { NextResponse } from 'next/server';
import { isSupabaseConfigured, SYNC_TABLES } from '@/lib/supabase/config';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();
  const webhookConfigured = Boolean(process.env.GOOGLE_FORM_WEBHOOK_SECRET);

  if (!supabaseConfigured || !supabase) {
    return NextResponse.json({
      supabaseConfigured: false,
      webhookConfigured,
      connected: false,
      tablesOk: false,
      counts: null,
      error: null,
    });
  }

  try {
    const counts: Record<string, number> = {};
    let tablesOk = true;

    for (const [key, table] of Object.entries(SYNC_TABLES)) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        tablesOk = false;
        return NextResponse.json({
          supabaseConfigured: true,
          webhookConfigured,
          connected: false,
          tablesOk: false,
          counts: null,
          error: error.message,
        });
      }
      counts[key] = count ?? 0;
    }

    return NextResponse.json({
      supabaseConfigured: true,
      webhookConfigured,
      connected: true,
      tablesOk,
      counts,
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection failed';
    return NextResponse.json({
      supabaseConfigured: true,
      webhookConfigured,
      connected: false,
      tablesOk: false,
      counts: null,
      error: message,
    });
  }
}