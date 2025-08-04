# 미니멀 테마 컴포넌트 시스템

## 개요

미니멀하고 세련된 디자인 철학을 반영한 React 컴포넌트 시스템입니다. 모든 컴포넌트는 TypeScript로 작성되었으며, Tailwind CSS를 기반으로 합니다.

## 디자인 철학

- **미니멀리즘**: 불필요한 요소를 제거하고 핵심에 집중
- **세련됨**: 고급스럽고 깔끔한 디자인
- **일관성**: 모든 컴포넌트가 동일한 디자인 언어 사용
- **접근성**: 모든 사용자가 사용할 수 있도록 설계

## 색상 팔레트

```typescript
colors: {
  primary: "#000000",      // 메인 브랜드 컬러 - 블랙
  secondary: "#FFFFFF",    // 보조 컬러 - 화이트
  accent: {
    red: "#FF0000"         // 할인/강조 컬러 - 레드
  },
  neutral: {
    lightGray: "#F5F5F5",
    mediumGray: "#999999",
    darkGray: "#333333"
  }
}
```

## 컴포넌트 목록

### 기본 컴포넌트

#### Button

```tsx
import { Button } from '@/components/ui';

<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
<Button variant="destructive">Destructive Button</Button>
```

#### Badge

```tsx
import { Badge } from '@/components/ui';

<Badge variant="default">기본</Badge>
<Badge variant="secondary">보조</Badge>
<Badge variant="destructive">삭제</Badge>
<Badge variant="discount">할인</Badge>
<Badge variant="category">카테고리</Badge>
```

#### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명</CardDescription>
  </CardHeader>
  <CardContent>카드 내용</CardContent>
</Card>;
```

### 레이아웃 컴포넌트

#### Container

```tsx
import { Container } from '@/components/ui';

<Container maxWidth="7xl" padding="md">
  컨텐츠
</Container>;
```

#### Grid

```tsx
import { Grid, GridItem } from '@/components/ui';

<Grid cols={4} gap="md">
  <GridItem span={1}>아이템 1</GridItem>
  <GridItem span={2}>아이템 2</GridItem>
  <GridItem span={1}>아이템 3</GridItem>
</Grid>;
```

#### Header

```tsx
import { Header, NavItem } from '@/components/ui';

<Header>
  <NavItem href="/" isActive>
    홈
  </NavItem>
  <NavItem href="/products">상품</NavItem>
  <NavItem href="/collections">컬렉션</NavItem>
</Header>;
```

#### Section

```tsx
import { Section } from '@/components/ui';

<Section
  title="섹션 제목"
  subtitle="섹션 부제목"
  background="white"
  padding="lg"
>
  섹션 내용
</Section>;
```

### 타이포그래피 컴포넌트

```tsx
import { H1, H2, H3, Body, Caption, Label } from '@/components/ui';

<H1>Heading 1</H1>
<H2>Heading 2</H2>
<H3>Heading 3</H3>
<Body>본문 텍스트</Body>
<Caption>캡션 텍스트</Caption>
<Label>라벨 텍스트</Label>
```

### 특수 컴포넌트

#### HeroBanner

```tsx
import { HeroBanner } from '@/components/ui';

<HeroBanner
  image="/hero-image.jpg"
  title="메인 제목"
  subtitle="부제목"
  description="설명 텍스트"
  ctaText="버튼 텍스트"
  onCtaClick={() => console.log('클릭')}
/>;
```

#### ProductCard

```tsx
import { ProductCard } from '@/components/ui';

<ProductCard
  image="/product-image.jpg"
  title="상품명"
  price={29000}
  originalPrice={45000}
  discount={35}
  brand="브랜드명"
  category="카테고리"
  isNew
  isExclusive
  isLive
/>;
```

## 사용 예시

전체 컴포넌트 시스템의 사용 예시를 보려면 `/theme-demo` 페이지를 방문하세요.

## 설치된 컴포넌트

- ✅ Button (수정됨)
- ✅ Badge (수정됨)
- ✅ Card (수정됨)
- ✅ Container (새로 추가)
- ✅ Grid (새로 추가)
- ✅ Header (새로 추가)
- ✅ Section (새로 추가)
- ✅ Typography (새로 추가)
- ✅ HeroBanner (새로 추가)
- ✅ ProductCard (새로 추가)

## 테마 상수

모든 테마 관련 상수는 `src/constants/theme.ts`에서 관리됩니다.

```typescript
import { THEME } from '@/constants/theme';

// 색상 사용
const primaryColor = THEME.colors.primary;

// 간격 사용
const spacing = THEME.spacing.md;

// 타이포그래피 사용
const fontSize = THEME.typography.body.fontSize;
```

## 반응형 디자인

모든 컴포넌트는 모바일 퍼스트 접근법을 따르며, 다음 브레이크포인트를 사용합니다:

- Mobile: 480px
- Tablet: 768px
- Desktop: 1024px
- Large Desktop: 1200px

## 접근성

모든 컴포넌트는 WCAG 2.1 AA 기준을 준수하도록 설계되었습니다:

- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 적절한 색상 대비
- 포커스 표시
