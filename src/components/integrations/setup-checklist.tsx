'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/use-translation';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

type StatusResponse = {
  supabaseConfigured: boolean;
  webhookConfigured: boolean;
  connected: boolean;
  tablesOk: boolean;
  counts: Record<string, number> | null;
  error: string | null;
};

function StatusRow({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-slate-800 last:border-0">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
      )}
      <div>
        <p className="text-sm text-slate-200">{label}</p>
        {detail && <p className="text-xs text-slate-500 mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}

export function SetupChecklist() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const check = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sync/status');
      setStatus(await res.json());
    } catch {
      setStatus(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    check();
  }, []);

  const totalRecords = status?.counts
    ? Object.values(status.counts).reduce((s, n) => s + n, 0)
    : 0;

  return (
    <Card className="border-cyan-500/20">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">{t('integrations.checklistTitle')}</CardTitle>
        <Button variant="outline" size="sm" onClick={check} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {t('integrations.checkConnection')}
        </Button>
      </CardHeader>
      <CardContent>
        {loading && !status ? (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> {t('integrations.checking')}
          </p>
        ) : status ? (
          <div>
            <StatusRow
              ok={status.supabaseConfigured}
              label={t('integrations.checkSupabaseEnv')}
              detail={status.supabaseConfigured ? t('integrations.checkSupabaseEnvOk') : t('integrations.checkSupabaseEnvFail')}
            />
            <StatusRow
              ok={status.connected && status.tablesOk}
              label={t('integrations.checkTables')}
              detail={
                status.error
                  ? status.error
                  : status.tablesOk
                    ? t('integrations.checkTablesOk')
                    : t('integrations.checkTablesFail')
              }
            />
            <StatusRow
              ok={status.webhookConfigured}
              label={t('integrations.checkWebhook')}
              detail={status.webhookConfigured ? t('integrations.checkWebhookOk') : t('integrations.checkWebhookFail')}
            />
            {status.connected && status.counts && (
              <div className="mt-4 rounded-lg bg-slate-900/50 border border-slate-800 p-3">
                <p className="text-xs text-slate-400 mb-2">{t('integrations.cloudRecords')}</p>
                <p className="text-2xl font-bold text-cyan-400">{totalRecords}</p>
                <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] text-slate-500">
                  {Object.entries(status.counts).map(([k, v]) => (
                    <span key={k}>{k}: {v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-red-400">{t('integrations.checkFailed')}</p>
        )}
      </CardContent>
    </Card>
  );
}