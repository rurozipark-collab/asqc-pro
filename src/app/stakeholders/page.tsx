'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoPanel } from '@/components/ui/field-help';
import { EmptyWorkflowGuide } from '@/components/ui/empty-workflow';
import { computeStakeholderPerformance } from '@/lib/data/dashboard-stats';
import { useAppStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Users, Building2 } from 'lucide-react';

export default function StakeholdersPage() {
  const { t } = useTranslation();
  const { findings, capas } = useAppStore();
  const stakeholderPerformance = computeStakeholderPerformance(findings, capas);
  const hasData = findings.length > 0 || capas.length > 0;

  const chartData = stakeholderPerformance.map((s) => ({
    name: s.isInternal ? t('stakeholders.internalShort') : s.name.split(' ').slice(0, 2).join(' '),
    sla: s.slaAchievement,
    compliance: s.complianceScore,
  }));

  return (
    <DashboardLayout title={t('stakeholders.title')} subtitle={t('stakeholders.subtitle')}>
      <div className="space-y-6">
        <InfoPanel title={t('stakeholders.dataSourceTitle')}>
          <p>{t('stakeholders.dataSourceDesc')}</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>{t('stakeholders.source1')}</li>
            <li>{t('stakeholders.source2')}</li>
            <li>{t('stakeholders.source3')}</li>
            <li>{t('stakeholders.source4')}</li>
          </ul>
        </InfoPanel>

        {!hasData && <EmptyWorkflowGuide />}

        <Card>
          <CardHeader><CardTitle>{t('stakeholders.slaOverview')}</CardTitle></CardHeader>
          <CardContent>
            {hasData ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Bar dataKey="sla" fill="#06b6d4" name="SLA %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="compliance" fill="#8b5cf6" name={t('stakeholders.compliance') + ' %'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500 text-center py-12">{t('dashboard.emptyCharts')}</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stakeholderPerformance.map((s) => (
            <Card key={s.id} className={s.isInternal ? 'border-cyan-500/40 ring-1 ring-cyan-500/20' : ''}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`rounded-full p-2 ${s.isInternal ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}>
                    {s.isInternal ? <Building2 className="h-4 w-4 text-white" /> : <Users className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-slate-200 text-sm">{s.name}</h4>
                      {s.isInternal && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">
                          {t('stakeholders.internalBadge')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{s.type} — {s.terminal}</p>
                    {s.isInternal && (
                      <p className="text-[10px] text-cyan-400/70 mt-0.5">{t('stakeholders.internalNote')}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-2xl font-bold text-cyan-400">{s.slaAchievement}%</p>
                    <p className="text-[10px] text-slate-500">{t('stakeholders.slaAchievement')}</p>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-2xl font-bold text-purple-400">{s.complianceScore}%</p>
                    <p className="text-[10px] text-slate-500">{t('stakeholders.compliance')}</p>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-lg font-bold text-amber-400">{s.openFindings}</p>
                    <p className="text-[10px] text-slate-500">{t('common.open')}</p>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-lg font-bold text-emerald-400">{s.closedFindings}</p>
                    <p className="text-[10px] text-slate-500">{t('common.closed')}</p>
                  </div>
                </div>
                <Badge className={`mt-3 w-full justify-center ${
                  s.rating === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400' :
                  s.rating === 'Good' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'
                }`}>{s.rating}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}