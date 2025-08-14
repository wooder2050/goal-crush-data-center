'use client';

export default function PenaltyShootoutSectionSkeleton() {
  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm font-medium text-gray-700">
          🎯 승부차기 상세 기록
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                {Array.from({ length: 4 }).map((__, j) => (
                  <div key={j} className="h-8 bg-gray-200 rounded mb-2" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
