'use client';

import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Body, H1, H2 } from './typography';

interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  overlay?: boolean;
}

const HeroBanner = React.forwardRef<HTMLDivElement, HeroBannerProps>(
  (
    {
      className,
      image,
      title,
      subtitle,
      description,
      ctaText,
      onCtaClick,
      overlay = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative h-[60vh] min-h-[400px] overflow-hidden',
          className
        )}
        {...props}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-2xl text-white">
              {subtitle && <H2 className="mb-2 text-white/90">{subtitle}</H2>}

              <H1 className="mb-4 text-4xl font-bold lg:text-5xl">{title}</H1>

              {description && (
                <Body className="mb-6 text-lg text-white/90">
                  {description}
                </Body>
              )}

              {ctaText && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onCtaClick}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  {ctaText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
HeroBanner.displayName = 'HeroBanner';

export { HeroBanner };
