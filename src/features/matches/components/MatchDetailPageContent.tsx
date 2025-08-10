'use client';

import React from 'react';

import { useResolvedPathParams } from '@/common/path-params/client';
import { Section } from '@/components/ui';
import MatchCard from '@/features/matches/components/MatchCard/MatchCard';

export default function MatchDetailPageContent() {
  const [matchIdParam] = useResolvedPathParams('matchId');
  const matchId = Number(matchIdParam);

  return (
    <main className="min-h-screen bg-white">
      <Section padding="sm">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">경기 상세</h1>
          {!Number.isFinite(matchId) ? (
            <div className="rounded-md border p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-6 w-40 rounded bg-gray-200" />
                <div className="h-24 rounded bg-gray-100" />
              </div>
            </div>
          ) : (
            <MatchCard matchId={matchId} />
          )}
        </div>
      </Section>
    </main>
  );
}
