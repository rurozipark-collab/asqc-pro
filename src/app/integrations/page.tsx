'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoPanel } from '@/components/ui/field-help';
import { SetupChecklist } from '@/components/integrations/setup-checklist';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Link2, Copy, Check, RefreshCw } from 'lucide-react';

const APPS_SCRIPT = `function onFormSubmit(e) {
  var WEBHOOK_URL = 'YOUR_APP_URL/api/integrations/google-form';
  var SECRET = 'YOUR_WEBHOOK_SECRET';

  var responses = {};
  e.response.getItemResponses().forEach(function(item) {
    responses[item.getItem().getTitle()] = item.getResponse();
  });

  var payload = {
    secret: SECRET,
    type: 'finding',
    description: responses['Deskripsi Temuan'] || responses['Description'] || '',
    terminal: responses['Terminal'] || 'Terminal 3',
    zone: responses['Zona'] || responses['Zone'] || '',
    area: responses['Area'] || '',
    category: responses['Kategori'] || responses['Category'] || 'Service Quality',
    pic: responses['PIC'] || '',
    stakeholder: responses['Stakeholder'] || '',
    submittedAt: new Date().toISOString()
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}`;

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const { syncStatus, refreshFromCloud } = useAppStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app';
  const webhookUrl = `${appUrl}/api/integrations/google-form`;
  const scriptReady = APPS_SCRIPT
    .replace('YOUR_APP_URL', appUrl)
    .replace('YOUR_WEBHOOK_SECRET', 'GANTI_DENGAN_SECRET_ANDA');

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await refreshFromCloud();
    setRefreshing(false);
  };

  return (
    <DashboardLayout title={t('integrations.title')} subtitle={t('integrations.subtitle')}>
      <div className="space-y-6">
        <SetupChecklist />

        <InfoPanel title={t('integrations.overviewTitle')}>
          <p>{t('integrations.overviewDesc')}</p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>{t('integrations.step1')}</li>
            <li>{t('integrations.step2')}</li>
            <li>{t('integrations.step3')}</li>
            <li>{t('integrations.step4')}</li>
          </ol>
        </InfoPanel>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-cyan-400" />
              {t('integrations.webhookTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Webhook URL</p>
              <div className="flex gap-2">
                <code className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-cyan-400 break-all">
                  {webhookUrl}
                </code>
                <Button variant="outline" size="sm" onClick={() => copyText(webhookUrl, 'url')}>
                  {copied === 'url' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500">{t('integrations.webhookNote')}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={refreshData} disabled={refreshing || syncStatus === 'local'}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {t('integrations.refreshData')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('integrations.formFieldsTitle')}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400 mb-3">{t('integrations.formFieldsDesc')}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="text-left py-2 px-3">{t('integrations.fieldName')}</th>
                    <th className="text-left py-2 px-3">{t('integrations.required')}</th>
                    <th className="text-left py-2 px-3">{t('integrations.example')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {[
                    ['Deskripsi Temuan', t('common.yes'), 'Antrian panjang di check-in'],
                    ['Terminal', t('common.no'), 'Terminal 3'],
                    ['Zona', t('common.no'), 'Domestic Departure'],
                    ['Area', t('common.no'), 'Check-in Area'],
                    ['Kategori', t('common.no'), 'Queue Management'],
                    ['PIC', t('common.no'), 'Ahmad Rizki'],
                    ['Stakeholder', t('common.no'), 'Garuda Indonesia'],
                  ].map(([name, req, ex]) => (
                    <tr key={name} className="border-b border-slate-800">
                      <td className="py-2 px-3 font-mono text-cyan-400/90">{name}</td>
                      <td className="py-2 px-3">{req}</td>
                      <td className="py-2 px-3 text-slate-500">{ex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span>{t('integrations.scriptTitle')}</span>
              <Button variant="outline" size="sm" onClick={() => copyText(scriptReady, 'script')}>
                {copied === 'script' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {t('integrations.copyScript')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400 mb-3">{t('integrations.scriptDesc')}</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 border border-slate-700 p-4 text-[11px] text-slate-300 leading-relaxed">
              {scriptReady}
            </pre>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}