'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const hydrateFromCloud = useAppStore((s) => s.hydrateFromCloud);
  const setSyncStatus = useAppStore((s) => s.setSyncStatus);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    (async () => {
      setSyncStatus('syncing');
      try {
        const res = await fetch('/api/sync');
        const json = await res.json();

        if (!json.configured) {
          setSyncStatus('local');
          return;
        }

        if (json.error) {
          setSyncStatus('error');
          return;
        }

        if (json.data) {
          const total = Object.values(json.data).reduce<number>(
            (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
            0,
          );
          if (total > 0) hydrateFromCloud(json.data);
        }
        setSyncStatus('synced');
      } catch {
        setSyncStatus('offline');
      }
    })();
  }, [hydrateFromCloud, setSyncStatus]);

  return <>{children}</>;
}