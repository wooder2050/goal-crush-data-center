import './globals.css';

import type { Metadata } from 'next';

import { Header, NavItem } from '@/components/ui/header';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: '골 때리는 그녀들 데이터 센터',
  description: '골 때리는 그녀들 데이터 관리 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <Header>
          <NavItem href="/">홈</NavItem>
          <NavItem href="/seasons">시즌</NavItem>
          <NavItem href="/teams">팀</NavItem>
          <NavItem href="/players">선수</NavItem>
        </Header>
        <div className="pt-24 md:pt-28">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
