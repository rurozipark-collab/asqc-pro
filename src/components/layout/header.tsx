'use client';

import { Search, User, Menu } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { SyncBadge } from '@/components/ui/sync-badge';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useAppStore } from '@/lib/store';

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t } = useTranslation();
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 md:px-6 py-2">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden shrink-0 rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-300 hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-slate-100 truncate">{title}</h2>
          {subtitle && <p className="text-[11px] md:text-xs text-slate-400 truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 min-h-[40px]">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder={t('common.search')}
            className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none w-48"
          />
        </div>

        <SyncBadge />
        <LanguageSwitcher />

        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 md:px-3 py-2 min-h-[44px] max-w-[140px] md:max-w-xs">
          <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden lg:block min-w-0">
            <p className="text-[10px] font-medium text-slate-200 leading-tight truncate">
              {t('header.orgTitle')}
            </p>
            <p className="text-[10px] text-cyan-400 leading-tight truncate">
              {t('header.orgLocation')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}