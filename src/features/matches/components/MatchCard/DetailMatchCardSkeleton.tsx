'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface DetailMatchCardSkeletonProps {
  className?: string;
}

export default function DetailMatchCardSkeleton({
  className = '',
}: DetailMatchCardSkeletonProps) {
  return (
    <Card className={className}>
      <CardContent className="px-0 py-3 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  );
}
