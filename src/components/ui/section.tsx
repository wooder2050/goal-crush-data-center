'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Container } from './container';
import { H2, H3 } from './typography';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  background?: 'white' | 'gray' | 'black';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  container?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      children,
      title,
      subtitle,
      background = 'white',
      padding = 'lg',
      container = true,
      ...props
    },
    ref
  ) => {
    const backgroundClasses = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      black: 'bg-black text-white',
    };

    const paddingClasses = {
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
    };

    const content = (
      <>
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {subtitle && <H3 className="mb-2 text-gray-600">{subtitle}</H3>}
            {title && (
              <H2 className="text-2xl font-bold lg:text-3xl">{title}</H2>
            )}
          </div>
        )}
        {children}
      </>
    );

    return (
      <section
        ref={ref}
        className={cn(
          backgroundClasses[background],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {container ? <Container>{content}</Container> : content}
      </section>
    );
  }
);
Section.displayName = 'Section';

export { Section };
