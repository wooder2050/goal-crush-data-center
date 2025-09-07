'use client';

import { Users, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export default function FantasyTeamsSkeleton() {
  return (
    <Container className="py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* 게임 규칙 안내 */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900">
            <Zap className="w-5 h-5" />
            <span>게임 방법</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">팀 편성</h4>
              <ul className="space-y-1 text-blue-800">
                <li>• 매달 첫째 주에 5명의 선수 선택</li>
                <li>• 같은 팀에서 최대 2명까지</li>
                <li>• 둘째 주부터 변경 불가</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">점수 획득</h4>
              <ul className="space-y-1 text-blue-800">
                <li>• 골: +4점, 어시스트: +2점</li>
                <li>• 출전: +2점, 선발: +1점 추가</li>
                <li>• 무실점(수비진): +3점</li>
                <li>• 옐로카드: -1점, 레드카드: -2점</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 활성 시즌들 스켈레톤 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">현재 시즌</h2>
        <div className="grid gap-6">
          {/* 시즌 카드 스켈레톤 */}
          {[1, 2].map((index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                      <Badge variant="outline">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </Badge>
                    </div>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button disabled className="w-32">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </Button>
                    <Button variant="outline" disabled className="w-32">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </Button>
                  </div>
                </div>

                {/* 사용자 팀 미리보기 스켈레톤 */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    <Badge variant="outline">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((playerIndex) => (
                      <div
                        key={playerIndex}
                        className="flex items-center space-x-1 bg-white rounded px-2 py-1 text-sm"
                      >
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 지난 시즌 기록 스켈레톤 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">지난 시즌 기록</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="opacity-75">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="text-right">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                    <Badge variant="outline" className="text-xs">
                      <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
