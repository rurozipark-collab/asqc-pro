import PptxGenJS from 'pptxgenjs';
import { dashboardKPI, mockFindings, mockComplaints, mockCAPAs } from '@/lib/data/mock-data';
import { AIRPORT_NAME } from '@/lib/data/master-areas';

export async function generatePPTXReport(reportType: string, period: string): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'ASQC', width: 13.33, height: 7.5 });
  pptx.layout = 'ASQC';

  const titleOpts: PptxGenJS.TextPropsOptions = { x: 0.5, w: 12, align: 'center', fontSize: 28, color: '06B6D4', bold: true };
  const subtitleOpts: PptxGenJS.TextPropsOptions = { x: 0.5, w: 12, align: 'center', fontSize: 14, color: '94A3B8' };

  // Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: '0F172A' };
  slide1.addText('ASQC PRO', titleOpts);
  slide1.addText(`${reportType} Report`, { ...subtitleOpts, y: 2.5, fontSize: 20, color: 'FFFFFF' });
  slide1.addText(AIRPORT_NAME, { ...subtitleOpts, y: 3.5 });
  slide1.addText(`Period: ${period}`, { ...subtitleOpts, y: 4.2, fontSize: 12 });
  slide1.addText(`Generated: ${new Date().toLocaleDateString('id-ID')}`, { ...subtitleOpts, y: 4.8, fontSize: 12 });

  // Executive Summary
  const slide2 = pptx.addSlide();
  slide2.background = { color: '0F172A' };
  slide2.addText('Executive Summary', { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide2.addText([
    { text: `Service Quality Index: ${dashboardKPI.serviceQualityIndex}%`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: `SLA Achievement: ${dashboardKPI.slaAchievement}%`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: `Customer Satisfaction: ${dashboardKPI.customerSatisfactionIndex}%`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: `Open Findings: ${dashboardKPI.openFindings} | Overdue: ${dashboardKPI.overdueFindings}`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: `Open Complaints: ${dashboardKPI.openComplaints}`, options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
  ], { x: 0.8, y: 1.5, w: 11, h: 4 });

  // KPI Achievement
  const slide3 = pptx.addSlide();
  slide3.background = { color: '0F172A' };
  slide3.addText('KPI Achievement', { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide3.addTable([
    [
      { text: 'KPI', options: { fill: { color: '06B6D4' }, color: 'FFFFFF', bold: true } },
      { text: 'Value', options: { fill: { color: '06B6D4' }, color: 'FFFFFF', bold: true } },
      { text: 'Status', options: { fill: { color: '06B6D4' }, color: 'FFFFFF', bold: true } },
    ],
    [
      { text: 'SLA Achievement' },
      { text: `${dashboardKPI.slaAchievement}%` },
      { text: 'On Target' },
    ],
    [
      { text: 'Service Quality Index' },
      { text: `${dashboardKPI.serviceQualityIndex}%` },
      { text: 'Good' },
    ],
    [
      { text: 'Customer Satisfaction' },
      { text: `${dashboardKPI.customerSatisfactionIndex}%` },
      { text: 'Good' },
    ],
    [
      { text: 'Audit Compliance' },
      { text: `${dashboardKPI.auditComplianceScore}%` },
      { text: 'Good' },
    ],
  ], { x: 1, y: 1.5, w: 11, fontSize: 12, color: 'E2E8F0', border: { type: 'solid', color: '334155' } });

  // Findings Analysis
  const slide4 = pptx.addSlide();
  slide4.background = { color: '0F172A' };
  slide4.addText('Findings Analysis', { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide4.addTable([
    [
      { text: 'Finding #' }, { text: 'Location' }, { text: 'Category' }, { text: 'Risk' }, { text: 'Status' },
    ],
    ...mockFindings.map((f) => [
      { text: f.findingNumber },
      { text: `${f.terminal} - ${f.area}` },
      { text: f.category },
      { text: f.riskLevel },
      { text: f.status },
    ]),
  ], { x: 0.5, y: 1.2, w: 12, fontSize: 10, color: 'E2E8F0' });

  // Complaint Analysis
  const slide5 = pptx.addSlide();
  slide5.background = { color: '0F172A' };
  slide5.addText('Complaint Analysis', { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '8B5CF6', bold: true });
  slide5.addTable([
    [
      { text: 'Complaint #' }, { text: 'Channel' }, { text: 'Category' }, { text: 'Location' }, { text: 'Status' },
    ],
    ...mockComplaints.map((c) => [
      { text: c.complaintNumber },
      { text: c.channel },
      { text: c.category },
      { text: `${c.terminal} - ${c.area}` },
      { text: c.status },
    ]),
  ], { x: 0.5, y: 1.2, w: 12, fontSize: 10, color: 'E2E8F0' });

  // CAPA Progress
  const slide6 = pptx.addSlide();
  slide6.background = { color: '0F172A' };
  slide6.addText('CAPA Progress', { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '10B981', bold: true });
  slide6.addTable([
    [
      { text: 'CAPA #' }, { text: 'Title' }, { text: 'Status' }, { text: 'Progress' }, { text: 'Due Date' },
    ],
    ...mockCAPAs.map((c) => [
      { text: c.capaNumber },
      { text: c.title },
      { text: c.status },
      { text: `${c.progress}%` },
      { text: c.dueDate },
    ]),
  ], { x: 0.5, y: 1.2, w: 12, fontSize: 10, color: 'E2E8F0' });

  // Improvement Plan
  const slide7 = pptx.addSlide();
  slide7.background = { color: '0F172A' };
  slide7.addText('Improvement Plan', { x: 0.5, y: 0.3, w: 12, fontSize: 24, color: '06B6D4', bold: true });
  slide7.addText([
    { text: 'Deploy AI-based passenger flow prediction', options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: 'Implement IoT toilet monitoring sensors', options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: 'Update digital wayfinding system', options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: 'Automated stakeholder SLA escalation', options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
    { text: 'Reduce queue time target to 12 minutes', options: { bullet: true, color: 'E2E8F0', fontSize: 14 } },
  ], { x: 0.8, y: 1.5, w: 11, h: 4 });

  const output = await pptx.write({ outputType: 'nodebuffer' });
  return output as Buffer;
}