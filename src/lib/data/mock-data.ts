import type {
  Finding,
  Complaint,
  RCA,
  CAPA,
  Audit,
  CustomerExperience,
  Document,
  StakeholderPerformance,
  DashboardKPI,
} from '@/types';

export const dashboardKPI: DashboardKPI = {
  totalFindings: 1247,
  openFindings: 186,
  closedFindings: 1024,
  overdueFindings: 37,
  openComplaints: 89,
  closedComplaints: 456,
  slaAchievement: 94.2,
  customerSatisfactionIndex: 87.5,
  serviceQualityIndex: 91.3,
  auditComplianceScore: 88.7,
};

export const monthlyFindingsTrend = [
  { month: 'Jan', findings: 98, closed: 82 },
  { month: 'Feb', findings: 112, closed: 95 },
  { month: 'Mar', findings: 87, closed: 78 },
  { month: 'Apr', findings: 134, closed: 118 },
  { month: 'May', findings: 156, closed: 142 },
  { month: 'Jun', findings: 121, closed: 108 },
];

export const monthlyComplaintTrend = [
  { month: 'Jan', complaints: 45, resolved: 38 },
  { month: 'Feb', complaints: 52, resolved: 44 },
  { month: 'Mar', complaints: 38, resolved: 35 },
  { month: 'Apr', complaints: 61, resolved: 52 },
  { month: 'May', complaints: 48, resolved: 42 },
  { month: 'Jun', complaints: 55, resolved: 48 },
];

export const topFindingsLocations = [
  { location: 'T3 - Check-in Area', count: 45 },
  { location: 'T3 - Security Check Point', count: 38 },
  { location: 'T1A - Curbside Departure', count: 32 },
  { location: 'T3 - Baggage Claim', count: 28 },
  { location: 'T2D - Toilet Facility', count: 25 },
  { location: 'T3 - Immigration Arrival', count: 22 },
  { location: 'T1B - Boarding Lounge', count: 19 },
  { location: 'T3 - Food & Beverage', count: 17 },
  { location: 'T2E - Parking Area', count: 15 },
  { location: 'T3 - Transit Lounge', count: 12 },
];

export const topComplaints = [
  { category: 'Long Queue Time', count: 67 },
  { category: 'Toilet Cleanliness', count: 54 },
  { category: 'Baggage Delay', count: 48 },
  { category: 'Poor Signage', count: 42 },
  { category: 'Staff Attitude', count: 38 },
  { category: 'AC Temperature', count: 35 },
  { category: 'WiFi Connectivity', count: 28 },
  { category: 'Lost & Found', count: 24 },
  { category: 'Accessibility Issues', count: 21 },
  { category: 'Food Quality', count: 18 },
];

export const riskDistribution = [
  { name: 'Low', value: 45, color: '#10b981' },
  { name: 'Medium', value: 32, color: '#f59e0b' },
  { name: 'High', value: 18, color: '#f97316' },
  { name: 'Critical', value: 5, color: '#ef4444' },
];

export const rootCauseDistribution = [
  { name: 'Man', value: 28 },
  { name: 'Machine', value: 15 },
  { name: 'Method', value: 32 },
  { name: 'Material', value: 8 },
  { name: 'Environment', value: 12 },
  { name: 'Management', value: 5 },
];

export const capaProgress = [
  { status: 'Open', count: 24 },
  { status: 'Assigned', count: 18 },
  { status: 'In Progress', count: 45 },
  { status: 'Verification', count: 12 },
  { status: 'Closed', count: 156 },
];

