'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { useAuth } from '@/components/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import {
  type SupportMessage,
  useDeleteSupportMessage,
  useSupportMessages,
} from '@/hooks/useMatchSupport';

interface SupportMessagesListProps {
  matchId: number;
  homeTeam?: {
    team_id: number;
    team_name: string;
  } | null;
  awayTeam?: {
    team_id: number;
    team_name: string;
  } | null;
}

interface SupportMessageItemProps {
  message: SupportMessage;
  currentUserId?: string;
}

function SupportMessageItem({
  message,
  currentUserId,
}: SupportMessageItemProps) {
  const deleteMessage = useDeleteSupportMessage();

  const handleDeleteMessage = async () => {
    if (window.confirm('이 응원 메시지를 삭제하시겠습니까?')) {
      try {
        await deleteMessage.mutateAsync({ supportId: message.support_id });
      } catch (error) {
        alert(
          error instanceof Error ? error.message : '메시지 삭제에 실패했습니다.'
        );
      }
    }
  };

  const isOwnMessage = currentUserId === message.user_id;

  return (
    <div className="flex space-x-3 p-3 border-b border-gray-100 last:border-b-0">
      {/* 프로필 이미지 */}
      <div className="w-8 h-8 relative flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
        {message.profile_image ? (
          <Image
            src={message.profile_image}
            alt={`${message.user_nickname} 프로필`}
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
            {message.user_nickname.charAt(0)}
          </div>
        )}
      </div>

      {/* 메시지 내용 */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center justify-between mb-1 w-full">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="font-medium text-sm truncate">
              {message.user_nickname}
            </span>
            <Badge
              variant="outline"
              className="text-xs flex-shrink-0"
              style={{
                color: message.team.primary_color || undefined,
                borderColor: message.team.primary_color || undefined,
              }}
            >
              {message.team.team_name}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 flex-shrink-0">
              {format(new Date(message.created_at), 'MM/dd HH:mm', {
                locale: ko,
              })}
            </span>
            {isOwnMessage && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                onClick={handleDeleteMessage}
                disabled={deleteMessage.isPending}
                title="메시지 삭제"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        {message.message && (
          <p className="text-sm text-gray-700 break-words">{message.message}</p>
        )}
      </div>
    </div>
  );
}

function SupportMessagesListSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-3 p-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            </div>
          </div>
        ))}
        <div className="flex justify-center pt-4">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function SupportMessagesListContent({
  matchId,
  homeTeam,
  awayTeam,
}: SupportMessagesListProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<number | null>(
    null
  );

  const messagesData = useSupportMessages(
    matchId,
    currentPage,
    10,
    selectedTeamFilter || undefined
  );

  const { messages, pagination } = messagesData.data;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTeamFilter = (teamId: number | null) => {
    setSelectedTeamFilter(teamId);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>응원 메시지</span>
            {pagination.totalCount > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({pagination.totalCount}개)
              </span>
            )}
          </CardTitle>

          {/* 팀 필터 버튼들 */}
          <div className="flex space-x-2">
            <Button
              variant={selectedTeamFilter === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTeamFilter(null)}
            >
              전체
            </Button>
            {homeTeam && (
              <Button
                variant={
                  selectedTeamFilter === homeTeam.team_id
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() => handleTeamFilter(homeTeam.team_id)}
              >
                {homeTeam.team_name}
              </Button>
            )}
            {awayTeam && (
              <Button
                variant={
                  selectedTeamFilter === awayTeam.team_id
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() => handleTeamFilter(awayTeam.team_id)}
              >
                {awayTeam.team_name}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {selectedTeamFilter
                ? '해당 팀의 응원 메시지가 없습니다.'
                : '아직 응원 메시지가 없습니다.'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              첫 번째 응원 메시지를 남겨보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {messages.map((message) => (
              <SupportMessageItem
                key={message.support_id}
                message={message}
                currentUserId={user?.id}
              />
            ))}

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="pt-6 border-t">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SupportMessagesList(props: SupportMessagesListProps) {
  return (
    <GoalWrapper fallback={<SupportMessagesListSkeleton />}>
      <SupportMessagesListContent {...props} />
    </GoalWrapper>
  );
}
