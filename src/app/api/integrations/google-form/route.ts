import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getReferenceNumbers, upsertRecord } from '@/lib/supabase/data-service';
import {
  mapToComplaint,
  mapToCX,
  mapToFinding,
  type GoogleFormPayload,
} from '@/lib/integrations/google-form';

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase belum dikonfigurasi. Google Form memerlukan cloud database.' },
      { status: 503 },
    );
  }

  const webhookSecret = process.env.GOOGLE_FORM_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'GOOGLE_FORM_WEBHOOK_SECRET belum diset di environment.' },
      { status: 503 },
    );
  }

  try {
    const payload = (await request.json()) as GoogleFormPayload;

    if (payload.secret !== webhookSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (!payload.type || !['finding', 'complaint', 'cx'].includes(payload.type)) {
      return NextResponse.json({ error: 'Invalid type. Use: finding, complaint, cx' }, { status: 400 });
    }

    if (payload.type === 'finding') {
      const existing = await getReferenceNumbers('findings', 'findingNumber');
      const record = mapToFinding(payload, existing);
      await upsertRecord('findings', record);
      return NextResponse.json({
        ok: true,
        type: 'finding',
        id: record.id,
        referenceNumber: record.findingNumber,
      });
    }

    if (payload.type === 'complaint') {
      const existing = await getReferenceNumbers('complaints', 'complaintNumber');
      const record = mapToComplaint(payload, existing);
      await upsertRecord('complaints', record);
      return NextResponse.json({
        ok: true,
        type: 'complaint',
        id: record.id,
        referenceNumber: record.complaintNumber,
      });
    }

    const record = mapToCX(payload);
    await upsertRecord('customerExperiences', record);
    return NextResponse.json({
      ok: true,
      type: 'cx',
      id: record.id,
      cxScore: record.cxScore,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}