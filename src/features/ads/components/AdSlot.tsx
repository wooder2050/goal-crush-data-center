'use client';

import clsx from 'clsx';
import { useEffect } from 'react';

type AdVariant = 'banner' | 'rectangle' | 'skyscraper' | 'responsive';

interface AdSlotProps {
  variant?: AdVariant;
  className?: string;
  label?: string;
  adSlot?: string;
}

// Google AdSense 타입 정의
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
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
  adSlot,
}: AdSlotProps) {
  useEffect(() => {
    try {
      // Google AdSense 광고 로드
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div
      aria-label="ad-slot"
      className={clsx(
        'bg-gray-50 border border-dashed border-gray-300 text-gray-400 flex items-center justify-center rounded-md',
        variantClass[variant],
        className
      )}
    >
      {adSlot ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
            'ca-pub-6439388251426570'
          }
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <span className="text-xs md:text-sm font-medium">
          {label ?? 'Ad Placeholder'} • {variant}
        </span>
      )}
    </div>
  );
}
