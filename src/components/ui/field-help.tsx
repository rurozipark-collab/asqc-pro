import { Info } from 'lucide-react';

export function FieldHelp({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-700/80 bg-slate-800/40 p-3">
      <p className="text-xs font-medium text-slate-300">{label}</p>
      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed whitespace-pre-line">{description}</p>
      {children}
    </div>
  );
}

export function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
      <div className="flex items-start gap-2 mb-2">
        <Info className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
        <h4 className="text-sm font-semibold text-cyan-400">{title}</h4>
      </div>
      <div className="text-xs text-slate-400 space-y-2 pl-6">{children}</div>
    </div>
  );
}