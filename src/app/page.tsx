import type { Metadata } from 'next';

import { HomePage } from '@/features/home';

export const metadata: Metadata = {
  title: '홈',
  description: '골 때리는 그녀들 데이터 센터 홈',
  alternates: { canonical: '/' },
};

export default function Page() {
  return <HomePage />;
}
