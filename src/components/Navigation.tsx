'use client';

import { useUser } from '@clerk/nextjs';

import { NavItem } from '@/components/ui/header';

interface NavigationProps {
  navItems: ReadonlyArray<{
    href: string;
    label: string;
    requireAuth: boolean;
  }>;
}

export function Navigation({ navItems }: NavigationProps) {
  const { isSignedIn } = useUser();

  return (
    <>
      {navItems.map((item) => {
        // 로그인이 필요한 메뉴인데 로그인하지 않은 경우 숨김
        if (item.requireAuth && !isSignedIn) {
          return null;
        }

        return (
          <NavItem key={item.href} href={item.href}>
            {item.label}
          </NavItem>
        );
      })}
    </>
  );
}
