'use client';

import { SignedIn, useUser } from '@clerk/nextjs';

import { NavItem } from '@/components/ui/header';
import { useUserProfile } from '@/hooks/useUserProfile';
import { isAdminFromProfile } from '@/lib/admin';

export default function AdminNavItemClient() {
  const { user, isLoaded } = useUser();
  const { data: profileData, isLoading } = useUserProfile();

  // 사용자가 로그인하지 않았거나 로딩 중이면 렌더링하지 않음
  if (!isLoaded || !user || isLoading) {
    return null;
  }

  // 관리자가 아니면 렌더링하지 않음
  if (!isAdminFromProfile(profileData?.user)) {
    return null;
  }

  return (
    <SignedIn>
      <NavItem href="/admin/matches">관리자</NavItem>
    </SignedIn>
  );
}
