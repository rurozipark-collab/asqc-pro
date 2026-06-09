export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type FindingStatus = 'Open' | 'In Progress' | 'Verification' | 'Closed' | 'Overdue';
export type CapaStatus = 'Open' | 'Assigned' | 'In Progress' | 'Verification' | 'Closed';
export type ComplaintChannel = 'Walk-in' | 'Email' | 'Phone' | 'Social Media' | 'Website' | 'WhatsApp';
export type CustomerType = 'Passenger' | 'Airline' | 'Tenant' | 'Visitor' | 'Staff';
export type AuditType = 'PM' | 'KP' | 'ICAO' | 'IATA' | 'SOP' | 'SLA' | 'SLG' | 'Service Standard';
export type DocumentType = 'SOP' | 'SLA' | 'SLG' | 'Service Standard' | 'Audit Report' | 'QC Report' | 'CX Report';
export type ReportType = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Audit' | 'Complaint' | 'CAPA' | 'CX' | 'GM' | 'Board';
export type UserRole =
  | 'QC Staff'
  | 'Supervisor'
  | 'Manager'
  | 'CX Team'
  | 'General Manager'
  | 'Stakeholder'
  | 'Airline Rep'
  | 'Ground Handling Rep'
  | 'Cleaning Rep'
  | 'Security Rep';

export interface AreaHierarchy {
  airport: string;
  terminal: string;
  zone: string;
  area: string;
  subArea: string;
  asset?: string;
}

export interface Finding {
  id: string;
  findingNumber: string;
  createdAt?: string;
  date: string;
  time: string;
  airport: string;
  terminal: string;
  zone: string;
  area: string;
  subArea: string;
  asset: string;
  category: string;
  riskLevel: RiskLevel;
  priority: Priority;
  serviceImpact: string;
  description: string;
  photoEvidence: string[];
  videoEvidence: string[];
  gpsLocation?: { lat: number; lng: number };
  pic: string;
  stakeholder: string;
  dueDate: string;
  status: FindingStatus;
  aiAnalysis?: string;
  aiRecommendation?: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  createdAt?: string;
  date: string;
  channel: ComplaintChannel;
  customerType: CustomerType;
  category: string;
  terminal: string;
  zone: string;
  area: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  aiAnalysis?: string;
  customerImpact?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
}

export interface RCA {
  id: string;
  referenceId: string;
  referenceIds: string[];
  customReference?: string;
  referenceType: 'Finding' | 'Complaint' | 'Audit';
  title: string;
  fiveWhy: string[];
  fishbone: Record<string, string[]>;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  recommendation: string;
  createdAt: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Closed';
}

export interface CAPA {
  id: string;
  capaNumber: string;
  createdAt?: string;
  title: string;
  sourceType: 'Finding' | 'Complaint' | 'RCA' | 'Audit';
  sourceId: string;
  assignedTo: string;
  stakeholder: string;
  dueDate: string;
  status: CapaStatus;
  progress: number;
  description: string;
  correctiveAction: string;
  preventiveAction: string;
  verificationNotes?: string;
  isOverdue: boolean;
  escalated: boolean;
}

export interface Audit {
  id: string;
  auditNumber: string;
  createdAt?: string;
  auditType: AuditType;
  date: string;
  terminal: string;
  zone: string;
  area: string;
  auditor: string;
  score: number;
  nonConformance: number;
  observation: number;
  opportunityForImprovement: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Closed';
  findings: string[];
  linkedFindingIds: string[];
  notes?: string;
}

export interface CustomerExperience {
  id: string;
  createdAt?: string;
  date: string;
  terminal: string;
  area: string;
  waitingTime: number;
  queueTime: number;
  toiletCleanliness: number;
  signageEffectiveness: number;
  passengerComfort: number;
  accessibility: number;
  cxScore: number;
  nps: number;
  csat: number;
  ces: number;
  aiRecommendation?: string;
}

export interface Document {
  id: string;
  createdAt?: string;
  title: string;
  type: DocumentType;
  version: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Expired';
  uploadedBy: string;
  approvedBy?: string;
  effectiveDate: string;
  reviewDate: string;
  expiryDate: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface StakeholderPerformance {
  id: string;
  name: string;
  type: string;
  isInternal?: boolean;
  terminal: string;
  slaAchievement: number;
  openFindings: number;
  closedFindings: number;
  openCapa: number;
  complianceScore: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'No Data' | 'Needs Improvement';
}

export interface DashboardKPI {
  totalFindings: number;
  openFindings: number;
  closedFindings: number;
  overdueFindings: number;
  openComplaints: number;
  closedComplaints: number;
  slaAchievement: number;
  customerSatisfactionIndex: number;
  serviceQualityIndex: number;
  auditComplianceScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}