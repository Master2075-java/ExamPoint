import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'icon' | 'monochrome';
  className?: string;
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="relative">
          <Brain className="h-8 w-8 text-blue-600" />
          <div className="absolute -right-1 -top-1 h-3 w-3">
            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#22c55e"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'monochrome') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Brain className="h-6 w-6" />
        <span className="text-xl font-bold">ExamPoint</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <Brain className="h-6 w-6 text-blue-600" />
        <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5">
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#22c55e"/>
          </svg>
        </div>
      </div>
      <span className="text-xl font-bold text-zinc-900">ExamPoint</span>
    </div>
  );
}
