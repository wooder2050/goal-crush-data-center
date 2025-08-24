'use client';

interface TableRowSkeletonProps {
  columns: number;
  rows?: number;
}

export default function TableRowSkeleton({
  columns,
  rows = 3,
}: TableRowSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="py-2 px-4">
              <div className="animate-pulse rounded-md bg-gray-200/80 h-5 w-full max-w-32" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
