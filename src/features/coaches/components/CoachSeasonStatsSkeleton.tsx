'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function CoachSeasonStatsSkeleton() {
  return (
    <Card>
      <CardHeader className="px-0 sm:px-0 md:px-0">
        <CardTitle>시즌별 통계</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-0 md:p-0">
        <div className="overflow-x-hidden">
          <Table className="w-full table-fixed text-xs md:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%] truncate">시즌</TableHead>
                <TableHead className="w-[16%] sm:w-[28%] truncate">
                  팀
                </TableHead>
                <TableHead className="w-[10%] truncate">순위</TableHead>
                <TableHead className="w-[10%] truncate">경기</TableHead>
                <TableHead className="w-[10%] truncate">승</TableHead>
                <TableHead className="w-[10%] truncate">패</TableHead>
                <TableHead className="w-[10%] truncate">승률</TableHead>
                <TableHead className="hidden sm:table-cell w-[10%] truncate">
                  득점
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[10%] truncate">
                  실점
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[10%] truncate">
                  득실차
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="truncate">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="truncate w-[16%] sm:w-auto">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="truncate">
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="truncate">
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="truncate">
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="truncate">
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="truncate">
                    <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell truncate">
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell truncate">
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell truncate">
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
