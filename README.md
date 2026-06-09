# ASQC PRO

**Airport Service Quality & Customer Experience Management Platform**

Enterprise-grade web application for Soekarno-Hatta International Airport (CGK).

## Features

- **Executive Dashboard** — Power BI style real-time KPI monitoring
- **Inspection Management** — Finding registration with AI analysis
- **Complaint Management** — Multi-channel complaint tracking with AI
- **Root Cause Analysis** — 5 Why & Fishbone (6M) with AI generation
- **CAPA Management** — Full workflow with progress tracking & escalation
- **Service Quality Audit** — Regulatory (PM, KP, ICAO, IATA) & Internal audits
- **Customer Experience** — CX Score, NPS, CSAT, CES monitoring
- **Document Control** — SOP, SLA, SLG version control & approval workflow
- **Stakeholder Performance** — SLA & compliance tracking
- **Enterprise Reporting** — PDF, Excel, PowerPoint export
- **AI Assistant** — Smart analysis, recommendations & report generation

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase, PostgreSQL
- **Charts:** Recharts, ECharts
- **Export:** jsPDF, xlsx, pptxgenjs
- **AI:** OpenAI / Claude / Grok API (optional)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Run `supabase/schema.sql` in your Supabase SQL editor to create all tables.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Executive Dashboard
│   ├── inspections/        # Inspection Management
│   ├── complaints/         # Complaint Management
│   ├── rca/                # Root Cause Analysis
│   ├── capa/               # CAPA Management
│   ├── audits/             # Service Quality Audit
│   ├── customer-experience/# CX Management
│   ├── documents/          # Document Control
│   ├── stakeholders/       # Stakeholder Performance
│   ├── reports/            # Reporting Engine
│   ├── ai-assistant/       # AI Assistant
│   └── api/                # API routes
├── components/             # UI components
├── lib/                    # Utilities, data, export
└── types/                  # TypeScript types
```

## License

Proprietary — PT Angkasa Pura II / CGK Airport Operations