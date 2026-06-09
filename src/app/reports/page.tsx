'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ReportType } from '@/types';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useAppStore } from '@/lib/store';
import { FileBarChart, Download, FileSpreadsheet, Presentation, Loader2 } from 'lucide-react';

const reportTypes: { type: ReportType; label: string; description: string }[] = [
  { type: 'Daily', label: 'Daily Report', description: 'Daily service quality summary' },
  { type: 'Weekly', label: 'Weekly Report', description: 'Weekly performance overview' },
  { type: 'Monthly', label: 'Monthly Report', description: 'Monthly KPI & trend analysis' },
  { type: 'Quarterly', label: 'Quarterly Report', description: 'Quarterly executive summary' },
  { type: 'Annual', label: 'Annual Report', description: 'Annual performance review' },
  { type: 'Audit', label: 'Audit Report', description: 'Audit findings & compliance' },
  { type: 'Complaint', label: 'Complaint Report', description: 'Complaint analysis & trends' },
  { type: 'CAPA', label: 'CAPA Report', description: 'CAPA progress & status' },
  { type: 'CX', label: 'CX Report', description: 'Customer experience metrics' },
  { type: 'GM', label: 'GM Report', description: 'General Manager executive report' },
  { type: 'Board', label: 'Board Report', description: 'Board-ready presentation report' },
];

export default function ReportsPage() {
  const { t } = useTranslation();
  const {
    findings,
    complaints,
    rcas,
    capas,
    audits,
    customerExperiences,
    documents,
  } = useAppStore();
  const [generating, setGenerating] = useState<string | null>(null);

  const exportReport = async (type: ReportType, format: 'pdf' | 'excel' | 'pptx') => {
    setGenerating(`${type}-${format}`);
    try {
      const res = await fetch(`/api/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: type,
          period: new Date().toISOString().split('T')[0],
          data: { findings, complaints, rcas, capas, audits, customerExperiences, documents },
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ASQC-${type}-Report.${format === 'excel' ? 'xlsx' : format === 'pptx' ? 'pptx' : 'pdf'}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Export failed:', e);
    }
    setGenerating(null);
  };

  return (
    <DashboardLayout title={t('reports.title')} subtitle={t('reports.subtitle')}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <Card key={report.type} className="hover:border-cyan-500/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileBarChart className="h-4 w-4 text-cyan-400" />
                  {report.label}
                </CardTitle>
                <p className="text-xs text-slate-500">{report.description}</p>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => exportReport(report.type, 'pdf')} disabled={generating === `${report.type}-pdf`}>
                  {generating === `${report.type}-pdf` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportReport(report.type, 'excel')} disabled={generating === `${report.type}-excel`}>
                  {generating === `${report.type}-excel` ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                  Excel
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportReport(report.type, 'pptx')} disabled={generating === `${report.type}-pptx`}>
                  {generating === `${report.type}-pptx` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Presentation className="h-4 w-4" />}
                  PPT
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Report Features</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Corporate Cover Page', 'KPI Dashboard', 'Charts & Tables', 'Photo Evidence', 'RCA Summary', 'CAPA Summary', 'AI Recommendations', 'Signature Page'].map((f) => (
                <Badge key={f} className="bg-slate-800 text-slate-300 border-slate-700 justify-center py-2">{f}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}