import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';

export function UpcomingMatchesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </div>
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 팀 대결 정보 스켈레톤 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                </div>
              </div>
              <div className="text-center">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-8 mx-auto" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="space-y-1 text-right">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            {/* 응원 버튼 스켈레톤 */}
            <div className="border-t pt-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto" />
                <div className="flex space-x-2">
                  <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MySupportsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
            </div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            </div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SupportPageSkeleton() {
  return (
    <Container className="max-w-4xl">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-4" />
        <div className="h-5 bg-gray-200 rounded animate-pulse w-96 mx-auto" />
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            다가오는 경기
          </TabsTrigger>
          <TabsTrigger value="my-supports" className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />내 응원
            현황
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
            <UpcomingMatchesSkeleton />
          </div>
        </TabsContent>

        <TabsContent value="my-supports" className="space-y-6">
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
            <MySupportsSkeleton />
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
