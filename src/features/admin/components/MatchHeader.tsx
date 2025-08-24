'use client';

import { Button } from '@/components/ui/button';
import { H1 } from '@/components/ui/typography';

interface MatchHeaderProps {
  onBackClick: () => void;
}

export default function MatchHeader({ onBackClick }: MatchHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <H1>경기 결과 기록</H1>
      <Button variant="outline" onClick={onBackClick}>
        경기 목록으로 돌아가기
      </Button>
    </div>
  );
}
