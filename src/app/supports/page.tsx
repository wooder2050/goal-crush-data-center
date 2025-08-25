'use client';

import { Calendar, Heart, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { useAuth } from '@/components/AuthProvider';
import { MySupportsTab } from '@/components/MySupportsTab';
import {
  MySupportsSkeleton,
  SupportPageSkeleton,
  UpcomingMatchesSkeleton,
} from '@/components/skeletons/SupportPageSkeleton';
import {
  Button,
  Container,
  H1,
  Section,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { UpcomingMatchesTab } from '@/components/UpcomingMatchesTab';

export default function SupportsPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  if (loading) {
    return (
      <GoalWrapper>
        <Section>
          <SupportPageSkeleton />
        </Section>
      </GoalWrapper>
    );
  }

  if (!user) {
    return (
      <Container className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-[#ff4800]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚽ 응원하기 페이지에 접근하려면 로그인이 필요합니다
            </h1>
            <p className="text-gray-600 mb-6">
              로그인하고 다가오는 경기에 응원을 보내보세요!
            </p>
          </div>
          <Link href="/sign-in?redirect_url=/supports">
            <Button className="bg-[#ff4800] hover:bg-[#e63e00] px-6 py-3">
              <Heart className="w-4 h-4 mr-2" />
              로그인하고 응원하기
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <GoalWrapper>
      <Section>
        <Container className="max-w-4xl">
          <div className="text-center mb-8">
            <H1 className="mb-4">경기 응원하기</H1>
            <p className="text-lg text-gray-600">
              다가오는 경기에 응원을 보내고, 다른 팬들과 함께 열정을
              나누어보세요!
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                응원할 경기
              </TabsTrigger>
              <TabsTrigger
                value="my-supports"
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />내 응원 현황
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  응원할 수 있는 경기
                </h2>
                <GoalWrapper fallback={<UpcomingMatchesSkeleton />}>
                  <UpcomingMatchesTab />
                </GoalWrapper>
              </div>
            </TabsContent>

            <TabsContent value="my-supports" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">내 응원 현황</h2>
                <GoalWrapper fallback={<MySupportsSkeleton />}>
                  <MySupportsTab
                    onSwitchToUpcoming={() => setActiveTab('upcoming')}
                  />
                </GoalWrapper>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </Section>
    </GoalWrapper>
  );
}
