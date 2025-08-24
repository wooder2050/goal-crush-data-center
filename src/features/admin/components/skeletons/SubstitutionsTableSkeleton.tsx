'use client';

import TableRowSkeleton from './TableRowSkeleton';

export default function SubstitutionsTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">시간</th>
            <th className="text-left py-2 px-4">팀</th>
            <th className="text-left py-2 px-4">IN</th>
            <th className="text-left py-2 px-4">OUT</th>
            <th className="text-left py-2 px-4">액션</th>
          </tr>
        </thead>
        <tbody>
          <TableRowSkeleton columns={5} rows={3} />
        </tbody>
      </table>
    </div>
  );
}
