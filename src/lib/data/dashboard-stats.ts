import type { Finding, Complaint, CAPA, Audit, CustomerExperience } from '@/types';
import { ORGANIZATION_NAME } from '@/lib/data/master-areas';

export function computeDashboardKPI(
  findings: Finding[],
  complaints: Complaint[],
  capas: CAPA[],
  audits: Audit[],
  cx: CustomerExperience[],
) {
  const openFindings = findings.filter((f) => f.status === 'Open' || f.status === 'In Progress').length;
  const closedFindings = findings.filter((f) => f.status === 'Closed').length;
  const overdueFindings = findings.filter((f) => {
    if (f.status === 'Closed') return false;
    return f.dueDate && new Date(f.dueDate) < new Date();
  }).length;
  const openComplaints = complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length;
  const closedComplaints = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  const totalResolved = closedFindings + openFindings;
  const slaAchievement = totalResolved > 0 ? Math.round((closedFindings / totalResolved) * 1000) / 10 : 0;

  const cxLatest = cx[0];
  const customerSatisfactionIndex = cxLatest?.cxScore ?? 0;
  const serviceQualityIndex =
    audits.length > 0
      ? Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length * 10) / 10
      : 0;
  const auditComplianceScore = serviceQualityIndex;

  return {
    totalFindings: findings.length,
    openFindings,
    closedFindings,
    overdueFindings,
    openComplaints,
    closedComplaints,
    slaAchievement,
    customerSatisfactionIndex,
    serviceQualityIndex,
    auditComplianceScore,
  };
}

export function computeRiskDistribution(findings: Finding[]) {
  const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  findings.forEach((f) => {
    if (f.riskLevel in counts) counts[f.riskLevel as keyof typeof counts]++;
  });
  const colors = { Low: '#10b981', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, color: colors[name as keyof typeof colors] }));
}

export function computeCapaProgress(capas: CAPA[]) {
  const counts: Record<string, number> = {};
  capas.forEach((c) => {
    counts[c.status] = (counts[c.status] || 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

export function computeTopLocations(findings: Finding[], limit = 8) {
  const map = new Map<string, number>();
  findings.forEach((f) => {
    const key = `${f.terminal} - ${f.area}`;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([location, count]) => ({ location, count }));
}

export function computeTopComplaintCategories(complaints: Complaint[], limit = 8) {
  const map = new Map<string, number>();
  complaints.forEach((c) => {
    map.set(c.category, (map.get(c.category) || 0) + 1);
  });
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, count]) => ({ category, count }));
}

export function computeMonthlyTrends(findings: Finding[], complaints: Complaint[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const findingByMonth = new Map<string, { findings: number; closed: number }>();
  const complaintByMonth = new Map<string, { complaints: number; resolved: number }>();

  findings.forEach((f) => {
    const m = months[new Date(f.date).getMonth()];
    const entry = findingByMonth.get(m) || { findings: 0, closed: 0 };
    entry.findings++;
    if (f.status === 'Closed') entry.closed++;
    findingByMonth.set(m, entry);
  });

  complaints.forEach((c) => {
    const m = months[new Date(c.date).getMonth()];
    const entry = complaintByMonth.get(m) || { complaints: 0, resolved: 0 };
    entry.complaints++;
    if (c.status === 'Resolved' || c.status === 'Closed') entry.resolved++;
    complaintByMonth.set(m, entry);
  });

  const findingsTrend = [...findingByMonth.entries()].map(([month, v]) => ({ month, ...v }));
  const complaintTrend = [...complaintByMonth.entries()].map(([month, v]) => ({ month, ...v }));

  return { findingsTrend, complaintTrend };
}

export function computeHeatmap(findings: Finding[]) {
  const map = new Map<string, { terminal: string; zone: string; score: number; count: number }>();
  findings.forEach((f) => {
    const key = `${f.terminal}|${f.zone}`;
    const existing = map.get(key);
    const riskScore = { Low: 90, Medium: 75, High: 55, Critical: 35 }[f.riskLevel] ?? 70;
    if (existing) {
      existing.count++;
      existing.score = Math.round((existing.score * (existing.count - 1) + riskScore) / existing.count);
    } else {
      map.set(key, { terminal: f.terminal.replace('Terminal ', 'T'), zone: f.zone.split(' ')[0], score: riskScore, count: 1 });
    }
  });
  return [...map.values()].map(({ terminal, zone, score }) => ({ terminal, zone, score }));
}

const STAKEHOLDER_META: Record<string, { type: string; terminal: string; isInternal?: boolean }> = {
  [ORGANIZATION_NAME]: { type: 'Airport Operator', terminal: 'All', isInternal: true },
  'Garuda Indonesia': { type: 'Airline', terminal: 'T3' },
  'Lion Air': { type: 'Airline', terminal: 'T2' },
  'Citilink': { type: 'Airline', terminal: 'T1' },
  'JAS (Jasa Angkasa Semesta)': { type: 'Ground Handling', terminal: 'T3' },
  'Gapura Angkasa': { type: 'Ground Handling', terminal: 'T1' },
  'PT Jasa Prima': { type: 'Ground Handling', terminal: 'T2' },
  'PT ISS Facility Services': { type: 'Cleaning Service', terminal: 'All' },
  'PT Securindo Packatama': { type: 'Security', terminal: 'All' },
  'PT Cardig Aero Services': { type: 'Cargo', terminal: 'T3' },
  'PT Gapura Multi Purpose': { type: 'Commercial', terminal: 'All' },
};

export function computeStakeholderPerformance(
  findings: Finding[],
  capas: CAPA[],
) {
  const names = new Set<string>();
  findings.forEach((f) => f.stakeholder && names.add(f.stakeholder));
  capas.forEach((c) => c.stakeholder && names.add(c.stakeholder));

  if (names.size === 0) {
    return [{
      id: 'internal',
      name: ORGANIZATION_NAME,
      type: 'Airport Operator',
      isInternal: true,
      terminal: 'All',
      slaAchievement: 0,
      openFindings: 0,
      closedFindings: 0,
      openCapa: 0,
      complianceScore: 0,
      rating: 'No Data' as const,
    }];
  }

  return [...names].map((name, i) => {
    const sf = findings.filter((f) => f.stakeholder === name);
    const sc = capas.filter((c) => c.stakeholder === name);
    const openFindings = sf.filter((f) => f.status !== 'Closed').length;
    const closedFindings = sf.filter((f) => f.status === 'Closed').length;
    const openCapa = sc.filter((c) => c.status !== 'Closed').length;
    const total = openFindings + closedFindings;
    const slaAchievement = total > 0 ? Math.round((closedFindings / total) * 1000) / 10 : 0;
    const complianceScore = total > 0 ? Math.min(100, Math.round(slaAchievement * 0.95 + (closedFindings > 0 ? 5 : 0))) : 0;
    const meta = STAKEHOLDER_META[name] || { type: 'Partner', terminal: 'All' };
    const rating = complianceScore >= 90 ? 'Excellent' : complianceScore >= 80 ? 'Good' : total > 0 ? 'Needs Improvement' : 'No Data';

    return {
      id: String(i + 1),
      name,
      type: meta.type,
      isInternal: meta.isInternal,
      terminal: meta.terminal,
      slaAchievement,
      openFindings,
      closedFindings,
      openCapa,
      complianceScore,
      rating,
    };
  });
}