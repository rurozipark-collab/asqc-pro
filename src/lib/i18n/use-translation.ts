'use client';

import { useAppStore } from '@/lib/store';
import { getTranslation, type Locale } from './translations';

export function useTranslation() {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  const t = (key: string, params?: Record<string, string>) => getTranslation(locale, key, params);

  return { t, locale, setLocale };
}

export type { Locale };