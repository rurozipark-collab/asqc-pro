import PptxGenJS from 'pptxgenjs';
import { AIRPORT_NAME } from '@/lib/data/master-areas';
import type { ExportPayload } from '@/lib/export/export-data';
import { EXPORT_LABELS, labelRisk, labelStatus, reportTitle } from '@/lib/export/export-data';

export async function generatePPTXReport(reportType: string, period: string, payload: ExportPayload): Promise<Buffer> {
  const { kpi, findings, complaints, capas } = payload;
  const pptx = new PptxGenJS();
  const title = reportTitle(reportType);
  pptx.defineLayout({ name: 'ASQC', width: 13.33, height: 7.5 });
  pptx.layout = 'ASQC';

  const titleOpts: PptxGenJS.TextPropsOptions = { x: 0.5, w: 12, align: 'center', fontSize: 28, color: '06B6D4', bold: true };
  const subtitleOpts: PptxGenJS.TextPropsOptions = { x: 0.5, w: 12, align: 'center', fontSize: 14, color: '94A3B8' };

  const slide1 = pptx.addSlide();
  slide1.background = { color: '0F172A' };
  slide1.addText(EXPORT_LABELS.appName, titleOpts);
  slide1.addText(title, { ...subtitleOpts, y: 2.5, fontSize: 20, color: 'FFFFFF' });
  slide1.addText(AIRPORT_NAME, { ...subtitleOpts, y: 3.5 });
  slide1.addText(`${EXPORT_LABELS.period}: ${period}`, { ...subtitleOpts, y: 4.2, fontSize: 12 });
  slide1.addText(`${EXPORT_LABELS.generated}: ${new Date().toLocaleDateString('id-ID')}`, { ...subtitleOpts, y: 4.8, fontSize: 12 });

  const slide2 = pptx.addSlide();
  slide2.background = { color: '0F172A' };
  slide2.addText(EXPORT_LABELS.executiveSummary, { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide2.addText([
    { text: `Indeks Kualitas Layanan: ${kpi.serviceQualityIndex}%`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: `Pencapaian SLA: ${kpi.slaAchievement}%`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: `Kepuasan Pelanggan: ${kpi.customerSatisfactionIndex}%`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: `Temuan Terbuka: ${kpi.openFindings} | Terlambat: ${kpi.overdueFindings}`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: `Keluhan Terbuka: ${kpi.openComplaints}`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
  ], { x: 0.8, y: 1.5, w: 11, h: 4 });

  const slide3 = pptx.addSlide();
  slide3.background = { color: '0F172A' };
  slide3.addText(EXPORT_LABELS.kpiDashboard, { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide3.addTable([
    [
      { text: EXPORT_LABELS.metric, options: { fill: { color: '06B6D4' }, color: 'FFFFFF', bold: true } },
      { text: EXPORT_LABELS.value, options: { fill: { color: '06B6D4' }, color: 'FFFFFF', bold: true } },
      { text: EXPORT_LABELS.status, options: { fill: { color: '06B6D4' }, color: 'FFFFFF', bold: true } },
    ],
    [{ text: 'Pencapaian SLA' }, { text: `${kpi.slaAchievement}%` }, { text: EXPORT_LABELS.onTarget }],
    [{ text: 'Indeks Kualitas Layanan' }, { text: `${kpi.serviceQualityIndex}%` }, { text: EXPORT_LABELS.good }],
    [{ text: 'Kepuasan Pelanggan' }, { text: `${kpi.customerSatisfactionIndex}%` }, { text: EXPORT_LABELS.good }],
    [{ text: 'Kepatuhan Audit' }, { text: `${kpi.auditComplianceScore}%` }, { text: EXPORT_LABELS.good }],
  ], { x: 1, y: 1.5, w: 11, fontSize: 12, color: 'E2E8F0', border: { type: 'solid', color: '334155' } });

  const slide4 = pptx.addSlide();
  slide4.background = { color: '0F172A' };
  slide4.addText(EXPORT_LABELS.findingsSummary, { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide4.addTable([
    [{ text: 'No. Temuan' }, { text: 'Lokasi' }, { text: 'Kategori' }, { text: 'Risiko' }, { text: 'Status' }],
    ...findings.slice(0, 8).map((f) => [
      { text: f.findingNumber },
      { text: `${f.terminal} - ${f.area}` },
      { text: f.category },
      { text: labelRisk(f.riskLevel) },
      { text: labelStatus(f.status) },
    ]),
  ], { x: 0.5, y: 1.2, w: 12, fontSize: 10, color: 'E2E8F0', border: { type: 'solid', color: '334155' } });

  const slide5 = pptx.addSlide();
  slide5.background = { color: '0F172A' };
  slide5.addText(EXPORT_LABELS.complaintSummary, { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide5.addTable([
    [{ text: 'No. Keluhan' }, { text: 'Saluran' }, { text: 'Kategori' }, { text: 'Status' }],
    ...complaints.slice(0, 8).map((c) => [
      { text: c.complaintNumber },
      { text: c.channel },
      { text: c.category },
      { text: labelStatus(c.status) },
    ]),
  ], { x: 0.5, y: 1.2, w: 12, fontSize: 10, color: 'E2E8F0', border: { type: 'solid', color: '334155' } });

  const slide6 = pptx.addSlide();
  slide6.background = { color: '0F172A' };
  slide6.addText(EXPORT_LABELS.capaSummary, { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide6.addTable([
    [{ text: 'No. CAPA' }, { text: 'Judul' }, { text: 'Status' }, { text: 'Progres' }],
    ...capas.slice(0, 8).map((c) => [
      { text: c.capaNumber },
      { text: c.title },
      { text: labelStatus(c.status) },
      { text: `${c.progress}%` },
    ]),
  ], { x: 0.5, y: 1.2, w: 12, fontSize: 10, color: 'E2E8F0', border: { type: 'solid', color: '334155' } });

  const arrayBuffer = await pptx.write({ outputType: 'arraybuffer' });
  return Buffer.from(arrayBuffer as ArrayBuffer);
}