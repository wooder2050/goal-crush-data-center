# ⚽ 골 크러시 데이터 센터 (Goal Crush Data Center)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-배포%20링크-black?style=for-the-badge&logo=vercel)](https://goal-crush-data-center.vercel.app/)

SBS 예능 프로그램 '골때리는 그녀들'의 경기 데이터와 선수 통계를 관리하고 시각화하는 웹 애플리케이션입니다.

## ✨ 프로젝트 소개

이 프로젝트는 '골때리는 그녀들' 방송 내용을 기반으로, 각 시즌의 경기 결과, 선수 정보, 팀 기록 등 파편화된 데이터를 한곳에 모아 체계적으로 관리하고 분석하기 위해 시작되었습니다. 데이터에 기반한 다양한 통계와 시각화를 제공하여 프로그램을 더 깊이 있게 즐길 수 있도록 돕는 것을 목표로 하는 프로젝트입니다.

## 🚀 주요 기능

- **시즌별 기록 보기**: 각 시즌별 전체 경기 결과와 상세 정보를 조회할 수 있습니다.
- **선수 관리**: 선수 정보 조회 및 관리 기능입니다. (개발 예정)
- **팀 관리**: 팀 정보 및 팀 구성 관리 기능입니다. (개발 예정)
- **통계 분석**: 선수 및 팀의 주요 스탯을 기반으로 한 통계 분석 기능입니다. (개발 예정)

## 🛠️ 기술 스택

- **Frontend**: `Next.js`, `React`, `TypeScript`
- **Styling**: `Tailwind CSS`, `shadcn-ui`
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
npm run dev
```

이제 브라우저에서 `http://localhost:3000`으로 접속하여 프로젝트를 확인할 수 있습니다.

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
