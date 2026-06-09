'use client';

import { Cloud, CloudOff, Loader2, AlertCircle, HardDrive, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/use-translation';
import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
  local: 'bg-slate-800 text-slate-400 border-slate-700',
  syncing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  synced: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  error: 'bg-red-500/10 text-red-400 border-red-500/30',
  offline: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

const icons = {
  local: HardDrive,
  syncing: Loader2,
  synced: Cloud,
  error: AlertCircle,
  offline: CloudOff,
};

export function SyncBadge() {
  const syncStatus = useAppStore((s) => s.syncStatus);
  const refreshFromCloud = useAppStore((s) => s.refreshFromCloud);
  const { t } = useTranslation();
  const Icon = icons[syncStatus];
  const canRefresh = syncStatus === 'synced' || syncStatus === 'error' || syncStatus === 'offline';

  const handleClick = () => {
    if (canRefresh) refreshFromCloud();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canRefresh}
      className={cn(
        'hidden sm:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition-colors',
        styles[syncStatus],
        canRefresh && 'hover:opacity-80 cursor-pointer',
        !canRefresh && 'cursor-default',
      )}
      title={canRefresh ? t('integrations.tapToRefresh') : t(`sync.${syncStatus}`)}
    >
      <Icon className={cn('h-3.5 w-3.5', syncStatus === 'syncing' && 'animate-spin')} />
      <span>{t(`sync.${syncStatus}`)}</span>
      {canRefresh && <RefreshCw className="h-3 w-3 opacity-60" />}
    </button>
  );
}