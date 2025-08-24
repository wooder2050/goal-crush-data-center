import { UserProfile } from '@/hooks/useUserProfile';

/**
 * 클라이언트에서 사용자 프로필 기반으로 관리자 권한 확인
 */
export function isAdminFromProfile(
  userProfile: UserProfile | null | undefined
): boolean {
  if (!userProfile) return false;

  return userProfile.is_admin;
}
