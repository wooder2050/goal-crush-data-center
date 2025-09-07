import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export default function MyTeamSkeleton() {
  return (
    <Container className="py-8">
      {/* 헤더 스켈레톤 */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="h-9 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 경기장 배치 스켈레톤 */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg">
              {/* 헤더 */}
              <div className="text-center mb-6">
                <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-1 animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>

              {/* 경기장 */}
              <div className="max-w-2xl mx-auto">
                <div className="h-96 bg-green-50 border-2 border-green-200 rounded-lg relative p-4">
                  {/* 선수 위치들 */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="absolute top-20 left-1/4 transform -translate-x-1/2">
                    <div className="w-16 h-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="absolute top-20 right-1/4 transform translate-x-1/2">
                    <div className="w-16 h-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <div className="h-3 w-32 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 팀 구성 통계 스켈레톤 */}
        <Card>
          <CardHeader>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 팀별 구성 */}
              <div>
                <div className="h-5 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 통계 요약 */}
              <div>
                <div className="h-5 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
