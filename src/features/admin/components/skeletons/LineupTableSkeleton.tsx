'use client';

import TableRowSkeleton from './TableRowSkeleton';

export default function LineupTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">번호</th>
            <th className="text-left py-2 px-4">선수</th>
            <th className="text-left py-2 px-4">포지션</th>
          </tr>
        </thead>
        <tbody>
          <TableRowSkeleton columns={3} rows={3} />
        </tbody>
      </table>
    </div>
  );
}
