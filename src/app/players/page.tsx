import type { Metadata } from 'next';

import { PlayersPage } from '@/features/players';

export const metadata: Metadata = {
  title: '선수',
  description: '골 때리는 그녀들 선수 정보 및 시즌별 기록',
  alternates: { canonical: '/players' },
};

export default function Page() {
  return <PlayersPage />;
}
