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
        subtitle="미니멀 스타일"
        description="미니멀하고 세련된 패션/라이프스타일 플랫폼에서 당신만의 스타일을 발견하세요."
        ctaText="컬렉션 보기"
        onCtaClick={() => alert('컬렉션으로 이동')}
      />

      {/* Buttons Section */}
      <Section title="버튼 컴포넌트" subtitle="다양한 버튼 스타일">
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
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
                미니멀 스타일 테마에 맞는 기본 카드입니다.
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
                <Badge variant="emphasisOutline">알림</Badge>
                <Badge variant="discount">할인</Badge>
                <Badge variant="category">카테고리</Badge>
                <Badge className="bg-[#ff4800] text-white">강조</Badge>
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
      <Section title="상품 카드" subtitle="미니멀 스타일의 상품 카드">
        <Grid cols={4} gap="md">
          <ProductCard
            image="https://picsum.photos/300/375"
            title="미니멀 베이직 티셔츠"
            price={29000}
            originalPrice={45000}
            discount={35}
            brand="미니멀 브랜드"
            category="의류"
            isNew
          />

          <ProductCard
            image="https://picsum.photos/301/375"
            title="프리미엄 데님 팬츠"
            price={89000}
            brand="미니멀 브랜드"
            category="의류"
            isExclusive
          />

          <ProductCard
            image="https://picsum.photos/302/375"
            title="라이브 쇼핑 특가 상품"
            price={150000}
            originalPrice={200000}
            discount={25}
            brand="미니멀 브랜드"
            category="액세서리"
            isLive
          />

          <ProductCard
            image="https://picsum.photos/303/375"
            title="시즌 컬렉션 스니커즈"
            price={120000}
            brand="미니멀 브랜드"
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
              본문 텍스트입니다. 이 텍스트는 가독성을 위해 적절한 크기와 간격을
              가지고 있습니다.
            </Body>
          </div>

          <div>
            <Caption>
              캡션 텍스트는 작은 설명이나 부가 정보를 표시합니다.
            </Caption>
          </div>
        </div>
      </Section>

      {/* Layout Components Section */}
      <Section title="레이아웃 컴포넌트" subtitle="Container, Grid, Section">
        <Container>
          <Grid cols={2} gap="md">
            <Card>
              <CardHeader>
                <CardTitle>Container</CardTitle>
              </CardHeader>
              <CardContent>
                <Body>
                  Container는 콘텐츠의 최대 너비를 제한하고 중앙 정렬을
                  제공합니다.
                </Body>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grid</CardTitle>
              </CardHeader>
              <CardContent>
                <Body>
                  Grid는 반응형 레이아웃을 위한 유연한 그리드 시스템을
                  제공합니다.
                </Body>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
