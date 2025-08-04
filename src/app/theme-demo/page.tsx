'use client';

import {
  Badge,
  Body,
  Button,
  Caption,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  H1,
  H2,
  H3,
  Header,
  HeroBanner,
  NavItem,
  ProductCard,
  Section,
} from '@/components/ui';

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header>
        <NavItem href="/" isActive>
          홈
        </NavItem>
        <NavItem href="/products">상품</NavItem>
        <NavItem href="/collections">컬렉션</NavItem>
        <NavItem href="/about">소개</NavItem>
      </Header>

      {/* Hero Banner */}
      <HeroBanner
        image="https://picsum.photos/1200/600"
        title="감도 깊은 취향 셀렉트샵"
        subtitle="29CM"
        description="미니멀하고 세련된 패션/라이프스타일 플랫폼에서 당신만의 스타일을 발견하세요."
        ctaText="컬렉션 보기"
        onCtaClick={() => alert('컬렉션으로 이동')}
      />

      {/* Buttons Section */}
      <Section title="버튼 컴포넌트" subtitle="다양한 버튼 스타일">
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          <Button variant="destructive">Gray Button</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      {/* Cards Section */}
      <Section
        title="카드 컴포넌트"
        subtitle="다양한 카드 스타일"
        background="gray"
      >
        <Grid cols={3} gap="lg">
          <Card>
            <CardHeader>
              <CardTitle>기본 카드</CardTitle>
              <CardDescription>
                29CM 테마에 맞는 기본 카드입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Body>이 카드는 미니멀하고 세련된 디자인을 따릅니다.</Body>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>배지가 있는 카드</CardTitle>
              <CardDescription>
                다양한 배지와 함께 사용할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default">기본</Badge>
                <Badge variant="secondary">보조</Badge>
                <Badge variant="default">삭제</Badge>
                <Badge variant="discount">할인</Badge>
                <Badge variant="category">카테고리</Badge>
              </div>
              <Body>배지는 다양한 상황에 맞게 사용할 수 있습니다.</Body>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>타이포그래피</CardTitle>
              <CardDescription>일관된 텍스트 스타일</CardDescription>
            </CardHeader>
            <CardContent>
              <H3 className="mb-2">제목 텍스트</H3>
              <Body className="mb-2">본문 텍스트입니다.</Body>
              <Caption>캡션 텍스트</Caption>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Product Cards Section */}
      <Section title="상품 카드" subtitle="29CM 스타일의 상품 카드">
        <Grid cols={4} gap="md">
          <ProductCard
            image="https://picsum.photos/300/375"
            title="미니멀 베이직 티셔츠"
            price={29000}
            originalPrice={45000}
            discount={35}
            brand="29CM"
            category="의류"
            isNew
          />

          <ProductCard
            image="https://picsum.photos/301/375"
            title="프리미엄 데님 팬츠"
            price={89000}
            brand="29CM"
            category="의류"
            isExclusive
          />

          <ProductCard
            image="https://picsum.photos/302/375"
            title="라이브 쇼핑 특가 상품"
            price={150000}
            originalPrice={200000}
            discount={25}
            brand="29CM"
            category="액세서리"
            isLive
          />

          <ProductCard
            image="https://picsum.photos/303/375"
            title="시즌 컬렉션 스니커즈"
            price={120000}
            brand="29CM"
            category="신발"
          />
        </Grid>
      </Section>

      {/* Typography Section */}
      <Section
        title="타이포그래피"
        subtitle="일관된 텍스트 시스템"
        background="gray"
      >
        <div className="space-y-6">
          <div>
            <H1>Heading 1 - 메인 제목</H1>
            <H2>Heading 2 - 섹션 제목</H2>
            <H3>Heading 3 - 서브 제목</H3>
          </div>

          <div>
            <Body>
              본문 텍스트입니다. 29CM의 미니멀하고 세련된 디자인 철학을 반영한
              타이포그래피 시스템을 사용합니다. 가독성과 시각적 균형을 고려하여
              설계되었습니다.
            </Body>
          </div>

          <div>
            <Caption>캡션 텍스트 - 부가 정보나 설명을 위한 작은 텍스트</Caption>
          </div>
        </div>
      </Section>

      {/* Layout Components */}
      <Section title="레이아웃 컴포넌트" subtitle="Container와 Grid 시스템">
        <div className="space-y-8">
          <div>
            <H3 className="mb-4">Container 예시</H3>
            <Container maxWidth="lg" padding="lg" className="bg-gray-100 p-4">
              <Body>이 컨테이너는 최대 너비와 패딩이 설정되어 있습니다.</Body>
            </Container>
          </div>

          <div>
            <H3 className="mb-4">Grid 예시</H3>
            <Grid cols={6} gap="md">
              <div className="bg-gray-100 p-4 text-center">1</div>
              <div className="bg-gray-100 p-4 text-center">2</div>
              <div className="bg-gray-100 p-4 text-center">3</div>
              <div className="bg-gray-100 p-4 text-center">4</div>
              <div className="bg-gray-100 p-4 text-center">5</div>
              <div className="bg-gray-100 p-4 text-center">6</div>
            </Grid>
          </div>
        </div>
      </Section>
    </div>
  );
}
