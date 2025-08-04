'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button, Section } from '@/components/ui';
import Season1Results from '@/features/matches/components/Season1Results';

export default function Season1Page() {
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
        <Season1Results />
      </Section>
    </main>
  );
}
