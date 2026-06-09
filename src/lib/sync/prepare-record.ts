import type { SyncEntity } from '@/lib/supabase/config';
import type { SyncPayload } from '@/lib/supabase/data-service';
import type { Finding } from '@/types';

const MAX_PHOTO_CHARS = 350_000;

function slimPhotos(photos: string[] | undefined): string[] {
  if (!photos?.length) return [];
  return photos.filter((photo) => photo.length <= MAX_PHOTO_CHARS);
}

export function prepareRecordForSync<T extends { id: string }>(entity: SyncEntity, record: T): T {
  if (entity !== 'findings') return record;

  const finding = record as unknown as Finding;
  const original = finding.photoEvidence ?? [];
  const photoEvidence = slimPhotos(original);
  if (photoEvidence.length === original.length) return record;

  return { ...finding, photoEvidence } as unknown as T;
}

export async function pushPayloadRecords(
  data: SyncPayload,
  upsert: (entity: SyncEntity, record: { id: string }) => Promise<void>,
): Promise<{ pushed: number; skippedPhotos: number }> {
  const groups: [SyncEntity, { id: string }[]][] = [
    ['findings', data.findings],
    ['complaints', data.complaints],
    ['rcas', data.rcas],
    ['capas', data.capas],
    ['audits', data.audits],
    ['customerExperiences', data.customerExperiences],
    ['documents', data.documents],
  ];

  let pushed = 0;
  let skippedPhotos = 0;

  for (const [entity, records] of groups) {
    for (const record of records) {
      const prepared = prepareRecordForSync(entity, record);
      if (entity === 'findings') {
        const finding = record as unknown as Finding;
        const preparedFinding = prepared as unknown as Finding;
        if ((finding.photoEvidence?.length ?? 0) > (preparedFinding.photoEvidence?.length ?? 0)) {
          skippedPhotos += 1;
        }
      }
      await upsert(entity, prepared);
      pushed += 1;
    }
  }

  return { pushed, skippedPhotos };
}