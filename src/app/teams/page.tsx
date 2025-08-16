import type { Metadata } from 'next';

import TeamsPageClient from './TeamsPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '팀',
  description: '골 때리는 그녀들 팀 목록 및 스쿼드/성적',
  alternates: { canonical: '/teams' },
};

export default function TeamsPage() {
  return <TeamsPageClient />;
}
