'use client';

import { TableCell, TableRow } from '@/components/ui/table';

export default function TeamSquadTableRowSkeleton() {
  return (
    <TableRow className="animate-pulse">
      <TableCell className="w-20">
        <div className="h-4 w-10 bg-gray-200 rounded" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </TableCell>
      <TableCell className="text-right">
        <div className="h-4 w-12 bg-gray-200 rounded ml-auto" />
      </TableCell>
      <TableCell className="text-left">
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </TableCell>
      <TableCell className="text-right">
        <div className="h-4 w-8 bg-gray-200 rounded ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <div className="h-4 w-8 bg-gray-200 rounded ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <div className="h-4 w-8 bg-gray-200 rounded ml-auto" />
      </TableCell>
    </TableRow>
  );
}
