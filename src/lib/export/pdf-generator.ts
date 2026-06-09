import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { dashboardKPI, mockFindings, mockComplaints, mockCAPAs } from '@/lib/data/mock-data';
import { AIRPORT_NAME } from '@/lib/data/master-areas';

export function generatePDFReport(reportType: string, period: string): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cover Page
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 297, 'F');
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(28);
  doc.text('ASQC PRO', pageWidth / 2, 80, { align: 'center' });
  doc.setFontSize(14);
  doc.setTextColor(148, 163, 184);
  doc.text('Airport Service Quality & Customer Experience', pageWidth / 2, 95, { align: 'center' });
  doc.text('Management Platform', pageWidth / 2, 105, { align: 'center' });
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(`${reportType} Report`, pageWidth / 2, 140, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184);
  doc.text(AIRPORT_NAME, pageWidth / 2, 160, { align: 'center' });
  doc.text(`Report Period: ${period}`, pageWidth / 2, 175, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 185, { align: 'center' });
  doc.text(`Report No: RPT-${reportType.toUpperCase()}-${Date.now().toString().slice(-6)}`, pageWidth / 2, 195, { align: 'center' });

  // Executive Summary Page
  doc.addPage();
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text('Executive Summary', 20, 25);
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);

  const summary = [
    `This ${reportType} report provides a comprehensive overview of service quality performance at ${AIRPORT_NAME}.`,
    `Service Quality Index: ${dashboardKPI.serviceQualityIndex}% | SLA Achievement: ${dashboardKPI.slaAchievement}%`,
    `Customer Satisfaction Index: ${dashboardKPI.customerSatisfactionIndex}% | Audit Compliance: ${dashboardKPI.auditComplianceScore}%`,
    `Total Findings: ${dashboardKPI.totalFindings} | Open: ${dashboardKPI.openFindings} | Overdue: ${dashboardKPI.overdueFindings}`,
    `Open Complaints: ${dashboardKPI.openComplaints} | Closed Complaints: ${dashboardKPI.closedComplaints}`,
  ];
  summary.forEach((line, i) => doc.text(line, 20, 40 + i * 10));

  // KPI Table
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('KPI Dashboard', 20, 100);

  autoTable(doc, {
    startY: 110,
    head: [['KPI', 'Value', 'Status']],
    body: [
      ['Total Findings', dashboardKPI.totalFindings.toString(), 'Tracking'],
      ['Open Findings', dashboardKPI.openFindings.toString(), dashboardKPI.openFindings > 50 ? 'Attention' : 'Normal'],
      ['Overdue Findings', dashboardKPI.overdueFindings.toString(), dashboardKPI.overdueFindings > 20 ? 'Critical' : 'Normal'],
      ['SLA Achievement', `${dashboardKPI.slaAchievement}%`, dashboardKPI.slaAchievement >= 90 ? 'On Target' : 'Below Target'],
      ['Customer Satisfaction', `${dashboardKPI.customerSatisfactionIndex}%`, 'Good'],
      ['Service Quality Index', `${dashboardKPI.serviceQualityIndex}%`, 'Good'],
      ['Audit Compliance', `${dashboardKPI.auditComplianceScore}%`, 'Good'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212] },
  });

  // Findings Table
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Findings Summary', 20, 25);
  autoTable(doc, {
    startY: 35,
    head: [['Finding #', 'Date', 'Location', 'Category', 'Risk', 'Status']],
    body: mockFindings.map((f) => [f.findingNumber, f.date, `${f.terminal} - ${f.area}`, f.category, f.riskLevel, f.status]),
    theme: 'striped',
    headStyles: { fillColor: [6, 182, 212] },
    styles: { fontSize: 8 },
  });

  // Complaints
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Complaint Summary', 20, 25);
  autoTable(doc, {
    startY: 35,
    head: [['Complaint #', 'Date', 'Channel', 'Category', 'Status']],
    body: mockComplaints.map((c) => [c.complaintNumber, c.date, c.channel, c.category, c.status]),
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246] },
    styles: { fontSize: 8 },
  });

  // CAPA Summary
  doc.addPage();
  doc.setFontSize(14);
  doc.text('CAPA Summary', 20, 25);
  autoTable(doc, {
    startY: 35,
    head: [['CAPA #', 'Title', 'Status', 'Progress', 'Due Date']],
    body: mockCAPAs.map((c) => [c.capaNumber, c.title, c.status, `${c.progress}%`, c.dueDate]),
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 8 },
  });

  // AI Recommendations
  doc.addPage();
  doc.setFontSize(14);
  doc.text('AI Recommendations', 20, 25);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const recommendations = [
    '1. Deploy AI-based passenger flow prediction at T3 Security Checkpoint',
    '2. Implement IoT sensors for toilet supply monitoring',
    '3. Update wayfinding system with digital interactive displays',
    '4. Monthly stakeholder performance review with automated escalation',
    '5. Reduce average queue time from 18 to 12 minutes',
  ];
  recommendations.forEach((r, i) => doc.text(r, 20, 40 + i * 12));

  // Signature Page
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Approval & Signature', 20, 25);
  doc.setFontSize(10);
  doc.text('Prepared by: _________________________', 20, 80);
  doc.text('Airport Service Quality Control', 20, 90);
  doc.text('Reviewed by: _________________________', 20, 120);
  doc.text('Service Quality Supervisor', 20, 130);
  doc.text('Approved by: _________________________', 20, 160);
  doc.text('General Manager', 20, 170);

  return Buffer.from(doc.output('arraybuffer'));
}