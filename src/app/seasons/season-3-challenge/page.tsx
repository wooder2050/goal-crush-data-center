'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Season3ChallengeResults } from '@/features/matches';

export default function Season3ChallengePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="pt-6 pb-4">
          <Link href="/seasons">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              시즌 목록으로 돌아가기
            </Button>
          </Link>
        </div>
        <Season3ChallengeResults />
      </div>
    </main>
  );
}
