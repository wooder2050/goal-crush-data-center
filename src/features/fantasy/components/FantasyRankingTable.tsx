'use client';

import { Award, Medal, TrendingUp, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RankingUser {
  korean_nickname: string;
  display_name?: string | null;
  profile_image_url?: string | null;
}

interface RankingTeam {
  team_name?: string | null;
  player_selections: Array<{
    player: {
      name: string;
      profile_image_url?: string | null;
    };
    points_earned: number;
  }>;
}

interface RankingEntry {
  ranking_id?: number;
  fantasy_team_id: number;
  rank_position: number;
  total_points: number;
  user: RankingUser;
  fantasy_team?: RankingTeam;
}

interface FantasyRankingTableProps {
  rankings: RankingEntry[];
  currentUserId?: string;
  title?: string;
  showTopPlayers?: boolean;
  className?: string;
}

export default function FantasyRankingTable({
  rankings,
  currentUserId,
  title = '판타지 랭킹',
  showTopPlayers = true,
  className = '',
}: FantasyRankingTableProps) {
  const router = useRouter();
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-semibold text-gray-600">
            {position}
          </span>
        );
    }
  };

  const getRankBadge = (position: number) => {
    if (position === 1) return 'gold';
    if (position === 2) return 'silver';
    if (position === 3) return 'bronze';
    if (position <= 10) return 'top10';
    return 'default';
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'gold':
        return 'default';
      case 'silver':
        return 'secondary';
      case 'bronze':
        return 'outline';
      case 'top10':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getBadgeClassName = (badge: string) => {
    switch (badge) {
      case 'gold':
        return 'bg-yellow-500 text-white border-yellow-500';
      case 'silver':
        return 'bg-gray-400 text-white border-gray-400';
      case 'bronze':
        return 'bg-amber-600 text-white border-amber-600';
      case 'top10':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return '';
    }
  };

  const handleTeamClick = (teamId: number) => {
    router.push(`/fantasy/team/${teamId}`);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full divide-y divide-gray-200">
            {rankings.map((entry) => {
              const isCurrentUser =
                currentUserId &&
                entry.user &&
                'user_id' in entry.user &&
                (entry.user as { user_id: string }).user_id === currentUserId;
              const rankBadge = getRankBadge(entry.rank_position);
              const topPlayers = showTopPlayers
                ? entry.fantasy_team?.player_selections
                    ?.sort((a, b) => b.points_earned - a.points_earned)
                    ?.slice(0, 3) || []
                : [];

              return (
                <div
                  key={entry.fantasy_team_id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    isCurrentUser
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : ''
                  }`}
                  onClick={() => handleTeamClick(entry.fantasy_team_id)}
                >
                  <div className="flex items-center justify-between">
                    {/* 순위와 사용자 정보 */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* 순위 아이콘 */}
                      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                        {getRankIcon(entry.rank_position)}
                      </div>

                      {/* 사용자 프로필 */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {entry.user.profile_image_url ? (
                            <Image
                              src={entry.user.profile_image_url}
                              alt={entry.user.korean_nickname}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-gray-600">
                              {entry.user.korean_nickname.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {entry.user.display_name ||
                                entry.user.korean_nickname}
                            </h3>
                            {isCurrentUser && (
                              <Badge variant="outline" className="text-xs">
                                나
                              </Badge>
                            )}
                          </div>

                          {entry.fantasy_team?.team_name && (
                            <p className="text-sm text-gray-600 truncate">
                              {entry.fantasy_team.team_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 상위 선수들 (모바일에서는 숨김) */}
                    {showTopPlayers && topPlayers.length > 0 && (
                      <div className="hidden md:flex items-center space-x-2 mx-4">
                        {topPlayers.map((selection, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1"
                          >
                            {selection.player.profile_image_url && (
                              <div className="w-6 h-6 rounded-full overflow-hidden">
                                <Image
                                  src={selection.player.profile_image_url}
                                  alt={selection.player.name}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <span className="text-xs text-gray-700 font-medium">
                              {selection.player.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {selection.points_earned}pt
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 총점 */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-900 inline">
                          {entry.total_points}
                          <span className="text-xs text-gray-500 ml-1">점</span>
                        </div>
                      </div>

                      {/* 순위 배지 */}
                      {entry.rank_position <= 10 && (
                        <Badge
                          variant={getBadgeVariant(rankBadge)}
                          className={`${getBadgeClassName(rankBadge)} text-xs`}
                        >
                          {entry.rank_position <= 3
                            ? `${entry.rank_position}위`
                            : 'TOP 10'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 모바일용 상위 선수들 */}
                  {showTopPlayers && topPlayers.length > 0 && (
                    <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {topPlayers.map((selection, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1"
                          >
                            <span className="text-xs text-gray-700 font-medium">
                              {selection.player.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {selection.points_earned}pt
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {rankings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            아직 참여한 팀이 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
