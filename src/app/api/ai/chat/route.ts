import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const msg = (message || '').toLowerCase();

  let response = '';

  if (msg.includes('rca') || msg.includes('root cause')) {
    response = `**RCA Generation Ready**\n\nSaya dapat membuat Root Cause Analysis dengan metode 5 Why dan Fishbone Diagram (6M: Man, Machine, Method, Material, Environment, Management).\n\nLangkah selanjutnya:\n1. Buka modul RCA Management\n2. Pilih referensi Finding atau Complaint\n3. Klik "AI Generate RCA"\n\nAtau berikan nomor finding/complaint spesifik untuk saya analisis.`;
  } else if (msg.includes('report') || msg.includes('laporan')) {
    response = `**Enterprise Reporting Engine**\n\nLaporan tersedia dalam format:\n- PDF (Corporate Executive Report)\n- Excel (Executive Workbook dengan pivot & charts)\n- PowerPoint (Board-ready presentation)\n\nJenis laporan: Daily, Weekly, Monthly, Quarterly, Annual, Audit, Complaint, CAPA, CX, GM Report, Board Report.\n\nBuka modul Reporting Engine untuk generate laporan.`;
  } else if (msg.includes('complaint') || msg.includes('keluhan')) {
    response = `**Analisis Tren Keluhan**\n\nBerdasarkan data terkini CGK Airport:\n- Top complaint: Long Queue Time (67 kasus)\n- Toilet Cleanliness (54 kasus)\n- Baggage Delay (48 kasus)\n\nTren bulan ini: +5.4% open complaints\nRekomendasi: Fokus pada optimasi queue management di Security Checkpoint T3 dan peningkatan frekuensi cleaning toilet facility.`;
  } else if (msg.includes('capa')) {
    response = `**CAPA Status Overview**\n\nTotal CAPA aktif: 99\n- Open: 24 | Assigned: 18 | In Progress: 45\n- Verification: 12 | Closed: 156\n\n⚠️ 1 CAPA overdue (Security Lane Optimization)\n⚠️ 1 CAPA escalated\n\nRekomendasi: Prioritaskan CAPA overdue dan lakukan review mingguan dengan stakeholder terkait.`;
  } else if (msg.includes('executive') || msg.includes('gm') || msg.includes('summary')) {
    response = `**Executive Summary — CGK Airport**\n\n📊 Service Quality Index: 91.3% (↑3.4%)\n📊 SLA Achievement: 94.2% (↑2.1%)\n📊 Customer Satisfaction: 87.5% (↑1.8%)\n📊 Audit Compliance: 88.7% (↑0.9%)\n\n🔴 37 overdue findings require immediate attention\n🟡 89 open complaints in progress\n🟢 1,024 findings successfully closed\n\nKey Focus Areas:\n1. T3 Check-in queue management\n2. Toilet facility cleanliness standards\n3. Security checkpoint optimization`;
  } else if (msg.includes('improvement') || msg.includes('rekomendasi')) {
    response = `**AI Service Improvement Recommendations**\n\n1. **Queue Management**: Deploy AI-based passenger flow prediction at T3 Security Checkpoint\n2. **Cleanliness**: Implement IoT sensors for toilet supply monitoring with 30-min cleaning cycles\n3. **Signage**: Update wayfinding system with digital interactive displays\n4. **Stakeholder SLA**: Monthly performance review with automated escalation for SLA breaches\n5. **CX Enhancement**: Reduce average queue time from 18 to 12 minutes through dynamic lane allocation`;
  } else {
    response = `Saya adalah ASQC PRO AI Assistant untuk Bandara Soekarno-Hatta (CGK).\n\nSaya dapat membantu:\n- 🔍 Analisis temuan inspeksi\n- 📋 Manajemen keluhan\n- 🔬 Root Cause Analysis (5 Why & Fishbone)\n- ✅ CAPA management\n- 📊 Laporan eksekutif (PDF/Excel/PPT)\n- 📈 Analisis tren & rekomendasi\n\nSilakan ajukan pertanyaan spesifik atau gunakan quick action di atas.`;
  }

  return NextResponse.json({ response });
}