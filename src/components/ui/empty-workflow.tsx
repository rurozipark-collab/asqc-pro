'use client';

import Link from 'next/link';
import { InfoPanel } from '@/components/ui/field-help';
import { useTranslation } from '@/lib/i18n/use-translation';
import { ClipboardCheck, MessageSquareWarning, FileSearch, GitBranch, HeartHandshake } from 'lucide-react';

const dashboardSteps = [
  { key: 'step1', href: '/inspections', icon: ClipboardCheck, color: 'text-cyan-400' },
  { key: 'step2', href: '/complaints', icon: MessageSquareWarning, color: 'text-purple-400' },
  { key: 'step3', href: '/audits', icon: FileSearch, color: 'text-amber-400' },
  { key: 'step4', href: '/customer-experience', icon: HeartHandshake, color: 'text-pink-400' },
  { key: 'step5', href: '/rca', icon: GitBranch, color: 'text-emerald-400' },
] as const;

const rcaSteps = [
  { key: 'step1', href: '/inspections', icon: ClipboardCheck, color: 'text-cyan-400' },
  { key: 'step2', href: '/complaints', icon: MessageSquareWarning, color: 'text-purple-400' },
  { key: 'step3', href: '/audits', icon: FileSearch, color: 'text-amber-400' },
  { key: 'step4', href: '/rca', icon: GitBranch, color: 'text-emerald-400' },
] as const;

export function EmptyWorkflowGuide({ variant = 'dashboard' }: { variant?: 'dashboard' | 'rca' }) {
  const { t } = useTranslation();
  const prefix = variant === 'rca' ? 'workflow.rca' : 'workflow';
  const steps = variant === 'rca' ? rcaSteps : dashboardSteps;

  return (
    <InfoPanel title={t(`${prefix}.title`)}>
      <p>{t(`${prefix}.desc`)}</p>
      <ol className="list-decimal list-inside space-y-2 mt-3">
        {steps.map((step) => (
          <li key={step.key}>
            <Link href={step.href} className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <step.icon className={`h-3.5 w-3.5 ${step.color}`} />
              {t(`${prefix}.${step.key}`)}
            </Link>
          </li>
        ))}
      </ol>
      <p className="text-cyan-400/80 mt-3 font-medium">{t(`${prefix}.note`)}</p>
    </InfoPanel>
  );
}