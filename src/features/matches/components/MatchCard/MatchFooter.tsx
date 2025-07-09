'use client';

import React from 'react';

import { MatchWithTeams } from '@/lib/types/database';

interface MatchFooterProps {
  match: MatchWithTeams;
  className?: string;
}

const MatchFooter: React.FC<MatchFooterProps> = ({ match, className = '' }) => {
  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>{match.location || '골때리는 그녀들 스튜디오'}</div>
        <div className="flex items-center">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${
              match.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          ></span>
          {match.status === 'completed' ? '완료' : '예정'}
        </div>
      </div>
    </div>
  );
};

export default MatchFooter;
