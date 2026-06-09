import { generateReferenceCode } from '@/lib/utils';
import { computeCxScore, buildCxRecommendation } from '@/lib/data/cx-metrics';
import { AIRPORT_CODE } from '@/lib/data/master-areas';
import type { Finding, Complaint, CustomerExperience, RiskLevel, Priority } from '@/types';

export type GoogleFormType = 'finding' | 'complaint' | 'cx';

export interface GoogleFormPayload {
  secret: string;
  type: GoogleFormType;
  description?: string;
  terminal?: string;
  zone?: string;
  area?: string;
  subArea?: string;
  category?: string;
  pic?: string;
  stakeholder?: string;
  channel?: string;
  customerType?: string;
  waitingTime?: number;
  queueTime?: number;
  toiletCleanliness?: number;
  signageEffectiveness?: number;
  passengerComfort?: number;
  accessibility?: number;
  nps?: number;
  csat?: number;
  ces?: number;
  submittedAt?: string;
}

export function mapToFinding(payload: GoogleFormPayload, existingNumbers: string[]): Finding {
  const now = new Date();
  const date = payload.submittedAt?.split('T')[0] ?? now.toISOString().split('T')[0];

  return {
    id: `gf-${Date.now()}`,
    findingNumber: generateReferenceCode('FND', existingNumbers),
    date,
    time: now.toTimeString().slice(0, 5),
    airport: AIRPORT_CODE,
    terminal: payload.terminal || 'Terminal 3',
    zone: payload.zone || '—',
    area: payload.area || '—',
    subArea: payload.subArea || '',
    asset: '',
    category: payload.category || 'Service Quality',
    riskLevel: 'Medium' as RiskLevel,
    priority: 'Medium' as Priority,
    serviceImpact: 'Diterima via Google Form',
    description: payload.description || 'Temuan dari Google Form',
    photoEvidence: [],
    videoEvidence: [],
    pic: payload.pic || 'Google Form',
    stakeholder: payload.stakeholder || '—',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Open',
    aiAnalysis: 'Data masuk otomatis dari Google Form',
    aiRecommendation: 'Review dan tindaklanjuti sesuai prosedur inspeksi',
  };
}

export function mapToComplaint(payload: GoogleFormPayload, existingNumbers: string[]): Complaint {
  const date = payload.submittedAt?.split('T')[0] ?? new Date().toISOString().split('T')[0];

  return {
    id: `gf-${Date.now()}`,
    complaintNumber: generateReferenceCode('CMP', existingNumbers),
    date,
    channel: (payload.channel as Complaint['channel']) || 'Website',
    customerType: (payload.customerType as Complaint['customerType']) || 'Passenger',
    category: payload.category || 'General',
    terminal: payload.terminal || 'Terminal 3',
    zone: payload.zone || '—',
    area: payload.area || '—',
    description: payload.description || 'Keluhan dari Google Form',
    status: 'Open',
    aiAnalysis: 'Data masuk otomatis dari Google Form',
  };
}

export function mapToCX(payload: GoogleFormPayload): CustomerExperience {
  const date = payload.submittedAt?.split('T')[0] ?? new Date().toISOString().split('T')[0];
  const metrics = {
    waitingTime: Number(payload.waitingTime) || 10,
    queueTime: Number(payload.queueTime) || 15,
    toiletCleanliness: Number(payload.toiletCleanliness) || 85,
    signageEffectiveness: Number(payload.signageEffectiveness) || 80,
    passengerComfort: Number(payload.passengerComfort) || 82,
    accessibility: Number(payload.accessibility) || 88,
  };

  return {
    id: `gf-${Date.now()}`,
    date,
    terminal: payload.terminal || 'Terminal 3',
    area: payload.area || payload.zone || '—',
    ...metrics,
    nps: Number(payload.nps) || 0,
    csat: Number(payload.csat) || 4,
    ces: Number(payload.ces) || 3,
    cxScore: computeCxScore(metrics),
    aiRecommendation: buildCxRecommendation(metrics, 'id'),
  };
}