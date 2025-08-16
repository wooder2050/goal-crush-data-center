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
      <CardContent className="px-0 py-2 sm:p-4">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="flex gap-2 px-3 sm:px-0">
            <div className="h-6 w-20 rounded bg-gray-200" />
            <div className="h-6 w-16 rounded bg-gray-200" />
            <div className="h-6 w-24 rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-lg border p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-8 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
              <div className="rounded-lg border p-3 sm:p-4 space-y-2">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-11/12 bg-gray-200 rounded" />
                <div className="h-3 w-10/12 bg-gray-200 rounded" />
              </div>
              <div className="rounded-lg border p-3 sm:p-4 space-y-3">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-6 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="rounded-lg border p-2 sm:p-3 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-11/12 bg-gray-200 rounded" />
                  <div className="h-4 w-10/12 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="rounded-lg border p-3 sm:p-4 space-y-3">
                <div className="h-4 w-36 bg-gray-200 rounded" />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-6 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="rounded-lg border p-2 sm:p-3 space-y-2">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-11/12 bg-gray-200 rounded" />
                  <div className="h-4 w-10/12 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-3 sm:p-4 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-11/12 bg-gray-200 rounded" />
                <div className="h-3 w-10/12 bg-gray-200 rounded" />
                <div className="h-3 w-9/12 bg-gray-200 rounded" />
                <div className="h-3 w-8/12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
