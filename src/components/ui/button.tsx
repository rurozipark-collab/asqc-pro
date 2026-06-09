import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-600/20',
        secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700',
        outline: 'border border-slate-600 bg-transparent hover:bg-slate-800 text-slate-300',
        ghost: 'hover:bg-slate-800 text-slate-300',
        danger: 'bg-red-600 text-white hover:bg-red-500',
        success: 'bg-emerald-600 text-white hover:bg-emerald-500',
      },
      size: {
        default: 'h-11 min-h-[44px] px-4 py-2',
        sm: 'h-9 min-h-[36px] px-3 text-xs',
        lg: 'h-12 min-h-[48px] px-6 text-base',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px]',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}