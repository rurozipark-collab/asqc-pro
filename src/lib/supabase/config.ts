export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const SYNC_TABLES = {
  findings: 'app_findings',
  complaints: 'app_complaints',
  rcas: 'app_rcas',
  capas: 'app_capas',
  audits: 'app_audits',
  customerExperiences: 'app_customer_experience',
  documents: 'app_documents',
} as const;

export type SyncEntity = keyof typeof SYNC_TABLES;