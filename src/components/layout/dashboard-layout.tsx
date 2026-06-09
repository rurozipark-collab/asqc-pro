'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function DashboardLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 ml-0',
          sidebarOpen ? 'md:ml-64' : 'md:ml-16',
        )}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="p-4 md:p-6 pb-8 safe-bottom">{children}</main>
      </div>
    </div>
  );
}