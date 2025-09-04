'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Section } from '@/components/ui';
import { createPlayerRating } from '@/features/player-ratings/api';
import { PlayerRatingForm } from '@/features/player-ratings/components/PlayerRatingForm';
import type { CreateRatingRequest } from '@/features/player-ratings/types';
import { useGoalMutation } from '@/hooks/useGoalMutation';

interface PageProps {
  params: {
    playerId: string;
  };
}

export default function PlayerRatePage({ params }: PageProps) {
  const router = useRouter();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const playerId = parseInt(params.playerId);

  // 평가 제출 Mutation
  const ratingMutation = useGoalMutation(createPlayerRating, {
    onSuccess: () => {
      setSubmitSuccess(true);

      // 3초 후 선수 페이지로 리다이렉트
      setTimeout(() => {
        router.push(`/players/${playerId}`);
      }, 3000);
    },
    onError: (error) => {
      console.error('Error submitting rating:', error);
      alert(error.message || '평가 제출에 실패했습니다.');
    },
  });

  const handleSubmitRating = (ratingData: CreateRatingRequest) => {
    ratingMutation.mutate(ratingData);
  };

  if (isNaN(playerId)) {
    return (
      <Section padding="sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            잘못된 선수 ID
          </h1>
          <Button onClick={() => router.back()}>이전으로 돌아가기</Button>
        </div>
      </Section>
    );
  }

  if (submitSuccess) {
    return (
      <Section padding="sm">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            평가가 성공적으로 제출되었습니다!
          </h1>
          <p className="text-gray-600 mb-6">
            다른 사용자들이 회원님의 평가를 확인할 수 있습니다.
          </p>
          <div className="text-sm text-gray-500">
            3초 후 선수 페이지로 이동합니다...
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section padding="sm">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← 이전으로 돌아가기
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              선수 능력치 평가
            </h1>
            <p className="text-gray-600">
              선수의 경기력을 다양한 관점에서 평가해보세요
            </p>
          </div>
        </div>

        <PlayerRatingForm
          playerId={playerId}
          onSubmit={handleSubmitRating}
          isLoading={ratingMutation.isPending}
        />

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">평가 가이드</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 1-30: 아마추어 수준</li>
            <li>• 31-50: 세미프로/하위 리그 수준</li>
            <li>• 51-70: 프로 리그 평균 수준</li>
            <li>• 71-85: 리그 상위권 수준</li>
            <li>• 86-99: 월드클래스 수준</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
