import React from 'react';
import clsx from 'clsx';

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto scrollbar-thin">
    <table className={clsx('w-full text-sm border-collapse', className)} {...props} />
  </div>
);

export const TableHead = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={clsx('', className)} {...props} />
);

export const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={clsx('divide-y divide-border', className)} {...props} />
);

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={clsx('hover:bg-muted/50 transition-colors group', className)} {...props} />
);

export const TableHeader = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={clsx(
      'px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/70',
      'border-b border-border first:rounded-tl-lg last:rounded-tr-lg',
      className
    )}
    {...props}
  />
);

export const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={clsx('px-4 py-3 text-foreground', className)} {...props} />
);
