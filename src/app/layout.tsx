import './globals.css';

import type { Metadata } from 'next';
import Script from 'next/script';

import { Header, NavItem } from '@/components/ui/header';
import { Providers } from '@/lib/providers';

import ScrollToTopOnRouteChange from './ScrollToTopOnRouteChange';

export const metadata: Metadata = {
  metadataBase: new URL('https://goal-crush-data-center.vercel.app'),
  title: {
    default: '골 때리는 그녀들 데이터 센터',
    template: '%s | 골때녀 데이터 센터',
  },
  description:
    '골 때리는 그녀들 경기/선수/팀 데이터를 구조화하여 빠르게 탐색할 수 있는 데이터 아카이브',
  applicationName: 'Goal Crush Data Center',
  keywords: ['골때리는 그녀들', '데이터 센터', '시즌', '선수', '팀', '통계'],
  other: {
    'google-adsense-account': 'ca-pub-6439388251426570',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '골 때리는 그녀들 데이터 센터',
    title: '골 때리는 그녀들 데이터 센터',
    description:
      '골 때리는 그녀들 경기/선수/팀 데이터를 구조화하여 빠르게 탐색할 수 있는 데이터 아카이브',
    url: 'https://goal-crush-data-center.vercel.app',
    images: [
      {
        url: 'https://ppqctvmpsmlagsmmmdee.supabase.co/storage/v1/object/sign/playerprofile/mwE1721003437663.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZWM2YjcyNS1hYWJjLTQzOGUtODkzMi00NDU1ZmM1ZGEyY2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF5ZXJwcm9maWxlL213RTE3MjEwMDM0Mzc2NjMuanBnIiwiaWF0IjoxNzU1MTY2Njk5LCJleHAiOjIwNzA1MjY2OTl9.c0a4K6VimPMfItbZq1rjL5TEWhcC_319UMgLRRSj9sI',
        width: 1200,
        height: 630,
        alt: '골 때리는 그녀들 데이터 센터',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '골 때리는 그녀들 데이터 센터',
    description:
      '골 때리는 그녀들 경기/선수/팀 데이터를 구조화하여 빠르게 탐색할 수 있는 데이터 아카이브',
    images: [
      'https://ppqctvmpsmlagsmmmdee.supabase.co/storage/v1/object/sign/playerprofile/mwE1721003437663.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZWM2YjcyNS1hYWJjLTQzOGUtODkzMi00NDU1ZmM1ZGEyY2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF5ZXJwcm9maWxlL213RTE3MjEwMDM0Mzc2NjMuanBnIiwiaWF0IjoxNzU1MTY2Njk5LCJleHAiOjIwNzA1MjY2OTl9.c0a4K6VimPMfItbZq1rjL5TEWhcC_319UMgLRRSj9sI',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        {/* Google Analytics (gtag.js) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}

        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID || ''}');
          `}
        </Script>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || ''}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <Header>
          <NavItem href="/">홈</NavItem>
          <NavItem href="/seasons">시즌</NavItem>
          <NavItem href="/teams">팀</NavItem>
          <NavItem href="/players">선수</NavItem>
          <NavItem href="/coaches">감독</NavItem>
        </Header>
        <div className="pt-24 md:pt-28">
          <Providers>
            <ScrollToTopOnRouteChange />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
