-- ASQC PRO Database Schema
-- Airport Service Quality & Customer Experience Management Platform
-- Soekarno-Hatta International Airport (CGK)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & Roles
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'QC Staff', 'Supervisor', 'Manager', 'CX Team',
    'General Manager', 'Stakeholder', 'Airline Rep',
    'Ground Handling Rep', 'Cleaning Rep', 'Security Rep'
  )),
  department TEXT,
  terminal TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master Area Hierarchy
CREATE TABLE airports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE terminals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  airport_id UUID REFERENCES airports(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id),
  name TEXT NOT NULL,
  name_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID REFERENCES zones(id),
  name TEXT NOT NULL,
  name_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sub_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_id UUID REFERENCES areas(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_area_id UUID REFERENCES sub_areas(id),
  name TEXT NOT NULL,
  qr_code TEXT UNIQUE,
  gps_lat DECIMAL(10, 8),
  gps_lng DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stakeholders
CREATE TABLE stakeholders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  terminal TEXT,
  sla_target DECIMAL(5, 2) DEFAULT 90.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Findings / Inspections
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finding_number TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  airport_id UUID REFERENCES airports(id),
  terminal_id UUID REFERENCES terminals(id),
  zone_id UUID REFERENCES zones(id),
  area_id UUID REFERENCES areas(id),
  sub_area_id UUID REFERENCES sub_areas(id),
  asset_id UUID REFERENCES assets(id),
  category TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  service_impact TEXT,
  description TEXT NOT NULL,
  photo_evidence TEXT[],
  video_evidence TEXT[],
  gps_lat DECIMAL(10, 8),
  gps_lng DECIMAL(11, 8),
  pic_id UUID REFERENCES users(id),
  stakeholder_id UUID REFERENCES stakeholders(id),
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Verification', 'Closed', 'Overdue')),
  ai_analysis TEXT,
  ai_recommendation TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_number TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  channel TEXT NOT NULL,
  customer_type TEXT NOT NULL,
  category TEXT NOT NULL,
  terminal_id UUID REFERENCES terminals(id),
  zone_id UUID REFERENCES zones(id),
  area_id UUID REFERENCES areas(id),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  ai_analysis TEXT,
  customer_impact TEXT,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Root Cause Analysis
CREATE TABLE rcas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id UUID NOT NULL,
  reference_type TEXT NOT NULL CHECK (reference_type IN ('Finding', 'Complaint', 'Audit')),
  title TEXT NOT NULL,
  five_why JSONB,
  fishbone JSONB,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  recommendation TEXT,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'In Review', 'Approved', 'Closed')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CAPA
CREATE TABLE capas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capa_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('Finding', 'Complaint', 'RCA', 'Audit')),
  source_id UUID NOT NULL,
  assigned_to UUID REFERENCES users(id),
  stakeholder_id UUID REFERENCES stakeholders(id),
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Assigned', 'In Progress', 'Verification', 'Closed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  description TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  verification_notes TEXT,
  is_overdue BOOLEAN DEFAULT FALSE,
  escalated BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audits
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_number TEXT UNIQUE NOT NULL,
  audit_type TEXT NOT NULL,
  date DATE NOT NULL,
  terminal_id UUID REFERENCES terminals(id),
  zone_id UUID REFERENCES zones(id),
  area_id UUID REFERENCES areas(id),
  auditor_id UUID REFERENCES users(id),
  score DECIMAL(5, 2),
  non_conformance INTEGER DEFAULT 0,
  observation INTEGER DEFAULT 0,
  opportunity_for_improvement INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Closed')),
  findings TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Experience
CREATE TABLE customer_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  terminal_id UUID REFERENCES terminals(id),
  area_id UUID REFERENCES areas(id),
  waiting_time DECIMAL(5, 2),
  queue_time DECIMAL(5, 2),
  toilet_cleanliness DECIMAL(5, 2),
  signage_effectiveness DECIMAL(5, 2),
  passenger_comfort DECIMAL(5, 2),
  accessibility DECIMAL(5, 2),

  cx_score DECIMAL(5, 2),
  nps INTEGER,
  csat DECIMAL(3, 2),
  ces DECIMAL(3, 2),
  ai_recommendation TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SOP', 'SLA', 'SLG', 'Service Standard', 'Audit Report', 'QC Report', 'CX Report')),
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Under Review', 'Approved', 'Expired')),
  file_url TEXT,
  uploaded_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  effective_date DATE,
  review_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_number TEXT UNIQUE NOT NULL,
  report_type TEXT NOT NULL,
  period_start DATE,
  period_end DATE,
  format TEXT CHECK (format IN ('PDF', 'Excel', 'PowerPoint')),
  file_url TEXT,
  generated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Chat History
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('finding', 'complaint', 'capa', 'audit', 'document', 'escalation')),
  reference_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_findings_status ON findings(status);
CREATE INDEX idx_findings_terminal ON findings(terminal_id);
CREATE INDEX idx_findings_due_date ON findings(due_date);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_capas_status ON capas(status);
CREATE INDEX idx_capas_due_date ON capas(due_date);
CREATE INDEX idx_audits_date ON audits(date);
CREATE INDEX idx_documents_expiry ON documents(expiry_date);

-- Insert CGK Airport
INSERT INTO airports (code, name) VALUES ('CGK', 'Soekarno-Hatta International Airport');