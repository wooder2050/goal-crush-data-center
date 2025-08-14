'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { CardHeader } from '@/components/ui/card';
import { MatchWithTeams } from '@/lib/types/database';

interface MatchHeaderProps {
  match: MatchWithTeams;
  className?: string;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({ match, className = '' }) => {
  const matchDate = new Date(match.match_date);
  const baseLabel = match.description || match.season?.season_name || '';
  const mobileLabel =
    baseLabel.replace(/\s*골\s*때리는\s*그녀들\s*/g, '').trim() || baseLabel;

  return (
    <CardHeader
      className={`px-0 pt-3 pb-0 sm:px-6 sm:pt-6 sm:pb-0 ${className}`}
    >
      <div className="flex flex-col items-start gap-3 w-full">
        {/* Mobile: remove the common phrase; Desktop: show full */}
        <Badge variant="secondary" className="text-sm sm:hidden">
          {mobileLabel}
        </Badge>
        <Badge variant="secondary" className="hidden text-sm sm:inline-flex">
          {baseLabel}
        </Badge>
        <div className="w-full text-sm text-gray-500 flex justify-end">
          {format(matchDate, 'yyyy년 M월 d일 (EEE)', { locale: ko })}
        </div>
      </div>
    </CardHeader>
  );
};

export default MatchHeader;
