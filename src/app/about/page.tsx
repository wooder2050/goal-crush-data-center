import type { Metadata } from 'next';

import { AboutPage } from '@/features/about';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '소개',
  description:
    '골크러쉬 데이터센터 소개 및 이용 가이드 - 골 때리는 그녀들 공식 데이터 아카이브 활용법',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <AboutPage />;
}
