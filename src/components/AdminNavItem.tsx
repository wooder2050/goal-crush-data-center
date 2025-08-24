'use client';

import dynamic from 'next/dynamic';

// 동적 임포트로 클라이언트에서만 로드되도록 보장
const AdminNavItemClient = dynamic(() => import('./AdminNavItemClient'), {
  ssr: false,
  loading: () => null,
});

export function AdminNavItem() {
  return <AdminNavItemClient />;
}