export const stakeholderPerformance: StakeholderPerformance[] = [
  { id: '1', name: 'PT Angkasa Pura Indonesia (Persero)', type: 'Airport Operator', isInternal: true, terminal: 'All', slaAchievement: 96.5, openFindings: 12, closedFindings: 245, openCapa: 3, complianceScore: 94, rating: 'Excellent' },
  { id: '2', name: 'JAS (Jasa Angkasa Semesta)', type: 'Ground Handling', terminal: 'T3', slaAchievement: 91.2, openFindings: 28, closedFindings: 156, openCapa: 8, complianceScore: 88, rating: 'Good' },
  { id: '3', name: 'PT ISS Facility Services', type: 'Cleaning Service', terminal: 'All', slaAchievement: 87.8, openFindings: 35, closedFindings: 198, openCapa: 12, complianceScore: 82, rating: 'Good' },
  { id: '4', name: 'PT Securindo Packatama', type: 'Security', terminal: 'All', slaAchievement: 93.4, openFindings: 8, closedFindings: 112, openCapa: 2, complianceScore: 91, rating: 'Excellent' },
  { id: '5', name: 'Gapura Angkasa', type: 'Ground Handling', terminal: 'T1', slaAchievement: 89.1, openFindings: 22, closedFindings: 134, openCapa: 6, complianceScore: 85, rating: 'Good' },
  { id: '6', name: 'Garuda Indonesia', type: 'Airline', terminal: 'T3', slaAchievement: 94.7, openFindings: 15, closedFindings: 89, openCapa: 4, complianceScore: 92, rating: 'Excellent' },
];

export const mockFindings: Finding[] = [
  {
    id: '1', findingNumber: 'FND-05jun2026', date: '2026-06-05', time: '09:30',
    airport: 'CGK', terminal: 'Terminal 3', zone: 'Domestic Departure', area: 'Check-in Area', subArea: 'Check-in Counter', asset: 'Counter D12',
    category: 'Queue Management', riskLevel: 'High', priority: 'Urgent', serviceImpact: 'Passenger wait time exceeds 15 minutes during peak hours',
    description: 'Long queue at check-in counter D12 with insufficient staff allocation during morning peak',
    photoEvidence: [], videoEvidence: [], pic: 'Ahmad Rizki', stakeholder: 'Garuda Indonesia', dueDate: '2026-06-10', status: 'Open',
    aiAnalysis: 'High passenger volume combined with understaffing during peak hours causing SLA breach',
    aiRecommendation: 'Deploy additional staff during 06:00-10:00 peak window and implement queue management system',
  },
  {
    id: '2', findingNumber: 'FND-04jun2026', date: '2026-06-04', time: '14:15',
    airport: 'CGK', terminal: 'Terminal 3', zone: 'Passenger Facilities', area: 'Toilet Facility', subArea: 'Male', asset: 'Toilet T3-D-01',
    category: 'Cleanliness', riskLevel: 'Medium', priority: 'High', serviceImpact: 'Negative impact on passenger comfort and hygiene standards',
    description: 'Toilet facility lacks adequate cleaning with visible stains and empty soap dispensers',
    photoEvidence: [], videoEvidence: [], pic: 'Siti Nurhaliza', stakeholder: 'PT ISS Facility Services', dueDate: '2026-06-07', status: 'In Progress',
    aiAnalysis: 'Cleaning frequency below SLA requirement of 30-minute intervals during peak hours',
    aiRecommendation: 'Increase cleaning frequency and install automated monitoring for supply levels',
  },
  {
    id: '3', findingNumber: 'FND-03jun2026', date: '2026-06-03', time: '11:00',
    airport: 'CGK', terminal: 'Terminal 1A', zone: 'Airport Access & Landside', area: 'Curbside Departure', subArea: 'Drop Off Zone', asset: 'Zone A1',
    category: 'Wayfinding', riskLevel: 'Low', priority: 'Medium', serviceImpact: 'Passenger confusion at drop-off area',
    description: 'Damaged and faded directional signage at curbside departure area',
    photoEvidence: [], videoEvidence: [], pic: 'Budi Santoso', stakeholder: 'PT Angkasa Pura Indonesia (Persero)', dueDate: '2026-06-15', status: 'Open',
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: '1', complaintNumber: 'CMP-06jun2026', date: '2026-06-06', channel: 'Social Media', customerType: 'Passenger',
    category: 'Long Queue Time', terminal: 'Terminal 3', zone: 'Domestic Departure', area: 'Security Check Point',
    description: 'Waited 45 minutes at security checkpoint during morning rush hour',
    status: 'Open', aiAnalysis: 'Peak hour capacity insufficient for current passenger volume',
    customerImpact: 'High - missed flight risk, significant passenger frustration',
    rootCause: 'Insufficient screening lanes open during peak hours',
    correctiveAction: 'Open additional screening lanes during 05:00-10:00',
    preventiveAction: 'Implement dynamic lane allocation based on real-time passenger flow data',
  },
  {
    id: '2', complaintNumber: 'CMP-05jun2026', date: '2026-06-05', channel: 'Email', customerType: 'Passenger',
    category: 'Baggage Delay', terminal: 'Terminal 3', zone: 'Domestic Arrival', area: 'Domestic Baggage Claim',
    description: 'Baggage delayed for over 2 hours on carousel 3',
    status: 'In Progress', customerImpact: 'Medium - inconvenience and time loss',
  },
];

