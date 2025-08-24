'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Heart } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { useUserSupports } from '@/hooks/useMatchSupport';

interface MySupportsTabProps {
  onSwitchToUpcoming: () => void;
}

export function MySupportsTab({ onSwitchToUpcoming }: MySupportsTabProps) {
  const userSupportsData = useUserSupports();

  if (
    !userSupportsData.data.supports ||
    userSupportsData.data.supports.length === 0
  ) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            아직 응원한 경기가 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            다가오는 경기에 응원을 보내보세요!
          </p>
          <Button onClick={onSwitchToUpcoming} variant="outline">
            다가오는 경기 보기
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {userSupportsData.data.supports.map((support) => (
        <Card key={support.support_id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {support.match.home_team?.team_name} vs{' '}
                {support.match.away_team?.team_name}
              </CardTitle>
              <Badge variant="outline">
                {format(new Date(support.match.match_date), 'M월 d일', {
                  locale: ko,
                })}
              </Badge>
            </div>
            <CardDescription>
              {format(new Date(support.match.match_date), 'HH:mm')} ·{' '}
              <Badge
                variant={
                  support.match.status === 'scheduled' ? 'default' : 'secondary'
                }
              >
                {support.match.status === 'scheduled'
                  ? '예정'
                  : support.match.status === 'live'
                    ? '진행중'
                    : '종료'}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span className="font-medium text-sm">
                {support.team.team_name} 응원
              </span>
            </div>
            {support.message && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  &ldquo;{support.message}&rdquo;
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {format(new Date(support.created_at), 'M월 d일 HH:mm', {
                locale: ko,
              })}{' '}
              응원
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
