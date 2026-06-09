-- ASQC PRO — Operational sync tables (flat JSON, matches app types)
-- Run this in Supabase SQL Editor after creating your project.

CREATE TABLE IF NOT EXISTS app_findings (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_complaints (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_rcas (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_capas (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_audits (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_customer_experience (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_documents (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_rcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_capas ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_customer_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_findings_all" ON app_findings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "app_complaints_all" ON app_complaints FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "app_rcas_all" ON app_rcas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "app_capas_all" ON app_capas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "app_audits_all" ON app_audits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "app_customer_experience_all" ON app_customer_experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "app_documents_all" ON app_documents FOR ALL USING (true) WITH CHECK (true);