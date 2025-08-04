'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button, Section } from '@/components/ui';
import { Season5ChallengeResults } from '@/features/matches';

export default function Season5ChallengePage() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="lg">
        <div className="mb-6">
          <Link href="/seasons">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              시즌 목록으로 돌아가기
            </Button>
          </Link>
        </div>
        <Season5ChallengeResults />
      </Section>
    </main>
  );
}
