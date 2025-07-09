'use client';

import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MatchWithTeams } from '@/lib/types/database';

interface MatchHeaderProps {
  match: MatchWithTeams;
  className?: string;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({ match, className = '' }) => {
  const matchDate = new Date(match.match_date);

  return (
    <CardHeader className={`pb-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-sm">
          {match.description || match.season?.season_name || ''}
        </Badge>
        <div className="text-sm text-gray-500">
          {format(matchDate, 'M월 d일 (EEE)', { locale: ko })}
        </div>
      </div>
    </CardHeader>
  );
};

export default MatchHeader;
