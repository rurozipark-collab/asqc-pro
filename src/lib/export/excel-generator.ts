import * as XLSX from 'xlsx';
import { dashboardKPI, mockFindings, mockComplaints, mockAudits, mockCAPAs, mockCX, monthlyFindingsTrend } from '@/lib/data/mock-data';
import { AIRPORT_NAME } from '@/lib/data/master-areas';

export function generateExcelReport(reportType: string, period: string): Buffer {
  const wb = XLSX.utils.book_new();

  const header = [[`ASQC PRO - ${reportType} Report`], [AIRPORT_NAME], [`Period: ${period}`], [`Generated: ${new Date().toLocaleDateString('id-ID')}`], []];

  // Executive Dashboard Sheet
  const kpiData = [
    ...header,
    ['KPI Dashboard'],
    ['Metric', 'Value'],
    ['Total Findings', dashboardKPI.totalFindings],
    ['Open Findings', dashboardKPI.openFindings],
    ['Closed Findings', dashboardKPI.closedFindings],
    ['Overdue Findings', dashboardKPI.overdueFindings],
    ['Open Complaints', dashboardKPI.openComplaints],
    ['Closed Complaints', dashboardKPI.closedComplaints],
    ['SLA Achievement (%)', dashboardKPI.slaAchievement],
    ['Customer Satisfaction Index (%)', dashboardKPI.customerSatisfactionIndex],
    ['Service Quality Index (%)', dashboardKPI.serviceQualityIndex],
    ['Audit Compliance Score (%)', dashboardKPI.auditComplianceScore],
  ];
  const wsKPI = XLSX.utils.aoa_to_sheet(kpiData);
  wsKPI['!cols'] = [{ wch: 35 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsKPI, 'Executive Dashboard');

  // Findings Sheet
  const findingsData = [
    ['Finding #', 'Date', 'Terminal', 'Zone', 'Area', 'Category', 'Risk', 'Priority', 'Status', 'Stakeholder', 'PIC', 'Due Date', 'Description'],
    ...mockFindings.map((f) => [f.findingNumber, f.date, f.terminal, f.zone, f.area, f.category, f.riskLevel, f.priority, f.status, f.stakeholder, f.pic, f.dueDate, f.description]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(findingsData), 'Findings');

  // Complaints Sheet
  const complaintsData = [
    ['Complaint #', 'Date', 'Channel', 'Customer Type', 'Category', 'Terminal', 'Area', 'Status', 'Description'],
    ...mockComplaints.map((c) => [c.complaintNumber, c.date, c.channel, c.customerType, c.category, c.terminal, c.area, c.status, c.description]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(complaintsData), 'Complaints');

  // Audits Sheet
  const auditsData = [
    ['Audit #', 'Type', 'Date', 'Terminal', 'Area', 'Score', 'NC', 'OBS', 'OFI', 'Status'],
    ...mockAudits.map((a) => [a.auditNumber, a.auditType, a.date, a.terminal, a.area, a.score, a.nonConformance, a.observation, a.opportunityForImprovement, a.status]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(auditsData), 'Audits');

  // CAPA Sheet
  const capaData = [
    ['CAPA #', 'Title', 'Source', 'Assigned To', 'Stakeholder', 'Status', 'Progress', 'Due Date', 'Overdue'],
    ...mockCAPAs.map((c) => [c.capaNumber, c.title, `${c.sourceType}:${c.sourceId}`, c.assignedTo, c.stakeholder, c.status, `${c.progress}%`, c.dueDate, c.isOverdue ? 'Yes' : 'No']),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(capaData), 'CAPA');

  // CX Sheet
  const cxData = [
    ['Date', 'Terminal', 'Area', 'CX Score', 'NPS', 'CSAT', 'CES', 'Process Time', 'Queue Time'],
    ...mockCX.map((c) => [c.date, c.terminal, c.area, c.cxScore, c.nps, c.csat, c.ces, c.waitingTime, c.queueTime]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cxData), 'Customer Experience');

  // Trend Analysis Sheet
  const trendData = [
    ['Month', 'Findings', 'Closed', 'Complaints'],
    ...monthlyFindingsTrend.map((t, i) => [t.month, t.findings, t.closed, '']),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(trendData), 'Trend Analysis');

  // Raw Data Sheet
  const rawData = [
    ['Type', 'ID', 'Date', 'Location', 'Category', 'Status'],
    ...mockFindings.map((f) => ['Finding', f.findingNumber, f.date, `${f.terminal}/${f.area}`, f.category, f.status]),
    ...mockComplaints.map((c) => ['Complaint', c.complaintNumber, c.date, `${c.terminal}/${c.area}`, c.category, c.status]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rawData), 'Raw Data');

  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}