'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Season4PlayoffPage() {
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
        <div className="bg-white rounded shadow p-6">
          <h1 className="text-2xl font-bold mb-4">
            골때리는 그녀들 시즌 4 플레이오프
          </h1>
          <div>아직 상세 데이터가 준비되지 않았습니다.</div>
        </div>
      </div>
    </main>
  );
}
