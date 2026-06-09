'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const bootstrapFromCloud = useAppStore((s) => s.bootstrapFromCloud);
  const refreshFromCloud = useAppStore((s) => s.refreshFromCloud);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const runBootstrap = () => {
      void bootstrapFromCloud();
    };

    if (useAppStore.persist.hasHydrated()) {
      runBootstrap();
    } else {
      useAppStore.persist.onFinishHydration(runBootstrap);
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void refreshFromCloud();
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [bootstrapFromCloud, refreshFromCloud]);

  return <>{children}</>;
}