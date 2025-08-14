'use client';

import Link from 'next/link';
import React from 'react';

import { MatchWithTeams } from '@/lib/types/database';

interface MatchFooterProps {
  match: MatchWithTeams;
  className?: string;
  hideDetailButton?: boolean;
}

const MatchFooter: React.FC<MatchFooterProps> = ({
  match,
  className = '',
  hideDetailButton = false,
}) => {
  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>{match.location || '골때리는 그녀들 스튜디오'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              match.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          <span>{match.status === 'completed' ? '완료' : '예정'}</span>
          {!hideDetailButton && (
            <Link
              href={`/matches/${match.match_id}`}
              aria-label="상세 보기"
              className="ml-3 inline-flex items-center rounded-md bg-black px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
            >
              상세 보기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchFooter;
