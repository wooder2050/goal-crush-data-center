'use client';

import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Heart, MessageCircle, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  type MatchSupportStats,
  useCancelSupport,
  useCreateSupport,
  useMatchSupportStats,
  useUserMatchSupport,
} from '@/hooks/useMatchSupport';
import { shortenSeasonName } from '@/lib/utils';

import { SupportMessagesList } from './SupportMessagesList';

interface SupportMatchCardProps {
  match: MatchSupportStats['match'];
}

export function SupportMatchCard({ match }: SupportMatchCardProps) {
  const queryClient = useQueryClient();
  const userSupportData = useUserMatchSupport(match.match_id);
  const statsData = useMatchSupportStats(match.match_id);
  const createSupport = useCreateSupport();
  const cancelSupport = useCancelSupport();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [supportMessage, setSupportMessage] = useState('');

  const userSupport = userSupportData.data.support;
  const stats = statsData.data.statistics;

  const isMatchStarted = () => {
    const now = new Date();
    const matchDate = new Date(match.match_date);
    return matchDate < now && match.status !== 'scheduled';
  };

  const handleSupportTeam = (teamId: number) => {
    if (isMatchStarted()) {
      alert('경기가 이미 시작되어 응원할 수 없습니다.');
      return;
    }
    setSelectedTeamId(teamId);
    setIsDialogOpen(true);
  };

  const handleSubmitSupport = async () => {
    if (!selectedTeamId) return;

    try {
      await createSupport.mutateAsync({
        matchId: match.match_id,
        teamId: selectedTeamId,
        supportType: 'cheer',
        message: supportMessage.trim() || undefined,
      });

      // 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['userMatchSupport'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['matchSupportStats'],
      });

      setIsDialogOpen(false);
      setSupportMessage('');
      setSelectedTeamId(null);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : '응원 등록에 실패했습니다.'
      );
    }
  };

  const handleCancelSupport = async () => {
    if (!userSupport) return;

    if (isMatchStarted()) {
      alert('경기가 이미 시작되어 응원을 취소할 수 없습니다.');
      return;
    }

    try {
      await cancelSupport.mutateAsync({
        matchId: match.match_id,
      });

      // 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['userMatchSupport'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['matchSupportStats'],
      });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : '응원 취소에 실패했습니다.'
      );
    }
  };

  const getTeamName = (teamId: number) => {
    if (teamId === match.home_team?.team_id) return match.home_team.team_name;
    if (teamId === match.away_team?.team_id) return match.away_team.team_name;
    return '알 수 없는 팀';
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {format(new Date(match.match_date), 'M월 d일 (E)', {
                  locale: ko,
                })}
              </CardTitle>
              <CardDescription>
                {format(new Date(match.match_date), 'HH:mm')} ·{' '}
                <Badge
                  variant={
                    match.status === 'scheduled' ? 'default' : 'secondary'
                  }
                >
                  {match.status === 'scheduled'
                    ? '예정'
                    : match.status === 'live'
                      ? '진행중'
                      : '종료'}
                </Badge>
              </CardDescription>
            </div>
            {match.description && (
              <div className="text-right">
                <p className="text-xs text-gray-600 max-w-32 truncate">
                  {shortenSeasonName(match.description)}
                </p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 팀 대결 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                {match.home_team?.logo ? (
                  <Image
                    src={match.home_team.logo}
                    alt={`${match.home_team.team_name} 로고`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                    {match.home_team?.team_name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {match.home_team?.team_name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">홈</p>
              </div>
            </div>

            <div className="text-center px-2 sm:px-4 flex-shrink-0">
              <p className="text-lg sm:text-2xl font-bold">VS</p>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0 justify-end">
              <div className="text-right min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {match.away_team?.team_name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">어웨이</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                {match.away_team?.logo ? (
                  <Image
                    src={match.away_team.logo}
                    alt={`${match.away_team.team_name} 로고`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                    {match.away_team?.team_name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 응원 통계 */}
          {stats && stats.total_supports > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>응원 현황</span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {stats.total_supports}명
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm gap-2">
                  <span className="truncate flex-1">
                    {match.home_team?.team_name}
                  </span>
                  <span className="flex-shrink-0">
                    {stats.home_team_supports}명
                  </span>
                </div>
                <Progress value={stats.home_team_percentage} className="h-2" />
                <div className="flex justify-between text-sm gap-2">
                  <span className="truncate flex-1">
                    {match.away_team?.team_name}
                  </span>
                  <span className="flex-shrink-0">
                    {stats.away_team_supports}명
                  </span>
                </div>
                <Progress value={stats.away_team_percentage} className="h-2" />
              </div>
            </div>
          )}

          {/* 사용자 응원 상태 */}
          <div className="border-t pt-4">
            {userSupport ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                    <span className="text-sm font-medium">
                      {getTeamName(userSupport.team_id)} 응원 중
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelSupport}
                    disabled={cancelSupport.isPending || isMatchStarted()}
                  >
                    취소
                  </Button>
                </div>
                {userSupport.message && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        {userSupport.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  어느 팀을 응원하시나요?
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-sm sm:text-base"
                    onClick={() =>
                      handleSupportTeam(match.home_team?.team_id || 0)
                    }
                    disabled={
                      createSupport.isPending ||
                      isMatchStarted() ||
                      !match.home_team
                    }
                  >
                    <span className="truncate">
                      {match.home_team?.team_name} 응원
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-sm sm:text-base"
                    onClick={() =>
                      handleSupportTeam(match.away_team?.team_id || 0)
                    }
                    disabled={
                      createSupport.isPending ||
                      isMatchStarted() ||
                      !match.away_team
                    }
                  >
                    <span className="truncate">
                      {match.away_team?.team_name} 응원
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 응원 메시지 목록 */}
      <SupportMessagesList
        matchId={match.match_id}
        homeTeam={match.home_team}
        awayTeam={match.away_team}
      />

      {/* 응원 메시지 입력 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTeamId && `${getTeamName(selectedTeamId)} 응원하기`}
            </DialogTitle>
            <DialogDescription>
              응원 메시지를 남겨보세요! (선택사항)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">응원 메시지</Label>
              <Input
                id="message"
                placeholder="힘내세요! 화이팅!"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {supportMessage.length}/100자
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleSubmitSupport}
                disabled={createSupport.isPending}
                className="flex-1"
              >
                {createSupport.isPending ? '응원 중...' : '응원하기'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
