'use client';

import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-primary-50',
  trend,
  className,
}) => {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  return (
    <div
      className={clsx(
        'bg-card rounded-xl border border-border shadow-card p-5 flex flex-col gap-4 animate-slide-up',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            iconBg
          )}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={clsx(
              'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
              isPositive && 'bg-emerald-50 text-emerald-700',
              isNegative && 'bg-red-50 text-red-700',
              !isPositive && !isNegative && 'bg-slate-100 text-slate-500'
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
            <span>
              {isPositive ? '+' : ''}
              {trend.value}%
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        {trend?.label && <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>}
      </div>
    </div>
  );
};
