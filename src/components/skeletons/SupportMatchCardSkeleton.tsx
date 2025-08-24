import { Card, CardContent, CardHeader } from '@/components/ui';

export function SupportMatchCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          </div>
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 팀 대결 정보 스켈레톤 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
            </div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-8 mx-auto" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="space-y-1 text-right">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
            </div>
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* 응원 통계 스켈레톤 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
            </div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-full" />
            <div className="flex justify-between text-sm">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
            </div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-full" />
          </div>
        </div>

        {/* 응원 버튼 스켈레톤 */}
        <div className="border-t pt-4">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto" />
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
              <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
