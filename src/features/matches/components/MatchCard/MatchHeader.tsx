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

  return (
    <CardHeader className={`pb-3 ${className}`}>
      <div className="flex flex-col items-start gap-3 w-full">
        <Badge variant="secondary" className="text-sm">
          {match.description || match.season?.season_name || ''}
        </Badge>
        <div className="w-full text-sm text-gray-500 flex justify-end">
          {format(matchDate, 'yyyy년 M월 d일 (EEE)', { locale: ko })}
        </div>
      </div>
    </CardHeader>
  );
};

export default MatchHeader;
