import type { Metadata } from 'next';

import { SeasonsPage } from '@/features/seasons';

export const metadata: Metadata = {
  title: '시즌',
  description: '골 때리는 그녀들 시즌별 경기 및 순위',
  alternates: { canonical: '/seasons' },
};

export default function Page() {
  return <SeasonsPage />;
}
