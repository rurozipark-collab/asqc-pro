import type { AuditType } from '@/types';
import type { Locale } from '@/lib/i18n/translations';

export const AUDIT_TYPE_INFO: Record<AuditType, { id: string; en: string; abbr: string }> = {
  PM: { id: 'Peraturan Menteri', en: 'Ministerial Regulation', abbr: 'PM' },
  KP: { id: 'Keputusan Presiden', en: 'Presidential Regulation', abbr: 'KP' },
  ICAO: { id: 'Standar ICAO (Organisasi Penerbangan Sipil Internasional)', en: 'ICAO Standard', abbr: 'ICAO' },
  IATA: { id: 'Standar IATA (Asosiasi Transportasi Udara Internasional)', en: 'IATA Standard', abbr: 'IATA' },
  SOP: { id: 'Standar Operasional Prosedur (SOP)', en: 'Standard Operating Procedure (SOP)', abbr: 'SOP' },
  SLA: { id: 'Perjanjian Tingkat Layanan (SLA)', en: 'Service Level Agreement (SLA)', abbr: 'SLA' },
  SLG: { id: 'Standar Layanan Ground Handling (SLG)', en: 'Ground Handling Service Level (SLG)', abbr: 'SLG' },
  'Service Standard': { id: 'Standar Pelayanan', en: 'Service Standard', abbr: 'SS' },
};

export function getAuditTypeLabel(type: AuditType, locale: Locale): string {
  const info = AUDIT_TYPE_INFO[type];
  return locale === 'id' ? info.id : info.en;
}

export const AUDIT_SCORE_GUIDE = {
  id: [
    { field: 'Skor Audit', desc: 'Persentase kepatuhan terhadap standar yang diaudit. ≥90% = Baik, 80–89% = Perlu perhatian, <80% = Kritis.' },
    { field: 'Ketidaksesuaian (NC)', desc: 'Temuan yang melanggar standar wajib/regulasi. Harus ditindaklanjuti dengan CAPA.' },
    { field: 'Observasi (OBS)', desc: 'Catatan perbaikan yang disarankan, belum melanggar regulasi tetapi perlu diperhatikan.' },
    { field: 'Peluang Perbaikan (OFI)', desc: 'Saran peningkatan layanan di luar temuan wajib — untuk continuous improvement.' },
    { field: 'Status', desc: 'Terjadwal → Dalam Proses → Selesai → Tertutup. Lacak progres audit di setiap tahap.' },
  ],
  en: [
    { field: 'Audit Score', desc: 'Compliance percentage against audited standards. ≥90% = Good, 80–89% = Attention, <80% = Critical.' },
    { field: 'Non-Conformance (NC)', desc: 'Findings that violate mandatory standards/regulations. Must be followed up with CAPA.' },
    { field: 'Observation (OBS)', desc: 'Recommended improvements, not yet a violation but needs attention.' },
    { field: 'Opportunity for Improvement (OFI)', desc: 'Service enhancement suggestions beyond mandatory findings.' },
    { field: 'Status', desc: 'Scheduled → In Progress → Completed → Closed. Track audit progress at each stage.' },
  ],
};