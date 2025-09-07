'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import FantasyTeamBuilder from '@/features/fantasy/components/FantasyTeamBuilder';

interface Player {
  player_id: number;
  name: string;
  profile_image_url?: string;
  jersey_number?: number;
  current_team?: {
    team_id: number;
    team_name: string;
    logo?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  season_stats?: {
    goals: number;
    assists: number;
    matches_played: number;
  };
}

interface FantasySeason {
  fantasy_season_id: number;
  year: number;
  month: number;
  lock_date: string;
  season: {
    season_name: string;
  };
}

interface CreateTeamClientProps {
  seasonId: number;
  fantasySeason: FantasySeason;
  availablePlayers: Player[];
  recommendedPlayers: Player[];
  initialSelectedPlayers?: Player[];
  initialTeamName?: string;
  isLocked: boolean;
}

export default function CreateTeamClient({
  seasonId,
  fantasySeason,
  availablePlayers,
  recommendedPlayers,
  initialSelectedPlayers = [],
  initialTeamName = '',
  isLocked,
}: CreateTeamClientProps) {
  const formatMonthYear = (year: number, month: number) => {
    return `${year}년 ${month}월`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/fantasy">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            판타지 팀 만들기
          </h1>
          <p className="text-gray-600">
            {formatMonthYear(fantasySeason.year, fantasySeason.month)} •{' '}
            {fantasySeason.season.season_name}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            5명의 선수를 선택하여 새로운 팀을 구성하세요. 같은 팀에서 최대
            2명까지 선택할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 팀 빌더 */}
      <FantasyTeamBuilder
        fantasySeasonId={seasonId}
        availablePlayers={availablePlayers}
        recommendedPlayers={recommendedPlayers}
        initialSelectedPlayers={initialSelectedPlayers}
        initialTeamName={initialTeamName}
        mode="create"
        isLocked={isLocked}
      />
    </div>
  );
}
