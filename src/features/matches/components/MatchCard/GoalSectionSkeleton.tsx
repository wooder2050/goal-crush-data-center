'use client';

export default function GoalSectionSkeleton() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">득점</h3>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
