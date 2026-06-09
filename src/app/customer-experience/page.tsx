'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/dashboard/kpi-card';
import { DeleteButton } from '@/components/ui/delete-button';
import { InfoPanel, FieldHelp } from '@/components/ui/field-help';
import { AreaSelector } from '@/components/forms/area-selector';
import { useAppStore } from '@/lib/store';
import { formatDate, INPUT_CLASS, TABLE_SCROLL_CLASS } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/use-translation';
import {
  buildCxRecommendation,
  computeCxScore,
  CX_TARGETS,
  getCxChartMetrics,
} from '@/lib/data/cx-metrics';
import type { CustomerExperience } from '@/types';
import { Star, ThumbsUp, Heart, Zap, Sparkles, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const defaultForm = () => ({
  date: new Date().toISOString().split('T')[0],
  terminal: '',
  zone: '',
  area: '',
  waitingTime: 10,
  queueTime: 15,
  toiletCleanliness: 85,
  signageEffectiveness: 80,
  passengerComfort: 82,
  accessibility: 88,
  nps: 0,
  csat: 4,
  ces: 3,
});

export default function CustomerExperiencePage() {
  const { customerExperiences, addCustomerExperience, deleteCustomerExperience } = useAppStore();
  const { t, locale } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const latest = customerExperiences[0];
  const previewScore = computeCxScore(form);

  const handleAreaChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const areaLabel = form.area ? `${form.zone} — ${form.area}` : form.zone;
    const record: CustomerExperience = {
      id: Date.now().toString(),
      date: form.date,
      terminal: form.terminal,
      area: areaLabel,
      waitingTime: form.waitingTime,
      queueTime: form.queueTime,
      toiletCleanliness: form.toiletCleanliness,
      signageEffectiveness: form.signageEffectiveness,
      passengerComfort: form.passengerComfort,
      accessibility: form.accessibility,
      nps: form.nps,
      csat: form.csat,
      ces: form.ces,
      cxScore: computeCxScore(form),
      aiRecommendation: buildCxRecommendation(form, locale),
    };
    addCustomerExperience(record);
    setForm(defaultForm());
    setShowForm(false);
  };

  const chartMetrics = latest ? getCxChartMetrics(latest, locale) : [];

  return (
    <DashboardLayout title={t('cx.title')} subtitle={t('cx.subtitle')}>
      <div className="space-y-6">
        <InfoPanel title={t('cx.dataSourceTitle')}>
          <p>{t('cx.dataSourceDesc')}</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>{t('cx.source1')}</li>
            <li>{t('cx.source2')}</li>
            <li>{t('cx.source3')}</li>
            <li>{t('cx.source4')}</li>
          </ul>
          <p className="text-cyan-400/80 mt-2 font-medium">{t('cx.notFromInspection')}</p>
        </InfoPanel>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            {customerExperiences.length > 0
              ? t('cx.recordsCount', { count: String(customerExperiences.length) })
              : t('cx.emptyDesc')}
          </p>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" /> {t('cx.newRecord')}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{t('cx.registerRecord')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('common.date')}</label>
                    <input
                      type="date"
                      className={INPUT_CLASS}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <p className="text-xs text-cyan-400/80">{t('cx.computedScore')}: <strong>{previewScore}%</strong></p>
                  </div>
                </div>

                <AreaSelector
                  terminal={form.terminal}
                  zone={form.zone}
                  area={form.area}
                  subArea=""
                  onChange={handleAreaChange}
                  showSubArea={false}
                />

                <div>
                  <p className="text-xs font-semibold text-amber-400 mb-3">{t('cx.operationalMetrics')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {([
                      ['waitingTime', t('cx.waitingTime'), CX_TARGETS.waitingTime, 30],
                      ['queueTime', t('cx.queueTime'), CX_TARGETS.queueTime, 45],
                      ['toiletCleanliness', t('cx.toiletCleanliness'), CX_TARGETS.toiletCleanliness, 100],
                      ['signageEffectiveness', t('cx.signageEffectiveness'), CX_TARGETS.signageEffectiveness, 100],
                      ['passengerComfort', t('cx.passengerComfort'), CX_TARGETS.passengerComfort, 100],
                      ['accessibility', t('cx.accessibility'), CX_TARGETS.accessibility, 100],
                    ] as const).map(([key, label, target, max]) => (
                      <div key={key}>
                        <label className="block text-xs text-slate-400 mb-1">
                          {label} <span className="text-slate-600">(target: {target})</span>
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={max}
                          className={INPUT_CLASS}
                          value={form[key]}
                          onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-purple-400 mb-3">{t('cx.surveyScores')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FieldHelp label={t('cx.nps')} description={t('cx.npsHint')}>
                      <input
                        type="number"
                        min={-100}
                        max={100}
                        className={INPUT_CLASS + ' mt-2'}
                        value={form.nps}
                        onChange={(e) => setForm({ ...form, nps: Number(e.target.value) })}
                        required
                      />
                    </FieldHelp>
                    <FieldHelp label={t('cx.csat')} description={t('cx.csatHint')}>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        step={0.1}
                        className={INPUT_CLASS + ' mt-2'}
                        value={form.csat}
                        onChange={(e) => setForm({ ...form, csat: Number(e.target.value) })}
                        required
                      />
                    </FieldHelp>
                    <FieldHelp label={t('cx.ces')} description={t('cx.cesHint')}>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        step={0.1}
                        className={INPUT_CLASS + ' mt-2'}
                        value={form.ces}
                        onChange={(e) => setForm({ ...form, ces: Number(e.target.value) })}
                        required
                      />
                    </FieldHelp>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit">{t('cx.submitRecord')}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {!latest ? (
          <Card>
            <CardContent className="p-10 text-center space-y-2">
              <p className="text-slate-300 font-medium">{t('cx.emptyTitle')}</p>
              <p className="text-sm text-slate-500">{t('cx.emptyDesc')}</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" /> {t('cx.newRecord')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPICard title={t('cx.cxScore')} value={`${latest.cxScore}%`} icon={<Star className="h-5 w-5" />} color="cyan" />
              <KPICard title="NPS" value={latest.nps} icon={<ThumbsUp className="h-5 w-5" />} color="emerald" />
              <KPICard title="CSAT" value={`${latest.csat}/5`} icon={<Heart className="h-5 w-5" />} color="purple" />
              <KPICard title="CES" value={`${latest.ces}/5`} icon={<Zap className="h-5 w-5" />} color="amber" />
            </div>

            <Card>
              <CardHeader><CardTitle>{t('cx.metricsVsTarget')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#06b6d4" name="Actual" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#334155" name="Target" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {latest.aiRecommendation && (
              <Card className="border-cyan-500/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-cyan-400">{t('cx.aiRecommendation')}</p>
                      <p className="text-sm text-slate-300 mt-2">{latest.aiRecommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {customerExperiences.length > 0 && (
          <Card>
            <CardHeader><CardTitle>{t('cx.records')}</CardTitle></CardHeader>
            <CardContent className={TABLE_SCROLL_CLASS + ' p-0'}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="text-left py-3 px-4">{t('common.date')}</th>
                    <th className="text-left py-3 px-4">{t('common.terminal')}</th>
                    <th className="text-left py-3 px-4">{t('common.area')}</th>
                    <th className="text-center py-3 px-4">{t('cx.cxScore')}</th>
                    <th className="text-center py-3 px-4">NPS</th>
                    <th className="text-center py-3 px-4">CSAT</th>
                    <th className="text-center py-3 px-4">CES</th>
                    <th className="text-center py-3 px-4">{t('common.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {customerExperiences.map((record) => (
                    <tr key={record.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-3 px-4 text-slate-400">{formatDate(record.date)}</td>
                      <td className="py-3 px-4">{record.terminal}</td>
                      <td className="py-3 px-4">{record.area}</td>
                      <td className="py-3 px-4 text-center text-cyan-400 font-medium">{record.cxScore}%</td>
                      <td className="py-3 px-4 text-center">{record.nps}</td>
                      <td className="py-3 px-4 text-center">{record.csat}/5</td>
                      <td className="py-3 px-4 text-center">{record.ces}/5</td>
                      <td className="py-3 px-4 text-center">
                        <DeleteButton
                          onDelete={() => deleteCustomerExperience(record.id)}
                          confirmMessage={t('delete.cx', { location: `${record.terminal} - ${record.area}` })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}