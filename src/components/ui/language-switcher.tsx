'use client';

import { useTranslation } from '@/lib/i18n/use-translation';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 p-0.5">
      <button
        onClick={() => setLocale('id')}
        className={cn(
          'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
          locale === 'id' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
        )}
      >
        ID
      </button>
      <button
        onClick={() => setLocale('en')}
        className={cn(
          'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
          locale === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
        )}
      >
        EN
      </button>
    </div>
  );
}