'use client';

import clsx from 'clsx';

type AdVariant = 'banner' | 'rectangle' | 'skyscraper' | 'responsive';

interface AdSlotProps {
  variant?: AdVariant;
  className?: string;
  label?: string;
}

const variantClass: Record<AdVariant, string> = {
  banner: 'w-full h-24 sm:h-28 md:h-28 lg:h-24', // 320x100~728x90 범용
  rectangle: 'w-full h-48 md:h-56 lg:h-60 max-w-sm', // 300x250 유사
  skyscraper: 'w-[300px] h-[600px]', // 300x600
  responsive: 'w-full h-24 md:h-40',
};

export default function AdSlot({
  variant = 'responsive',
  className,
  label,
}: AdSlotProps) {
  return (
    <div
      aria-label="ad-slot"
      className={clsx(
        'bg-gray-50 border border-dashed border-gray-300 text-gray-400 flex items-center justify-center rounded-md',
        variantClass[variant],
        className
      )}
    >
      <span className="text-xs md:text-sm font-medium">
        {label ?? 'Ad Placeholder'} • {variant}
      </span>
    </div>
  );
}
