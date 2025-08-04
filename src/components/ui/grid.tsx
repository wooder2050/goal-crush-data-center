'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, children, cols = 4, gap = 'md', ...props }, ref) => {
    const colsClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-6 md:grid-cols-8 lg:grid-cols-12',
    };

    const gapClasses = {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };

    return (
      <div
        ref={ref}
        className={cn('grid', colsClasses[cols], gapClasses[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = 'Grid';

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, children, span = 1, ...props }, ref) => {
    const spanClasses = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      12: 'col-span-12',
    };

    return (
      <div ref={ref} className={cn(spanClasses[span], className)} {...props}>
        {children}
      </div>
    );
  }
);
GridItem.displayName = 'GridItem';

export { Grid, GridItem };
