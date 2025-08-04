'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button, Section } from '@/components/ui';
import { SbsCup2Results } from '@/features/matches';

export default function SbsCup2Page() {
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
        <SbsCup2Results />
      </Section>
    </main>
  );
}
