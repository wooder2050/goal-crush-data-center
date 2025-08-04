import './globals.css';

import type { Metadata } from 'next';

import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: '골 크러시 데이터 센터',
  description: '골때리는 그녀들 데이터 관리 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
