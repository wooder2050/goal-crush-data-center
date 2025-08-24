'use client';

import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export function PlayersPageSkeleton() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-10 w-28 rounded"></div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {/* Title Skeleton */}
            <div className="flex justify-between items-center">
              <div className="animate-pulse bg-gray-200 h-6 w-40 rounded"></div>
            </div>

            {/* Table Skeleton */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                    </th>
                    <th className="text-left py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                    </th>
                    <th className="text-left py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                    </th>
                    <th className="text-left py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                    </th>
                    <th className="text-left py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                    </th>
                    <th className="text-left py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                    </th>
                    <th className="text-left py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-14 rounded"></div>
                    </th>
                    <th className="text-left py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                    </th>
                    <th className="text-right py-2 px-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded ml-auto"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">
                        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="animate-pulse bg-gray-200 h-4 w-18 rounded"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="animate-pulse bg-gray-200 h-4 w-14 rounded"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                          <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
