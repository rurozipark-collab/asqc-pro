import type { CustomerExperience } from '@/types';

export const CX_TARGETS = {
  waitingTime: 10,
  queueTime: 15,
  toiletCleanliness: 90,
  signageEffectiveness: 85,
  passengerComfort: 85,
  accessibility: 90,
} as const;

export type CxMetricKey = keyof typeof CX_TARGETS;

export function scoreWaitingMinutes(minutes: number, target: number): number {
  if (minutes <= target) return 100;
  return Math.max(0, Math.round(100 - ((minutes - target) / target) * 100));
}

export function computeCxScore(data: Pick<
  CustomerExperience,
  | 'waitingTime'
  | 'queueTime'
  | 'toiletCleanliness'
  | 'signageEffectiveness'
  | 'passengerComfort'
  | 'accessibility'
>): number {
  const waitScore = scoreWaitingMinutes(data.waitingTime, CX_TARGETS.waitingTime);
  const queueScore = scoreWaitingMinutes(data.queueTime, CX_TARGETS.queueTime);
  const avg =
    (waitScore +
      queueScore +
      data.toiletCleanliness +
      data.signageEffectiveness +
      data.passengerComfort +
      data.accessibility) /
    6;
  return Math.round(avg);
}

export function buildCxRecommendation(
  data: Pick<CustomerExperience, CxMetricKey>,
  locale: 'id' | 'en' = 'id',
): string {
  const gaps: { key: CxMetricKey; label: string; value: number; target: number }[] = [
    { key: 'waitingTime', label: locale === 'id' ? 'Waktu proses' : 'Process time', value: data.waitingTime, target: CX_TARGETS.waitingTime },
    { key: 'queueTime', label: locale === 'id' ? 'Waktu antrian' : 'Queue time', value: data.queueTime, target: CX_TARGETS.queueTime },
    { key: 'toiletCleanliness', label: locale === 'id' ? 'Kebersihan toilet' : 'Toilet cleanliness', value: data.toiletCleanliness, target: CX_TARGETS.toiletCleanliness },
    { key: 'signageEffectiveness', label: locale === 'id' ? 'Efektivitas signage' : 'Signage effectiveness', value: data.signageEffectiveness, target: CX_TARGETS.signageEffectiveness },
    { key: 'passengerComfort', label: locale === 'id' ? 'Kenyamanan penumpang' : 'Passenger comfort', value: data.passengerComfort, target: CX_TARGETS.passengerComfort },
    { key: 'accessibility', label: locale === 'id' ? 'Aksesibilitas' : 'Accessibility', value: data.accessibility, target: CX_TARGETS.accessibility },
  ];

  const below = gaps
    .filter((g) => (g.key === 'waitingTime' || g.key === 'queueTime' ? g.value > g.target : g.value < g.target))
    .sort((a, b) => {
      const aGap = a.key === 'waitingTime' || a.key === 'queueTime' ? a.value / a.target : a.target - a.value;
      const bGap = b.key === 'waitingTime' || b.key === 'queueTime' ? b.value / b.target : b.target - b.value;
      return bGap - aGap;
    })
    .slice(0, 3);

  if (below.length === 0) {
    return locale === 'id'
      ? 'Semua metrik CX memenuhi target. Pertahankan standar layanan dan monitoring berkala.'
      : 'All CX metrics meet targets. Maintain service standards and continue periodic monitoring.';
  }

  const items = below.map((g) => g.label).join(', ');
  return locale === 'id'
    ? `Prioritas perbaikan: ${items}. Fokuskan patroli CX dan koordinasi stakeholder di area terkait.`
    : `Improvement priority: ${items}. Focus CX patrols and stakeholder coordination in related areas.`;
}

export function getCxChartMetrics(record: CustomerExperience, locale: 'id' | 'en') {
  const labels: Record<CxMetricKey, { id: string; en: string }> = {
    waitingTime: { id: 'Waktu Proses', en: 'Process Time' },
    queueTime: { id: 'Waktu Antrian', en: 'Queue Time' },
    toiletCleanliness: { id: 'Kebersihan Toilet', en: 'Toilet Clean.' },
    signageEffectiveness: { id: 'Signage', en: 'Signage' },
    passengerComfort: { id: 'Kenyamanan', en: 'Comfort' },
    accessibility: { id: 'Aksesibilitas', en: 'Accessibility' },
  };

  return (Object.keys(CX_TARGETS) as CxMetricKey[]).map((key) => ({
    name: labels[key][locale],
    value: record[key],
    target: CX_TARGETS[key],
    lowerIsBetter: key === 'waitingTime' || key === 'queueTime',
  }));
}