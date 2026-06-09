import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AIRPORT_NAME } from '@/lib/data/master-areas';
import type { ExportPayload } from '@/lib/export/export-data';
import { EXPORT_LABELS, labelRisk, labelStatus, reportTitle } from '@/lib/export/export-data';

export function generatePDFReport(reportType: string, period: string, payload: ExportPayload): Buffer {
  const { kpi, findings, complaints, capas } = payload;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = reportTitle(reportType);

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 297, 'F');
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(28);
  doc.text(EXPORT_LABELS.appName, pageWidth / 2, 80, { align: 'center' });
  doc.setFontSize(14);
  doc.setTextColor(148, 163, 184);
  doc.text(EXPORT_LABELS.subtitle, pageWidth / 2, 95, { align: 'center' });
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(title, pageWidth / 2, 140, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184);
  doc.text(AIRPORT_NAME, pageWidth / 2, 160, { align: 'center' });
  doc.text(`${EXPORT_LABELS.period}: ${period}`, pageWidth / 2, 175, { align: 'center' });
  doc.text(`${EXPORT_LABELS.generated}: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 185, { align: 'center' });
  doc.text(`${EXPORT_LABELS.reportNo}: RPT-${reportType.toUpperCase()}-${Date.now().toString().slice(-6)}`, pageWidth / 2, 195, { align: 'center' });

  doc.addPage();
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text(EXPORT_LABELS.executiveSummary, 20, 25);
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);

  const summary = [
    `Laporan ${title} untuk ${AIRPORT_NAME}.`,
    `Indeks Kualitas Layanan: ${kpi.serviceQualityIndex}% | Pencapaian SLA: ${kpi.slaAchievement}%`,
    `Kepuasan Pelanggan: ${kpi.customerSatisfactionIndex}% | Kepatuhan Audit: ${kpi.auditComplianceScore}%`,
    `Total Temuan: ${kpi.totalFindings} | Terbuka: ${kpi.openFindings} | Terlambat: ${kpi.overdueFindings}`,
    `Keluhan Terbuka: ${kpi.openComplaints} | Keluhan Tertutup: ${kpi.closedComplaints}`,
  ];
  summary.forEach((line, i) => doc.text(line, 20, 40 + i * 10));

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(EXPORT_LABELS.kpiDashboard, 20, 100);

  autoTable(doc, {
    startY: 110,
    head: [[EXPORT_LABELS.metric, EXPORT_LABELS.value, EXPORT_LABELS.status]],
    body: [
      ['Total Temuan', kpi.totalFindings.toString(), EXPORT_LABELS.tracking],
      ['Temuan Terbuka', kpi.openFindings.toString(), kpi.openFindings > 50 ? EXPORT_LABELS.attention : EXPORT_LABELS.normal],
      ['Temuan Terlambat', kpi.overdueFindings.toString(), kpi.overdueFindings > 20 ? EXPORT_LABELS.critical : EXPORT_LABELS.normal],
      ['Pencapaian SLA', `${kpi.slaAchievement}%`, kpi.slaAchievement >= 90 ? EXPORT_LABELS.onTarget : EXPORT_LABELS.belowTarget],
      ['Kepuasan Pelanggan', `${kpi.customerSatisfactionIndex}%`, EXPORT_LABELS.good],
      ['Indeks Kualitas Layanan', `${kpi.serviceQualityIndex}%`, EXPORT_LABELS.good],
      ['Kepatuhan Audit', `${kpi.auditComplianceScore}%`, EXPORT_LABELS.good],
    ],
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212] },
  });

  doc.addPage();
  doc.setFontSize(14);
  doc.text(EXPORT_LABELS.findingsSummary, 20, 25);
  autoTable(doc, {
    startY: 35,
    head: [['No. Temuan', 'Tanggal', 'Lokasi', 'Kategori', 'Risiko', 'Status']],
    body: findings.map((f) => [
      f.findingNumber,
      f.date,
      `${f.terminal} - ${f.area}`,
      f.category,
      labelRisk(f.riskLevel),
      labelStatus(f.status),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [6, 182, 212] },
    styles: { fontSize: 8 },
  });

  doc.addPage();
  doc.setFontSize(14);
  doc.text(EXPORT_LABELS.complaintSummary, 20, 25);
  autoTable(doc, {
    startY: 35,
    head: [['No. Keluhan', 'Tanggal', 'Saluran', 'Kategori', 'Status']],
    body: complaints.map((c) => [c.complaintNumber, c.date, c.channel, c.category, labelStatus(c.status)]),
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246] },
    styles: { fontSize: 8 },
  });

  doc.addPage();
  doc.setFontSize(14);
  doc.text(EXPORT_LABELS.capaSummary, 20, 25);
  autoTable(doc, {
    startY: 35,
    head: [['No. CAPA', 'Judul', 'Status', 'Progres', 'Batas Waktu']],
    body: capas.map((c) => [c.capaNumber, c.title, labelStatus(c.status), `${c.progress}%`, c.dueDate]),
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 8 },
  });

  doc.addPage();
  doc.setFontSize(14);
  doc.text(EXPORT_LABELS.aiRecommendations, 20, 25);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const recommendations = [
    '1. Optimalkan manajemen antrian di titik layanan prioritas',
    '2. Tingkatkan frekuensi inspeksi fasilitas penumpang',
    '3. Perkuat koordinasi stakeholder untuk penyelesaian temuan',
    '4. Lakukan review bulanan CAPA dan tindak lanjut audit',
    '5. Monitor NPS dan CSAT secara berkala per terminal',
  ];
  recommendations.forEach((r, i) => doc.text(r, 20, 40 + i * 12));

  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(EXPORT_LABELS.approval, 20, 25);
  doc.setFontSize(10);
  doc.text(`${EXPORT_LABELS.preparedBy}: _________________________`, 20, 80);
  doc.text('Airport Service Quality Control', 20, 90);
  doc.text(`${EXPORT_LABELS.reviewedBy}: _________________________`, 20, 120);
  doc.text('Service Quality Supervisor', 20, 130);
  doc.text(`${EXPORT_LABELS.approvedBy}: _________________________`, 20, 160);
  doc.text('General Manager', 20, 170);

  return Buffer.from(doc.output('arraybuffer'));
}