export const mockRCAs: RCA[] = [
  {
    id: '1', referenceId: 'FND-05jun2026', referenceIds: ['FND-05jun2026'], referenceType: 'Finding', title: 'RCA - Queue at Check-in Counter D12',
    fiveWhy: [
      'Why 1: Long queue at check-in counter → Insufficient counters open',
      'Why 2: Insufficient counters open → Staff shortage during peak',
      'Why 3: Staff shortage during peak → No dynamic staffing plan',
      'Why 4: No dynamic staffing plan → Lack of passenger flow forecasting',
      'Why 5: Lack of passenger flow forecasting → No integrated data analytics system',
    ],
    fishbone: {
      Man: ['Insufficient staff during peak', 'Lack of cross-training'],
      Machine: ['Limited self-check-in kiosks', 'Outdated queue management system'],
      Method: ['No dynamic staffing SOP', 'Manual queue management'],
      Material: ['N/A'],
      Environment: ['Peak hour passenger surge', 'Holiday season volume'],
      Management: ['No passenger flow forecasting', 'Delayed resource allocation decisions'],
    },
    rootCause: 'Absence of integrated passenger flow analytics leading to reactive rather than proactive staffing',
    correctiveAction: 'Deploy additional staff immediately during peak hours',
    preventiveAction: 'Implement AI-based passenger flow prediction and dynamic staffing allocation',
    recommendation: 'Integrate FIDS data with staffing management system for predictive allocation',
    createdAt: '2026-06-05', status: 'Approved',
  },
];

export const mockCAPAs: CAPA[] = [
  {
    id: '1', capaNumber: 'CAPA-05jun2026', title: 'Queue Management Improvement - T3 Check-in',
    sourceType: 'Finding', sourceId: 'FND-05jun2026', assignedTo: 'Operations Manager T3', stakeholder: 'Garuda Indonesia',
    dueDate: '2026-06-20', status: 'In Progress', progress: 65,
    description: 'Implement queue management improvements at T3 check-in area',
    correctiveAction: 'Deploy 3 additional staff during peak hours', preventiveAction: 'Install queue monitoring sensors and digital display',
    isOverdue: false, escalated: false,
  },
  {
    id: '2', capaNumber: 'CAPA-04jun2026', title: 'Toilet Cleaning Frequency Enhancement',
    sourceType: 'Finding', sourceId: 'FND-04jun2026', assignedTo: 'Facility Manager', stakeholder: 'PT ISS Facility Services',
    dueDate: '2026-06-08', status: 'Verification', progress: 90,
    description: 'Increase toilet cleaning frequency to meet SLA requirements',
    correctiveAction: 'Immediate deep cleaning of all T3 toilets', preventiveAction: 'Implement 30-minute cleaning schedule with digital checklist',
    isOverdue: false, escalated: false,
  },
  {
    id: '3', capaNumber: 'CAPA-06jun2026', title: 'Security Lane Optimization',
    sourceType: 'Complaint', sourceId: 'CMP-06jun2026', assignedTo: 'Security Supervisor', stakeholder: 'PT Securindo Packatama',
    dueDate: '2026-06-01', status: 'In Progress', progress: 40,
    description: 'Optimize security screening lane allocation during peak hours',
    correctiveAction: 'Open 2 additional lanes during morning peak', preventiveAction: 'Deploy passenger flow monitoring system',
    isOverdue: true, escalated: true,
  },
];

