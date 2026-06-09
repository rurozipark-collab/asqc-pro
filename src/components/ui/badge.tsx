import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variant === 'outline' && 'border-slate-600 text-slate-300',
        variant === 'default' && 'border-transparent bg-slate-700 text-slate-200',
        className
      )}
      {...props}
    />
  );
}