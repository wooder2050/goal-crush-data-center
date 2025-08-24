'use client';

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { Calendar, Heart, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { MySupportsTab } from '@/components/MySupportsTab';
import {
  MySupportsSkeleton,
  SupportPageSkeleton,
  UpcomingMatchesSkeleton,
} from '@/components/skeletons/SupportPageSkeleton';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  const { isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('upcoming');

  if (!isLoaded) {
    return (
      <GoalWrapper>
        <Section>
          <SupportPageSkeleton />
        </Section>
      </GoalWrapper>
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

          <SignedOut>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  로그인이 필요합니다
                </CardTitle>
                <CardDescription>
                  경기를 응원하려면 로그인해주세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/sign-in">
                  <Button>로그인하기</Button>
                </Link>
              </CardContent>
            </Card>
          </SignedOut>

          <SignedIn>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="upcoming"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  다가오는 경기
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
          </SignedIn>
        </Container>
      </Section>
    </GoalWrapper>
  );
}