export const mockAudits: Audit[] = [
  {
    id: '1', auditNumber: 'AUD-01jun2026', auditType: 'SLA', date: '2026-06-01', terminal: 'Terminal 3',
    zone: 'Domestic Departure', area: 'Check-in Area', auditor: 'Quality Team', score: 88, nonConformance: 3, observation: 5, opportunityForImprovement: 2,
    status: 'Completed', findings: ['Queue time exceeds SLA', 'Signage not updated', 'Staff uniform non-compliance'], linkedFindingIds: ['1'],
  },
  {
    id: '2', auditNumber: 'AUD-28may2026', auditType: 'ICAO', date: '2026-05-28', terminal: 'Terminal 3',
    zone: 'International Departure', area: 'Security Check Point International', auditor: 'External Auditor', score: 92, nonConformance: 1, observation: 3, opportunityForImprovement: 1,
    status: 'Completed', findings: ['Minor documentation gap'], linkedFindingIds: [],
  },
];

export const mockCX: CustomerExperience[] = [
  {
    id: '1', date: '2026-06-06', terminal: 'Terminal 3', area: 'Domestic Departure',
    waitingTime: 12, queueTime: 18, toiletCleanliness: 85, signageEffectiveness: 78, passengerComfort: 82, accessibility: 90,
    cxScore: 83, nps: 42, csat: 4.2, ces: 3.8,
    aiRecommendation: 'Focus on reducing queue times at security checkpoint and improve signage clarity in transit areas',
  },
];

export const mockDocuments: Document[] = [
  {
    id: '1', title: 'SOP Service Quality Inspection', type: 'SOP', version: '3.2', status: 'Approved',
    uploadedBy: 'Quality Manager', approvedBy: 'General Manager', effectiveDate: '2026-01-01', reviewDate: '2026-07-01', expiryDate: '2027-01-01',
  },
  {
    id: '2', title: 'SLA Ground Handling Services', type: 'SLA', version: '2.1', status: 'Approved',
    uploadedBy: 'Contract Manager', approvedBy: 'General Manager', effectiveDate: '2025-07-01', reviewDate: '2026-06-15', expiryDate: '2026-07-01',
  },
  {
    id: '3', title: 'Service Standard - Toilet Facility', type: 'Service Standard', version: '1.5', status: 'Under Review',
    uploadedBy: 'Facility Manager', effectiveDate: '2026-03-01', reviewDate: '2026-06-10', expiryDate: '2027-03-01',
  },
];

export const heatmapData = [
  { terminal: 'T1A', zone: 'Departure', score: 85 },
  { terminal: 'T1B', zone: 'Departure', score: 82 },
  { terminal: 'T1C', zone: 'Arrival', score: 88 },
  { terminal: 'T2D', zone: 'Departure', score: 79 },
  { terminal: 'T2E', zone: 'Arrival', score: 84 },
  { terminal: 'T2F', zone: 'Facilities', score: 76 },
  { terminal: 'T3', zone: 'Domestic Dep', score: 91 },
  { terminal: 'T3', zone: 'Intl Dep', score: 89 },
  { terminal: 'T3', zone: 'Domestic Arr', score: 87 },
  { terminal: 'T3', zone: 'Intl Arr', score: 85 },
  { terminal: 'T3', zone: 'Transit', score: 83 },
  { terminal: 'T3', zone: 'Cargo', score: 92 },
];