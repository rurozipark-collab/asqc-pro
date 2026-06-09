'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/use-translation';

interface DeleteButtonProps {
  onDelete: () => void;
  label?: string;
  confirmMessage?: string;
  size?: 'sm' | 'default' | 'icon';
  variant?: 'ghost' | 'danger' | 'outline';
}

export function DeleteButton({
  onDelete,
  label,
  confirmMessage,
  size = 'sm',
  variant = 'ghost',
}: DeleteButtonProps) {
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(confirmMessage || t('common.confirmDelete'))) {
      onDelete();
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={variant === 'ghost' ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : ''}
      title={t('common.delete')}
    >
      <Trash2 className="h-4 w-4" />
      {label && <span>{label}</span>}
    </Button>
  );
}