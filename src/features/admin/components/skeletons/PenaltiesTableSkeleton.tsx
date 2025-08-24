'use client';

import TableRowSkeleton from './TableRowSkeleton';

export default function PenaltiesTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">순서</th>
            <th className="text-left py-2 px-4">팀</th>
            <th className="text-left py-2 px-4">키커</th>
            <th className="text-left py-2 px-4">골키퍼</th>
            <th className="text-left py-2 px-4">결과</th>
            <th className="text-left py-2 px-4">액션</th>
          </tr>
        </thead>
        <tbody>
          <TableRowSkeleton columns={6} rows={3} />
        </tbody>
      </table>
    </div>
  );
}
