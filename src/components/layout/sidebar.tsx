'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquareWarning,
  GitBranch,
  ShieldCheck,
  FileSearch,
  HeartHandshake,
  FolderOpen,
  Users,
  FileBarChart,
  Link2,
  Bot,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/use-translation';

const navigation = [
  { key: 'nav.dashboard', href: '/', icon: LayoutDashboard },
  { key: 'nav.inspections', href: '/inspections', icon: ClipboardCheck },
  { key: 'nav.complaints', href: '/complaints', icon: MessageSquareWarning },
  { key: 'nav.rca', href: '/rca', icon: GitBranch },
  { key: 'nav.capa', href: '/capa', icon: ShieldCheck },
  { key: 'nav.audits', href: '/audits', icon: FileSearch },
  { key: 'nav.cx', href: '/customer-experience', icon: HeartHandshake },
  { key: 'nav.documents', href: '/documents', icon: FolderOpen },
  { key: 'nav.stakeholders', href: '/stakeholders', icon: Users },
  { key: 'nav.reports', href: '/reports', icon: FileBarChart },
  { key: 'nav.integrations', href: '/integrations', icon: Link2 },
  { key: 'nav.ai', href: '/ai-assistant', icon: Bot },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname, setMobileSidebarOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setMobileSidebarOpen]);

  const navContent = (
    <>
      <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-800 px-4">
        <Link
          href="/"
          onClick={() => setMobileSidebarOpen(false)}
          className="flex min-w-0 flex-1 items-center"
          aria-label="inJourney Airports"
        >
          <div
            className={cn(
              'relative shrink-0 overflow-hidden rounded-md bg-white',
              sidebarOpen || mobileSidebarOpen ? 'h-10 w-[11.5rem]' : 'h-9 w-9',
            )}
          >
            <Image
              src="/images/injourney-airports-logo.jpg"
              alt="inJourney Airports"
              fill
              priority
              sizes="(max-width: 768px) 184px, 36px"
              className={cn(
                'object-contain p-0.5',
                sidebarOpen || mobileSidebarOpen
                  ? 'object-center'
                  : 'object-left scale-[2.8] origin-left',
              )}
            />
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const label = t(item.key);
          const showLabel = sidebarOpen || mobileSidebarOpen;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 md:py-2.5 text-sm font-medium transition-all min-h-[44px]',
                isActive
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
              )}
              title={!showLabel ? label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {showLabel && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:flex h-12 items-center justify-center border-t border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
      >
        {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
    </>
  );

  return (
    <>
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r border-slate-800 bg-slate-950 transition-all duration-300 flex flex-col',
          'w-64 -translate-x-full md:translate-x-0',
          mobileSidebarOpen && 'translate-x-0',
          sidebarOpen ? 'md:w-64' : 'md:w-16',
        )}
      >
        {navContent}
      </aside>
    </>
  );
}