'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { KPICard } from '@/components/dashboard/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyWorkflowGuide } from '@/components/ui/empty-workflow';
import { InfoPanel } from '@/components/ui/field-help';
import {
  FindingsTrendChart,
  ComplaintTrendChart,
  RiskPieChart,
  HorizontalBarChart,
  CapaProgressChart,
  HeatmapGrid,
} from '@/components/dashboard/charts';
import {
  computeDashboardKPI,
  computeRiskDistribution,
  computeCapaProgress,
  computeTopLocations,
  computeTopComplaintCategories,
  computeHeatmap,
  computeMonthlyTrends,
  computeStakeholderPerformance,
} from '@/lib/data/dashboard-stats';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/use-translation';
import {
  AlertTriangle, CheckCircle, Clock, MessageSquare, Target, Star, Shield, BarChart3, Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TABLE_SCROLL_CLASS } from '@/lib/utils';

function EmptyChart({ message }: { message: string }) {
  return <p className="text-sm text-slate-500 text-center py-12">{message}</p>;
}

export default function ExecutiveDashboard() {
  const { t } = useTranslation();
  const {
    findings, complaints, capas, audits, customerExperiences,
    loadDemoData, clearAllData, pushLocalToCloud, syncStatus,
  } = useAppStore();

  const hasData = findings.length + complaints.length + audits.length + capas.length > 0;
  const kpi = computeDashboardKPI(findings, complaints, capas, audits, customerExperiences);
  const { findingsTrend, complaintTrend } = computeMonthlyTrends(findings, complaints);
  const riskDistribution = computeRiskDistribution(findings);
  const capaProgress = computeCapaProgress(capas);
  const topFindingsLocations = computeTopLocations(findings);
  const topComplaints = computeTopComplaintCategories(complaints);
  const heatmapData = computeHeatmap(findings);
  const stakeholderPerformance = computeStakeholderPerformance(findings, capas);

  const handleLoadDemo = () => {
    loadDemoData();
    alert(t('dashboard.demoLoaded'));
  };

  const handleClear = () => {
    if (confirm(t('dashboard.confirmClear'))) clearAllData();
  };

  const handlePushCloud = async () => {
    await pushLocalToCloud();
    const status = useAppStore.getState().syncStatus;
    alert(status === 'synced' ? t('dashboard.pushToCloudDone') : t('dashboard.pushToCloudFail'));
  };

  return (
    <DashboardLayout title={t('dashboard.title')} subtitle={t('dashboard.subtitle')}>
      <div className="space-y-6">
        <EmptyWorkflowGuide />

        <InfoPanel title={t('dashboard.supabaseTitle')}>
          <p>{t('dashboard.supabaseDesc')}</p>
          <p className="text-slate-500 mt-2">{t('dashboard.supabaseSetup')}</p>
        </InfoPanel>

        <div className="flex flex-wrap gap-2 justify-end">
          {(syncStatus === 'synced' || syncStatus === 'error') && hasData && (
            <Button variant="secondary" size="sm" onClick={handlePushCloud}>{t('dashboard.pushToCloud')}</Button>
          )}
          <Button variant="outline" size="sm" onClick={handleLoadDemo}>{t('dashboard.loadDemo')}</Button>
          {hasData && (
            <Button variant="danger" size="sm" onClick={handleClear}>{t('dashboard.clearData')}</Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <KPICard title={t('dashboard.totalFindings')} value={kpi.totalFindings} icon={<AlertTriangle className="h-5 w-5" />} color="cyan" />
          <KPICard title={t('dashboard.openFindings')} value={kpi.openFindings} icon={<Clock className="h-5 w-5" />} color="amber" />
          <KPICard title={t('dashboard.closedFindings')} value={kpi.closedFindings} icon={<CheckCircle className="h-5 w-5" />} color="emerald" />
          <KPICard title={t('dashboard.overdueFindings')} value={kpi.overdueFindings} icon={<AlertTriangle className="h-5 w-5" />} color="red" />
          <KPICard title={t('dashboard.openComplaints')} value={kpi.openComplaints} icon={<MessageSquare className="h-5 w-5" />} color="purple" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <KPICard title={t('dashboard.slaAchievement')} value={hasData ? `${kpi.slaAchievement}%` : '—'} icon={<Target className="h-5 w-5" />} color="emerald" />
          <KPICard title={t('dashboard.customerSatisfaction')} value={kpi.customerSatisfactionIndex ? `${kpi.customerSatisfactionIndex}%` : '—'} icon={<Star className="h-5 w-5" />} color="cyan" />
          <KPICard title={t('dashboard.serviceQualityIndex')} value={kpi.serviceQualityIndex ? `${kpi.serviceQualityIndex}%` : '—'} icon={<BarChart3 className="h-5 w-5" />} color="blue" />
          <KPICard title={t('dashboard.auditCompliance')} value={kpi.auditComplianceScore ? `${kpi.auditComplianceScore}%` : '—'} icon={<Shield className="h-5 w-5" />} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>{t('dashboard.findingsTrend')}</CardTitle></CardHeader>
            <CardContent>
              {findingsTrend.length > 0 ? <FindingsTrendChart data={findingsTrend} /> : <EmptyChart message={t('dashboard.emptyCharts')} />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('dashboard.complaintTrend')}</CardTitle></CardHeader>
            <CardContent>
              {complaintTrend.length > 0 ? <ComplaintTrendChart data={complaintTrend} /> : <EmptyChart message={t('dashboard.emptyCharts')} />}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>{t('dashboard.topFindingsLocation')}</CardTitle></CardHeader>
            <CardContent>
              {topFindingsLocations.length > 0 ? (
                <HorizontalBarChart data={topFindingsLocations} dataKey="count" nameKey="location" />
              ) : (
                <EmptyChart message={t('dashboard.emptyCharts')} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('dashboard.topComplaints')}</CardTitle></CardHeader>
            <CardContent>
              {topComplaints.length > 0 ? (
                <HorizontalBarChart data={topComplaints} dataKey="count" nameKey="category" />
              ) : (
                <EmptyChart message={t('dashboard.emptyCharts')} />
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>{t('dashboard.heatmap')}</CardTitle></CardHeader>
          <CardContent>
            {heatmapData.length > 0 ? <HeatmapGrid data={heatmapData} /> : <EmptyChart message={t('dashboard.emptyCharts')} />}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>{t('dashboard.riskDistribution')}</CardTitle></CardHeader>
            <CardContent>
              {riskDistribution.length > 0 ? <RiskPieChart data={riskDistribution} /> : <EmptyChart message={t('dashboard.emptyCharts')} />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('dashboard.capaProgress')}</CardTitle></CardHeader>
            <CardContent>
              {capaProgress.length > 0 ? <CapaProgressChart data={capaProgress} /> : <EmptyChart message={t('dashboard.emptyCharts')} />}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              {t('dashboard.stakeholderPerformance')}
            </CardTitle>
          </CardHeader>
          <CardContent className={TABLE_SCROLL_CLASS}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="text-left py-3 px-4">{t('common.stakeholder')}</th>
                  <th className="text-left py-3 px-4">{t('common.type')}</th>
                  <th className="text-center py-3 px-4">SLA %</th>
                  <th className="text-center py-3 px-4">{t('common.open')}</th>
                  <th className="text-center py-3 px-4">{t('common.closed')}</th>
                  <th className="text-center py-3 px-4">CAPA</th>
                  <th className="text-center py-3 px-4">{t('stakeholders.compliance')}</th>
                  <th className="text-center py-3 px-4">{t('stakeholders.rating')}</th>
                </tr>
              </thead>
              <tbody>
                {stakeholderPerformance.map((s) => (
                  <tr key={s.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {s.name}
                      {s.isInternal && (
                        <Badge className="ml-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">{t('stakeholders.internalBadge')}</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{s.type}</td>
                    <td className="py-3 px-4 text-center text-cyan-400 font-medium">{s.slaAchievement}%</td>
                    <td className="py-3 px-4 text-center text-amber-400">{s.openFindings}</td>
                    <td className="py-3 px-4 text-center text-emerald-400">{s.closedFindings}</td>
                    <td className="py-3 px-4 text-center">{s.openCapa}</td>
                    <td className="py-3 px-4 text-center">{s.complianceScore}%</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={
                        s.rating === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        s.rating === 'Good' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                        'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }>{s.rating}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}