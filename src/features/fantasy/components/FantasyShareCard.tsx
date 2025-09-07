'use client';

import { Share2, Target, TrendingUp, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ShareCardPlayer {
  name: string;
  profile_image_url?: string;
  points_earned: number;
  goals?: number;
  assists?: number;
}

interface FantasyShareCardProps {
  teamName?: string;
  userName: string;
  userAvatar?: string;
  totalPoints: number;
  rankPosition: number;
  totalTeams: number;
  seasonInfo: {
    year: number;
    month: number;
    season_name: string;
  };
  topPlayers: ShareCardPlayer[];
  className?: string;
}

export default function FantasyShareCard({
  teamName,
  userName,
  userAvatar,
  totalPoints,
  rankPosition,
  totalTeams,
  seasonInfo,
  topPlayers,
  className = '',
}: FantasyShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const formatMonthYear = (year: number, month: number) => {
    return `${year}년 ${month}월`;
  };

  const getRankBadge = () => {
    if (rankPosition === 1)
      return { text: '1위', color: 'bg-yellow-500 text-white' };
    if (rankPosition === 2)
      return { text: '2위', color: 'bg-gray-400 text-white' };
    if (rankPosition === 3)
      return { text: '3위', color: 'bg-amber-600 text-white' };
    if (rankPosition <= 10)
      return { text: 'TOP 10', color: 'bg-blue-500 text-white' };
    return { text: `${rankPosition}위`, color: 'bg-gray-600 text-white' };
  };

  const rankBadge = getRankBadge();

  // 클립보드에 텍스트 복사
  const copyToClipboard = async () => {
    const text = `
🏆 ${formatMonthYear(seasonInfo.year, seasonInfo.month)} 골때리는그녀들 판타지 축구 결과

👤 ${userName}${teamName ? ` (${teamName})` : ''}
🏅 ${rankPosition}위 / ${totalTeams}팀 (${totalPoints}점)

🌟 베스트 선수:
${topPlayers
  .slice(0, 3)
  .map(
    (player, index) =>
      `${index + 1}. ${player.name} - ${player.points_earned}점`
  )
  .join('\n')}

골때리는그녀들에서 판타지 축구를 즐겨보세요!
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      toast.success('결과가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('클립보드 복사 중 오류:', error);
      toast.error('클립보드 복사 중 오류가 발생했습니다.');
    }
  };

  // 현재 URL 가져오기
  const getCurrentUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  // 공유 모달 열기 (네이버 스포츠 스타일)
  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className={className}>
      {/* 공유 가능한 카드 */}
      <Card
        ref={cardRef}
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200"
      >
        <CardContent className="p-8">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                판타지 축구 결과
              </h2>
            </div>
            <p className="text-blue-700 font-semibold">
              {formatMonthYear(seasonInfo.year, seasonInfo.month)} •{' '}
              {seasonInfo.season_name}
            </p>
          </div>

          {/* 사용자 정보 및 순위 */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {userAvatar ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={userAvatar}
                      alt={userName}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">
                      {userName.charAt(0)}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {userName}
                  </h3>
                  {teamName && <p className="text-gray-600">{teamName}</p>}
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${rankBadge.color}`}
                >
                  {rankBadge.text}
                </div>
                <p className="text-sm text-gray-600 mt-1">{totalTeams}팀 중</p>
              </div>
            </div>

            {/* 총점 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {totalPoints}
              </div>
              <p className="text-gray-600">총 획득 점수</p>
            </div>
          </div>

          {/* 베스트 선수들 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>베스트 선수</span>
            </h4>

            <div className="space-y-3">
              {topPlayers.slice(0, 3).map((player, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>

                    {player.profile_image_url ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={player.profile_image_url}
                          alt={player.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {player.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-gray-900">
                        {player.name}
                      </p>
                      {(player.goals || player.assists) && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          {(player.goals || 0) > 0 && (
                            <span className="flex items-center space-x-1">
                              <Target className="w-3 h-3" />
                              <span>{player.goals}골</span>
                            </span>
                          )}
                          {(player.assists || 0) > 0 && (
                            <span className="flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{player.assists}도움</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Badge variant="outline" className="font-bold">
                    {player.points_earned}점
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 브랜딩 */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">골때리는그녀들 판타지 축구</p>
          </div>
        </CardContent>
      </Card>

      {/* 공유 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button onClick={openShareModal} className="flex-1" size="lg">
          <Share2 className="w-4 h-4 mr-2" />
          공유하기
        </Button>
      </div>

      {/* 공유하기 모달 */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              공유하기
            </DialogTitle>
          </DialogHeader>

          {/* URL 표시 및 복사 */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
              <input
                type="text"
                value={getCurrentUrl()}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
              />
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
              >
                복사
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
