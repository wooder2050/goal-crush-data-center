'use client';

import { Card, CardContent } from '@/components/ui/card';

interface LineupsEmptyProps {
  className?: string;
}

export default function LineupsEmpty({ className = '' }: LineupsEmptyProps) {
  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-3">👥 출전 선수</div>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-gray-800 font-semibold">
              라인업 정보가 없습니다
            </div>
            <div className="text-gray-500 text-sm mt-1">
              경기 데이터에 라인업이 등록되지 않았거나 집계 중입니다.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
