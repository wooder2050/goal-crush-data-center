'use client';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { H2 } from '@/components/ui/typography';

interface MatchErrorStateProps {
  errorMessage?: string;
  onBackClick: () => void;
}

export default function MatchErrorState({
  errorMessage,
  onBackClick,
}: MatchErrorStateProps) {
  return (
    <Container className="py-8">
      <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <H2>경기를 찾을 수 없습니다</H2>
          <p className="text-red-500 max-w-md">
            {errorMessage ||
              '요청하신 경기 정보를 불러올 수 없습니다. 경기 ID를 확인해주세요.'}
          </p>
        </div>
        <Button onClick={onBackClick} size="lg" className="px-6">
          경기 목록으로 돌아가기
        </Button>
      </div>
    </Container>
  );
}
