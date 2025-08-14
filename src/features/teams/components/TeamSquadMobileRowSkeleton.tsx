'use client';

export default function TeamSquadMobileRowSkeleton() {
  return (
    <div className="rounded-md border p-3 animate-pulse">
      <div className="flex items-center justify-between gap-2">
        <div className="h-3 w-8 bg-gray-200 rounded" />
        <div className="h-4 w-10 bg-gray-200 rounded" />
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
      </div>
      <div className="mt-1 grid grid-cols-3 gap-2 text-center">
        <div className="rounded bg-gray-50 border px-2 py-1">
          <div className="h-3 bg-gray-200 rounded mb-1" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
        <div className="rounded bg-gray-50 border px-2 py-1">
          <div className="h-3 bg-gray-200 rounded mb-1" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
        <div className="rounded bg-gray-50 border px-2 py-1">
          <div className="h-3 bg-gray-200 rounded mb-1" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
