import * as XLSX from 'xlsx';
import { AIRPORT_NAME } from '@/lib/data/master-areas';
import type { ExportPayload } from '@/lib/export/export-data';
import { EXPORT_LABELS, labelRisk, labelStatus, reportTitle } from '@/lib/export/export-data';
import { getCreatedAtDisplay } from '@/lib/utils';

export function generateExcelReport(reportType: string, period: string, payload: ExportPayload): Buffer {
  const { kpi, findings, complaints, audits, capas, customerExperiences } = payload;
  const wb = XLSX.utils.book_new();
  const title = reportTitle(reportType);

  const header = [
    [`${EXPORT_LABELS.appName} - ${title}`],
    [AIRPORT_NAME],
    [`${EXPORT_LABELS.period}: ${period}`],
    [`${EXPORT_LABELS.generated}: ${new Date().toLocaleDateString('id-ID')}`],
    [],
  ];

  const kpiData = [
    ...header,
    [EXPORT_LABELS.kpiDashboard],
    [EXPORT_LABELS.metric, EXPORT_LABELS.value],
    ['Total Temuan', kpi.totalFindings],
    ['Temuan Terbuka', kpi.openFindings],
    ['Temuan Tertutup', kpi.closedFindings],
    ['Temuan Terlambat', kpi.overdueFindings],
    ['Keluhan Terbuka', kpi.openComplaints],
    ['Keluhan Tertutup', kpi.closedComplaints],
    ['Pencapaian SLA (%)', kpi.slaAchievement],
    ['Kepuasan Pelanggan (%)', kpi.customerSatisfactionIndex],
    ['Indeks Kualitas Layanan (%)', kpi.serviceQualityIndex],
    ['Kepatuhan Audit (%)', kpi.auditComplianceScore],
  ];
  const wsKPI = XLSX.utils.aoa_to_sheet(kpiData);
  wsKPI['!cols'] = [{ wch: 35 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsKPI, EXPORT_LABELS.sheets.executive);

  const findingsData = [
    ['No. Temuan', 'Waktu Input', 'Tanggal', 'Terminal', 'Zona', 'Area', 'Kategori', 'Risiko', 'Prioritas', 'Status', 'Stakeholder', 'PIC', 'Batas Waktu', 'Deskripsi'],
    ...findings.map((f) => [
      f.findingNumber,
      getCreatedAtDisplay(f),
      f.date,
      f.terminal,
      f.zone,
      f.area,
      f.category,
      labelRisk(f.riskLevel),
      labelRisk(f.priority),
      labelStatus(f.status),
      f.stakeholder,
      f.pic,
      f.dueDate,
      f.description,
    ]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(findingsData), EXPORT_LABELS.sheets.findings);

  const complaintsData = [
    ['No. Keluhan', 'Waktu Input', 'Tanggal', 'Saluran', 'Tipe Pelanggan', 'Kategori', 'Terminal', 'Area', 'Status', 'Deskripsi'],
    ...complaints.map((c) => [
      c.complaintNumber,
      getCreatedAtDisplay(c),
      c.date,
      c.channel,
      c.customerType,
      c.category,
      c.terminal,
      c.area,
      labelStatus(c.status),
      c.description,
    ]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(complaintsData), EXPORT_LABELS.sheets.complaints);

  const auditsData = [
    ['No. Audit', 'Tipe', 'Tanggal', 'Terminal', 'Area', 'Skor', 'NC', 'OBS', 'OFI', 'Status'],
    ...audits.map((a) => [a.auditNumber, a.auditType, a.date, a.terminal, a.area, a.score, a.nonConformance, a.observation, a.opportunityForImprovement, labelStatus(a.status)]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(auditsData), EXPORT_LABELS.sheets.audits);

  const capaData = [
    ['No. CAPA', 'Judul', 'Sumber', 'Ditugaskan', 'Stakeholder', 'Status', 'Progres', 'Batas Waktu', 'Terlambat'],
    ...capas.map((c) => [c.capaNumber, c.title, `${c.sourceType}:${c.sourceId}`, c.assignedTo, c.stakeholder, labelStatus(c.status), `${c.progress}%`, c.dueDate, c.isOverdue ? EXPORT_LABELS.yes : EXPORT_LABELS.no]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(capaData), EXPORT_LABELS.sheets.capa);

  const cxData = [
    ['Tanggal', 'Terminal', 'Area', 'Skor CX', 'NPS', 'CSAT', 'CES', 'Waktu Proses', 'Waktu Antrian'],
    ...customerExperiences.map((c) => [c.date, c.terminal, c.area, c.cxScore, c.nps, c.csat, c.ces, c.waitingTime, c.queueTime]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cxData), EXPORT_LABELS.sheets.cx);

  const rawData = [
    ['Tipe', 'ID', 'Waktu Input', 'Tanggal', 'Lokasi', 'Kategori', 'Status'],
    ...findings.map((f) => ['Temuan', f.findingNumber, getCreatedAtDisplay(f), f.date, `${f.terminal}/${f.area}`, f.category, labelStatus(f.status)]),
    ...complaints.map((c) => ['Keluhan', c.complaintNumber, getCreatedAtDisplay(c), c.date, `${c.terminal}/${c.area}`, c.category, labelStatus(c.status)]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rawData), EXPORT_LABELS.sheets.raw);

  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}