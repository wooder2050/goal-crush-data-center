'use client';

import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Badge } from './badge';
import { Card, CardContent } from './card';
import { Caption, H3 } from './typography';

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isNew?: boolean;
  isExclusive?: boolean;
  isLive?: boolean;
  category?: string;
  brand?: string;
  onClick?: () => void;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      image,
      title,
      price,
      originalPrice,
      discount,
      isNew,
      isExclusive,
      isLive,
      category,
      brand,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'group cursor-pointer transition-transform hover:scale-105',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
          {/* Product Image */}
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge variant="default" className="text-xs">
                NEW
              </Badge>
            )}
            {isExclusive && (
              <Badge variant="discount" className="text-xs">
                단독
              </Badge>
            )}
            {isLive && (
              <Badge variant="default" className="text-xs">
                LIVE
              </Badge>
            )}
          </div>

          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-2 right-2">
              <Badge variant="discount" className="text-xs">
                {discount}%
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          {category && (
            <Caption className="mb-1 block text-gray-500">{category}</Caption>
          )}

          {/* Brand */}
          {brand && (
            <Caption className="mb-2 block font-medium text-gray-700">
              {brand}
            </Caption>
          )}

          {/* Title */}
          <H3 className="mb-2 line-clamp-2 text-sm">{title}</H3>

          {/* Price */}
          <div className="flex items-center gap-2">
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                ₩{originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-sm font-bold text-black">
              ₩{price.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };
