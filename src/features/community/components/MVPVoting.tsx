'use client';

import { BarChart3, Trophy, Vote } from 'lucide-react';
import { useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoalMutation } from '@/hooks/useGoalMutation';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import { MVPVoteResult } from '@/types/community';

import { getCurrentMVPVoting, getMVPVotingResults, voteForMVP } from '../api';

function MVPVotingContent() {
  const { user } = useAuth();
  const { data: mvpData } = useGoalSuspenseQuery(getCurrentMVPVoting, []);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVoteResults, setShowVoteResults] = useState(false);

  // MVP 투표 결과 조회 (투표 현황을 보여달라고 요청했을 때만)
  const { data: voteResults } = useGoalSuspenseQuery(
    getMVPVotingResults,
    showVoteResults && mvpData?.season_id ? [mvpData.season_id] : [0]
  );
  // MVP 투표 뮤테이션
  const voteMutation = useGoalMutation(voteForMVP, {
    onSuccess: () => {
      // 성공시 페이지 새로고침
      window.location.reload();
    },
    onError: (error) => {
      console.error('MVP 투표 실패:', error);
      alert('투표에 실패했습니다. 다시 시도해주세요.');
    },
  });

  if (!mvpData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            시즌 MVP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            현재 진행 중인 시즌이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  // MVP 데이터가 없으면 빈 배열 반환
  if (!mvpData.match_mvps || mvpData.match_mvps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {mvpData.season_name} MVP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            아직 완료된 경기가 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  // 같은 선수 중복 제거하고 골/어시스트 순으로 정렬하여 상위 5명만 표시
  const uniqueMVPs = mvpData.match_mvps.reduce(
    (acc, matchMVP) => {
      const existingMVP = acc.find(
        (mvp) => mvp.player_id === matchMVP.mvp.player_id
      );

      if (existingMVP) {
        // 이미 존재하는 선수는 MVP 횟수만 증가
        existingMVP.mvp_count += 1;
      } else {
        // 새로운 선수 추가
        acc.push({
          player_id: matchMVP.mvp.player_id,
          name: matchMVP.mvp.name,
          profile_image_url: matchMVP.mvp.profile_image_url,
          jersey_number: matchMVP.mvp.jersey_number,
          team_name: matchMVP.winning_team.team_name,
          goals: matchMVP.mvp.goals,
          assists: matchMVP.mvp.assists,
          mvp_count: 1,
        });
      }
      return acc;
    },
    [] as Array<{
      player_id: number;
      name: string;
      profile_image_url: string | null;
      jersey_number: number | null;
      team_name: string | null;
      goals: number;
      assists: number;
      mvp_count: number;
    }>
  );

  // 골 수 > 어시스트 수 순으로 정렬하고 상위 5명만 선택
  const top5MVPs = uniqueMVPs
    .sort((a, b) => {
      if (a.goals !== b.goals) return b.goals - a.goals; // 골 수 내림차순
      return b.assists - a.assists; // 어시스트 수 내림차순
    })
    .slice(0, 5); // 상위 5명만 선택

  const handleVote = () => {
    if (!selectedPlayer || !user) return;

    voteMutation.mutate({
      player_id: selectedPlayer,
      season_id: mvpData.season_id,
      vote_type: 'season',
    });
  };

  const hasVoted = !!mvpData.user_voted_player_id;

  // 이미 투표한 경우 투표 결과를 자동으로 표시
  if (hasVoted && !showVoteResults) {
    setShowVoteResults(true);
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-0 sm:pb-0">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {mvpData.season_name} MVP 투표
          </CardTitle>
          <div className="text-sm text-gray-600">
            총 {mvpData.total_matches}경기 • 상위 {top5MVPs.length}명의 MVP 후보
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ※ MVP는 경기에서 이긴 팀의 선수만 받을 수 있습니다
          </div>
        </CardHeader>
        <CardContent>
          {/* 투표하지 않은 경우에만 선수 선택 UI 표시 */}
          {!hasVoted && (
            <>
              <div className="space-y-3">
                {top5MVPs.map((mvp, index) => (
                  <div
                    key={mvp.player_id}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPlayer === mvp.player_id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlayer(mvp.player_id)}
                  >
                    <div className="flex items-center space-x-3">
                      {/* 순위 */}
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>

                      {/* 선수 정보 */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {mvp.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-500">
                                {mvp.team_name}
                                {mvp.jersey_number !== null &&
                                  mvp.jersey_number !== undefined &&
                                  ` • ${mvp.jersey_number}번`}
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                🏆 승리팀
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-yellow-600">
                              {mvp.mvp_count}회 MVP
                            </div>
                            <div className="text-xs text-gray-500">
                              시즌: {mvp.goals}골 • {mvp.assists}도움
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 투표하지 않은 경우에만 투표 관련 UI 표시 */}
          {!hasVoted && (
            <>
              {/* 투표 버튼 */}
              {user && (
                <div className="mt-6">
                  <Button
                    onClick={handleVote}
                    disabled={!selectedPlayer || voteMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    <Vote className="w-4 h-4 mr-2" />
                    {voteMutation.isPending
                      ? '투표 중...'
                      : selectedPlayer
                        ? 'MVP 투표하기'
                        : '선수를 선택해주세요'}
                  </Button>
                </div>
              )}

              {/* 로그인이 필요한 경우 */}
              {!user && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-gray-600 font-medium mb-2">
                      MVP 투표를 하려면 로그인이 필요합니다
                    </div>
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      variant="outline"
                      size="sm"
                    >
                      로그인하기
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 이미 투표한 경우 */}
          {user && hasVoted && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center">
                <div className="text-green-600 font-medium mb-2">
                  이미 MVP 투표를 완료했습니다!
                </div>
                <div className="text-sm text-green-500">
                  투표한 선수:{' '}
                  {
                    top5MVPs.find(
                      (mvp) => mvp.player_id === mvpData.user_voted_player_id
                    )?.name
                  }
                </div>
              </div>
            </div>
          )}

          {/* 투표 결과 보기/숨기기 버튼 (투표하지 않은 경우에만) */}
          {!hasVoted && (
            <div className="mt-4">
              <Button
                onClick={() => setShowVoteResults(!showVoteResults)}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showVoteResults ? '투표 결과 숨기기' : '투표 현황 보기'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MVP 투표 결과 */}
      {showVoteResults && voteResults && (
        <Card className="mt-4">
          <CardHeader className="pb-0 sm:pb-0">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              MVP 투표 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {voteResults.map((result: MVPVoteResult, index: number) => {
                const totalVotes = voteResults.reduce(
                  (sum: number, r: MVPVoteResult) => sum + r.votes_count,
                  0
                );
                const votePercentage =
                  totalVotes > 0 ? (result.votes_count / totalVotes) * 100 : 0;

                return (
                  <div key={result.player_id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {result.player_name}
                          </h4>
                          <div className="text-sm text-gray-500">
                            {result.team_name}
                            {result.jersey_number &&
                              ` • ${result.jersey_number}번`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {result.votes_count}표
                        </div>
                        <div className="text-sm text-gray-500">
                          {votePercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* 투표율 바 */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(votePercentage, 2)}%` }}
                      />
                    </div>

                    {/* 선수 스탯 */}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>
                        시즌: {result.goals}골 • {result.assists}도움
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {voteResults.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                아직 투표가 없습니다.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 인증 모달 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl="/community"
      />
    </>
  );
}

function MVPVotingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </CardTitle>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="p-3 border-2 border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-green-200 rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MVPVoting() {
  return (
    <GoalWrapper fallback={<MVPVotingSkeleton />}>
      <MVPVotingContent />
    </GoalWrapper>
  );
}
