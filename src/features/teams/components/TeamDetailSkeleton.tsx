'use client';

export default function TeamDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Back button area */}
      <div className="h-9 w-40 rounded bg-gray-100 animate-pulse" />

      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-28 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>

      {/* Stats card skeleton */}
      <div className="rounded-lg border bg-white">
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 text-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-10 mx-auto rounded bg-gray-100 animate-pulse" />
              <div className="h-5 w-12 mx-auto rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="pt-0 pb-4 grid grid-cols-2 gap-4 text-center">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-10 mx-auto rounded bg-gray-100 animate-pulse" />
              <div className="h-5 w-12 mx-auto rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Squad table skeleton */}
      <div className="rounded-lg border bg-white">
        <div className="p-4">
          <div className="h-5 w-20 rounded bg-gray-200 animate-pulse mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[6rem_1fr] items-center gap-4"
              >
                <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
