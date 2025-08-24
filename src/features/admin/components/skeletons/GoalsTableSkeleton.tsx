'use client';

import TableRowSkeleton from './TableRowSkeleton';

export default function GoalsTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">시간</th>
            <th className="text-left py-2 px-4">팀</th>
            <th className="text-left py-2 px-4">선수</th>
            <th className="text-left py-2 px-4">타입</th>
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
