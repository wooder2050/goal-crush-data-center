# ⚽ 골 크러시 데이터 센터 (Goal Crush Data Center)

[![Live Site](https://img.shields.io/badge/🏆-골때리는%20그녀들%20데이터센터-ff4800?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkwyMiA5TDE3IDEzLjc0TDE4LjE4IDIyTDEyIDE4LjM1TDUuODIgMjJMNyAxMy43NEwyIDlMOC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)](https://www.gtndatacenter.com/)
[![Storybook](https://img.shields.io/badge/🎨-디자인%20시스템-ff6900?style=for-the-badge&logo=storybook&logoColor=white)](https://storybook.gtndatacenter.com/)

SBS 예능 프로그램 '골때리는 그녀들'의 경기 데이터와 선수 통계를 관리하고 시각화하는 웹 애플리케이션입니다.

> **🌐 공식 서비스**: [https://www.gtndatacenter.com/](https://www.gtndatacenter.com/)

## ✨ 프로젝트 소개

이 프로젝트는 '골때리는 그녀들' 방송 내용을 기반으로, 각 시즌의 경기 결과, 선수 정보, 팀 기록 등 파편화된 데이터를 한곳에 모아 체계적으로 관리하고 분석하기 위해 시작되었습니다. 데이터에 기반한 다양한 통계와 시각화를 제공하여 프로그램을 더 깊이 있게 즐길 수 있도록 돕는 것을 목표로 하는 프로젝트입니다.

### 🏆 골때리는 그녀들 공식 데이터센터

현재 **[골때리는 그녀들 데이터센터](https://www.gtndatacenter.com/)**로 정식 서비스 중입니다.

**주요 서비스:**

- 📺 **방송 연계**: 매주 "골 때리는 그녀들"에서 다룬 경기의 상세 데이터를 실시간으로 업데이트
- 📊 **체계적 데이터**: 선수별 포지션, 득점, 어시스트부터 팀별 전적까지 모든 데이터를 구조화하여 관리
- 🏅 **현재 득점왕 TOP 5**: 이번 시즌 가장 많은 골을 넣은 선수들 실시간 랭킹
- 📅 **다가오는 경기**: 곧 펼쳐질 흥미진진한 경기 일정 제공

## 🚀 주요 기능

- **🏆 시즌별 기록 보기**: 각 시즌별 전체 경기 결과와 상세 정보를 조회할 수 있습니다.
- **👩‍⚽ 선수 정보 관리**: 선수 프로필, 시즌별 기록, 개인 통계를 상세하게 제공합니다.
- **⚽ 팀 정보 관리**: 팀 스쿼드, 시즌 성적, 우승 기록을 체계적으로 관리합니다.
- **📊 통계 분석**: 득점, 골키퍼, 팀별 통계 및 순위를 다각도로 분석합니다.
- **🎯 판타지 리그**: 선수 선택과 점수 시스템을 통한 판타지 축구 게임을 제공합니다.
- **💬 커뮤니티**: 팬들이 소통할 수 있는 커뮤니티 공간을 제공합니다.
- **🔄 실시간 업데이트**: 방송과 연계하여 경기 데이터를 실시간으로 업데이트합니다.

## 🛠️ 기술 스택

- **Frontend**: `Next.js`, `React`, `TypeScript`
- **Styling**: `Tailwind CSS`, `shadcn-ui`
- **Design System**: `Storybook` - [디자인 시스템 문서](https://storybook.gtndatacenter.com/)
- **Backend & DB**: `Supabase`, `Prisma` (PostgreSQL)
- **Deployment**: `Vercel`

## 🏁 시작하기

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

### **1. 프로젝트 복제 및 의존성 설치**

```bash
# 저장소 복제 (본인의 계정으로 포크한 주소를 사용하세요)
git clone https://github.com/your-username/goal-crush-data-center.git
cd goal-crush-data-center

# 의존성 설치
npm install
```

### **2. Supabase 설정**

이 프로젝트는 백엔드로 Supabase를 사용합니다. 로컬에서 실행하려면 본인의 Supabase 프로젝트를 연결해야 합니다.

1.  **Supabase 프로젝트 생성**: [Supabase](https://supabase.com/)에 가입하고 새로운 프로젝트를 생성합니다.
2.  **데이터베이스 스키마 설정**:
    - `supabase/migrations` 폴더에 있는 `.sql` 파일들은 이 프로젝트에 필요한 테이블과 관계를 정의합니다.
    - Supabase 대시보드의 'SQL Editor'로 이동하여, 마이그레이션 파일들의 내용을 순서대로 실행해 데이터베이스 스키마를 설정해주세요.
3.  **환경 변수 설정**:
    - 프로젝트 루트에 `.env.local` 파일을 생성합니다.
    - Supabase 대시보드의 **Settings > API** 메뉴에서 `Project URL`과 `anon` `public` 키를 복사하여 아래와 같이 파일에 추가합니다.

    ```
    NEXT_PUBLIC_SUPABASE_URL=여기에_프로젝트_URL을_붙여넣으세요
    NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_ANON_KEY를_붙여넣으세요
    ```

### **3. Prisma 설정 (새로운 API 사용 시)**

새로운 Prisma 기반 API를 사용하려면 다음 단계를 수행하세요:

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션 (필요한 경우)
npm run db:migrate
```

### **4. 개발 서버 실행**

```bash
# 메인 애플리케이션 실행
npm run dev

# Storybook 실행 (디자인 시스템)
npm run storybook
```

- **메인 앱**: `http://localhost:3000`
- **Storybook**: `http://localhost:6006`

## 🔄 API 사용법

이 프로젝트는 두 가지 API 방식을 제공합니다:

### 기존 Supabase API

- 직접 Supabase 클라이언트를 사용
- `src/features/matches/api.ts`에서 관리

### 새로운 Prisma 기반 API (권장)

- Next.js API Routes와 Prisma를 사용
- 더 나은 타입 안전성과 성능 제공
- `src/features/matches/api-prisma.ts`에서 관리
- 자세한 사용법은 `docs/prisma-api-usage.md` 참조

## 🌐 배포

### 프로덕션 환경

- **🏆 공식 사이트**: [https://www.gtndatacenter.com/](https://www.gtndatacenter.com/)
- **🎨 디자인 시스템**: [https://storybook.gtndatacenter.com/](https://storybook.gtndatacenter.com/)

### 배포 플랫폼

- **호스팅**: Vercel
- **도메인**: 커스텀 도메인 연결
- **CDN**: Vercel Edge Network
- **SSL**: 자동 SSL 인증서

### 🎨 디자인 시스템 (Storybook)

UI 컴포넌트와 디자인 가이드라인을 체계적으로 문서화한 Storybook이 배포되어 있습니다:

- **📚 컴포넌트 문서**: 모든 UI 컴포넌트의 사용법과 예시
- **🎨 디자인 토큰**: 색상, 타이포그래피, 간격 등 디자인 시스템 요소
- **⚡ 인터랙티브 예시**: 실시간으로 props를 변경하며 컴포넌트 테스트
- **♿ 접근성 가이드**: 웹 접근성 준수 사항 및 테스트 결과

> **Storybook 바로가기**: [https://storybook.gtndatacenter.com/](https://storybook.gtndatacenter.com/)

## 📝 라이선스 & 고지사항

이 프로젝트는 SBS 예능 프로그램 "골때리는 그녀들"의 팬 사이트로, **공식 사이트가 아닙니다**.

- 모든 경기 데이터와 선수 정보는 공개된 방송 내용을 기반으로 수집되었습니다.
- 상업적 목적이 아닌 팬 커뮤니티를 위한 비영리 프로젝트입니다.
- 저작권과 관련된 문제가 있을 경우 즉시 수정하겠습니다.

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📞 문의 및 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/wooder2050/goal-crush-data-center/issues)
- **기능 제안**: [GitHub Discussions](https://github.com/wooder2050/goal-crush-data-center/discussions)

---

**골때리는 그녀들을 사랑하는 모든 팬들을 위해 만들어졌습니다** ⚽💙
