'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    { className, children, maxWidth = '7xl', padding = 'md', ...props },
    ref
  ) => {
    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '7xl': 'max-w-7xl',
    };

    const paddingClasses = {
      none: '',
      sm: 'px-4',
      md: 'px-4 lg:px-6',
      lg: 'px-6 lg:px-8',
      xl: 'px-8 lg:px-12',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto',
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = 'Container';

export { Container };
