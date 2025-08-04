'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'caption'
    | 'label';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, children, variant = 'body', as, ...props }, ref) => {
    const variantClasses = {
      h1: 'text-2xl font-bold text-black',
      h2: 'text-xl font-bold text-black',
      h3: 'text-lg font-bold text-black',
      h4: 'text-base font-bold text-black',
      h5: 'text-sm font-bold text-black',
      h6: 'text-xs font-bold text-black',
      body: 'text-sm text-gray-700 leading-relaxed',
      caption: 'text-xs text-gray-500',
      label: 'text-sm font-medium text-gray-700',
    };

    const defaultElements = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      body: 'p',
      caption: 'span',
      label: 'label',
    };

    const Element = as || defaultElements[variant];

    return React.createElement(
      Element,
      {
        ref,
        className: cn(variantClasses[variant], className),
        ...props,
      },
      children
    );
  }
);
Typography.displayName = 'Typography';

// Convenience components
const H1 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant' | 'as'>
>((props, ref) => <Typography ref={ref} variant="h1" as="h1" {...props} />);
H1.displayName = 'H1';

const H2 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant' | 'as'>
>((props, ref) => <Typography ref={ref} variant="h2" as="h2" {...props} />);
H2.displayName = 'H2';

const H3 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant' | 'as'>
>((props, ref) => <Typography ref={ref} variant="h3" as="h3" {...props} />);
H3.displayName = 'H3';

const Body = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, 'variant' | 'as'>
>((props, ref) => <Typography ref={ref} variant="body" as="p" {...props} />);
Body.displayName = 'Body';

const Caption = React.forwardRef<
  HTMLSpanElement,
  Omit<TypographyProps, 'variant' | 'as'>
>((props, ref) => (
  <Typography ref={ref} variant="caption" as="span" {...props} />
));
Caption.displayName = 'Caption';

const Label = React.forwardRef<
  HTMLLabelElement,
  Omit<TypographyProps, 'variant' | 'as'>
>((props, ref) => (
  <Typography ref={ref} variant="label" as="label" {...props} />
));
Label.displayName = 'Label';

export { Body, Caption, H1, H2, H3, Label, Typography };
