'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { formatDate, getStatusColor } from '@/lib/utils';
import { DeleteButton } from '@/components/ui/delete-button';
import { useTranslation } from '@/lib/i18n/use-translation';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const workflowSteps = ['Open', 'Assigned', 'In Progress', 'Verification', 'Closed'];

export default function CAPAPage() {
  const { capas, updateCAPA, deleteCAPA } = useAppStore();
  const { t } = useTranslation();

  const advanceStatus = (id: string, currentStatus: string) => {
    const idx = workflowSteps.indexOf(currentStatus);
    if (idx < workflowSteps.length - 1) {
      updateCAPA(id, { status: workflowSteps[idx + 1] as typeof capas[0]['status'], progress: Math.min(100, ((idx + 2) / workflowSteps.length) * 100) });
    }
  };

  return (
    <DashboardLayout title={t('capa.title')} subtitle={t('capa.subtitle')}>
      <div className="space-y-6">
        <div className="flex gap-3 flex-wrap">
          {workflowSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <Badge className={getStatusColor(step)}>{step}: {capas.filter(c => c.status === step).length}</Badge>
              {i < workflowSteps.length - 1 && <ArrowRight className="h-4 w-4 text-slate-600" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capas.map((capa) => (
            <Card key={capa.id} className={capa.isOverdue ? 'border-red-500/50' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-xs text-cyan-400">{capa.capaNumber}</p>
                    <CardTitle className="text-base mt-1">{capa.title}</CardTitle>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-center gap-1">
                      <Badge className={getStatusColor(capa.status)}>{capa.status}</Badge>
                      <DeleteButton
                        onDelete={() => deleteCAPA(capa.id)}
                        confirmMessage={t('delete.capa', { id: capa.capaNumber })}
                      />
                    </div>
                    {capa.isOverdue && <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><AlertTriangle className="h-3 w-3" /> Overdue</Badge>}
                    {capa.escalated && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Escalated</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">{capa.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Assigned To</span><span className="text-slate-300">{capa.assignedTo}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Stakeholder</span><span className="text-slate-300">{capa.stakeholder}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Due Date</span><span className={capa.isOverdue ? 'text-red-400' : 'text-slate-300'}>{formatDate(capa.dueDate)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Source</span><span className="text-slate-300">{capa.sourceType}: {capa.sourceId}</span></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-cyan-400">{capa.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${capa.progress}%` }} />
                  </div>
                </div>
                {capa.status !== 'Closed' && (
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => advanceStatus(capa.id, capa.status)}>
                    Advance to Next Stage <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}