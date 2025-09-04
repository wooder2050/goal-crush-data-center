'use client';

import {
  BarChart3,
  BookOpen,
  Calendar,
  Database,
  Filter,
  HelpCircle,
  Home,
  PlayCircle,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Tv,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  H1,
  Section,
} from '@/components/ui';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section padding="sm" className="pt-16 pb-12">
        <div className="text-center mb-12">
          <Badge variant="emphasisOutline" className="w-fit mb-6 text-sm">
            🏆 About Us
          </Badge>
          <H1 className="mb-6 text-4xl sm:text-6xl font-bold leading-tight">
            골 때리는 그녀들 데이터센터
            <br />
            <span className="text-[#ff4800]/80">소개</span>
          </H1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            &ldquo;골 때리는 그녀들&rdquo; 방송과 함께하는 공식 데이터
            아카이브입니다. 매주 방송되는 경기의 모든 데이터를 체계적으로
            수집하고 제공합니다.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl mb-12">
          <Image
            src="https://ppqctvmpsmlagsmmmdee.supabase.co/storage/v1/object/sign/playerprofile/mwE1721003437663.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZWM2YjcyNS1hYWJjLTQzOGUtODkzMi00NDU1ZmM1ZGEyY2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF5ZXJwcm9maWxlL213RTE3MjEwMDM0Mzc2NjMuanBnIiwiaWF0IjoxNzU1MTY2Njk5LCJleHAiOjIwNzA1MjY2OTl9.c0a4K6VimPMfItbZq1rjL5TEWhcC_319UMgLRRSj9sI"
            alt="골 때리는 그녀들 데이터센터"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
          />
        </div>
      </Section>

      {/* 미션 & 비전 Section */}
      <Section
        padding="sm"
        className="py-16 bg-gradient-to-br from-[#ff4800]/5 via-white to-orange-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">우리의 미션</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              여자 축구의 데이터를 체계적으로 보존하고 공유합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#ff4800]/10 flex items-center justify-center mb-4">
                  <Tv className="h-6 w-6 text-[#ff4800]" />
                </div>
                <CardTitle className="text-2xl text-[#ff4800]">
                  방송 연계 데이터
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  &ldquo;골 때리는 그녀들&rdquo; 방송에서 다룬 모든 경기의 상세
                  데이터를 실시간으로 수집하고 정리하여, 시청자들이 방송 내용을
                  더 깊이 이해할 수 있도록 돕습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#ff4800]/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-[#ff4800]" />
                </div>
                <CardTitle className="text-2xl text-[#ff4800]">
                  체계적 아카이브
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  선수 개인 기록부터 팀 전적, 시즌별 통계까지 모든 데이터를
                  구조화하여 보관하고, 누구나 쉽게 검색하고 비교할 수 있는
                  플랫폼을 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* 방송과의 연계성 Section */}
      <Section padding="sm" className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              방송과의 연계성
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              &ldquo;골 때리는 그녀들&rdquo;과 함께 성장하는 데이터 플랫폼
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors mb-4">
                  <PlayCircle className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-xl">실시간 업데이트</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  방송 직후 해당 경기의 모든 통계와 하이라이트 영상을 즉시
                  업데이트하여 시청자들이 바로 확인할 수 있습니다.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors mb-4">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-xl">심층 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  방송에서 언급된 선수나 팀의 과거 기록과 현재 폼을 비교
                  분석하여 더 풍부한 맥락을 제공합니다.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors mb-4">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-xl">커뮤니티 연결</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  방송 시청자들이 데이터를 통해 더 깊이 있는 토론과 분석을 나눌
                  수 있는 공간을 마련합니다.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* 데이터 수집 및 업데이트 Section */}
      <Section padding="sm" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              데이터 수집 및 업데이트
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              정확하고 신뢰할 수 있는 데이터 제공을 위한 체계적 프로세스
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#ff4800]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#ff4800]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-[#ff4800]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#ff4800]">
                    매주 정기 업데이트
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    &ldquo;골 때리는 그녀들&rdquo; 방송일 기준으로 매주 새로운
                    경기 데이터를 수집하고 업데이트합니다.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 방송 후 24시간 이내 데이터 반영</li>
                    <li>• 선수별 경기 기록 및 통계 업데이트</li>
                    <li>• 팀 순위 및 시즌 기록 갱신</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-blue-500">
                    다양한 데이터 소스
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    공식 경기 기록, 영상 분석, 방송 내용을 종합하여 포괄적인
                    데이터를 제공합니다.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 공식 경기 결과 및 개인 기록</li>
                    <li>• 영상 분석을 통한 세부 통계</li>
                    <li>• 방송에서 언급된 특별 기록</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-green-500">
                    품질 관리
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    데이터의 정확성과 일관성을 위해 다단계 검증 과정을 거쳐
                    정보를 제공합니다.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 복수 소스를 통한 데이터 검증</li>
                    <li>• 정기적인 데이터 무결성 검사</li>
                    <li>• 사용자 피드백을 통한 지속적 개선</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 이용 가이드 Section */}
      <Section padding="sm" className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">이용 가이드</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              골크러쉬 데이터센터의 모든 기능을 효과적으로 활용하는 방법을 안내합니다
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            <a
              href="#getting-started"
              className="flex flex-col items-center p-4 rounded-lg bg-[#ff4800]/5 hover:bg-[#ff4800]/10 transition-colors group"
            >
              <Home className="h-8 w-8 text-[#ff4800] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">시작하기</span>
            </a>
            <a
              href="#search-guide"
              className="flex flex-col items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              <Search className="h-8 w-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">검색 방법</span>
            </a>
            <a
              href="#stats-guide"
              className="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
            >
              <BarChart3 className="h-8 w-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">통계 보기</span>
            </a>
            <a
              href="#comparison-guide"
              className="flex flex-col items-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group"
            >
              <TrendingUp className="h-8 w-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">비교 기능</span>
            </a>
          </div>

          {/* 시작하기 */}
          <div id="getting-started" className="mb-16">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#ff4800]/10 flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-[#ff4800]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">시작하기</h3>
              <p className="text-gray-600">기본 사용법을 알아보세요</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-[#ff4800] flex items-center gap-2">
                    <span className="text-xl">🏠</span>
                    홈페이지에서 시작
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                    메인 페이지에서 최신 경기 정보와 주요 통계를 확인하세요.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 다가오는 경기 일정 확인</li>
                    <li>• 주요 서비스 바로가기 활용</li>
                    <li>• 방송 연계 콘텐츠 탐색</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-[#ff4800] flex items-center gap-2">
                    <span className="text-xl">🧭</span>
                    네비게이션 활용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                    상단 메뉴를 통해 원하는 정보에 빠르게 접근하세요.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• <strong>시즌:</strong> 연도별 경기 결과 및 순위</li>
                    <li>• <strong>선수/팀:</strong> 개별 프로필 및 기록</li>
                    <li>• <strong>통계:</strong> 랭킹 및 분석 데이터</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 검색 및 필터링 */}
          <div id="search-guide" className="mb-16">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">검색 및 필터링</h3>
              <p className="text-gray-600">원하는 선수나 팀을 빠르게 찾는 방법</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="border-0 bg-white shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                    <Search className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg">이름으로 검색</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    선수나 팀 이름의 일부만 입력해도 관련된 결과를 찾을 수 있습니다.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                    <strong>예시:</strong> &ldquo;김민&rdquo; → 김민지, 김민서 등
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                    <Filter className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle className="text-lg">포지션별 필터</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    특정 포지션의 선수들만 골라서 확인할 수 있습니다.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs">FW</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">MF</span>
                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs">DF</span>
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded text-xs">GK</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                    <Target className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg">팀별 필터</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    특정 팀 소속 선수들의 기록을 한번에 확인할 수 있습니다.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-2 text-xs text-gray-600">
                    <strong>활용:</strong> 팀 페이지에서 스쿼드 전체 기록 비교
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 통계 보는 방법 */}
          <div id="stats-guide" className="mb-16 bg-gray-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">통계 보는 방법</h3>
              <p className="text-gray-600">다양한 통계 지표를 이해하고 활용하세요</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-green-500">득점 랭킹</h4>
                    <p className="text-sm text-gray-700 mb-2">골, 어시스트, 공격포인트로 공격력 비교</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>• <strong>골:</strong> 직접 득점</div>
                      <div>• <strong>어시스트:</strong> 도움</div>
                      <div>• <strong>공격포인트:</strong> 골+어시스트</div>
                      <div>• <strong>경기당 평균:</strong> 효율성</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-blue-500">골키퍼 통계</h4>
                    <p className="text-sm text-gray-700 mb-2">골키퍼의 수비 능력 핵심 지표</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>• <strong>클린시트:</strong> 무실점 경기</div>
                      <div>• <strong>실점률:</strong> 경기당 평균 실점</div>
                      <div>• <strong>선방률:</strong> 슈팅 대비 막아낸 비율</div>
                      <div>• <strong>출전 시간:</strong> 골키퍼 플레이 시간</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-purple-500">팀 순위</h4>
                    <p className="text-sm text-gray-700 mb-2">팀의 전체적인 성과 지표</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>• <strong>승점:</strong> 승3점, 무1점, 패0점</div>
                      <div>• <strong>득실차:</strong> 총득점 - 총실점</div>
                      <div>• <strong>승률:</strong> 전체 경기 중 승리 비율</div>
                      <div>• <strong>최근 폼:</strong> 최근 5경기 결과</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 비교 기능 */}
          <div id="comparison-guide" className="mb-16">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">비교 기능 활용</h3>
              <p className="text-gray-600">선수와 팀을 효과적으로 비교하여 심층 분석</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
                    <span className="text-xl">⚔️</span>
                    팀 맞대결 비교
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    두 팀 간의 직접 대결 기록과 상대 전적을 상세히 분석
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• 팀 A vs 팀 B 전체 전적</li>
                    <li>• 최근 5경기 결과</li>
                    <li>• 홈/원정별 성과</li>
                    <li>• 평균 득점/실점 비교</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    선수 vs 팀 기록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    특정 선수가 각 팀을 상대로 어떤 성과를 보였는지 확인
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• 상대팀별 득점/어시스트 기록</li>
                    <li>• 경기당 평균 성과</li>
                    <li>• 최고 기록 달성 경기</li>
                    <li>• 상성이 좋은/나쁜 팀 파악</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 실전 활용 팁 */}
            <div className="bg-gradient-to-r from-[#ff4800]/10 to-orange-100 rounded-lg p-6">
              <h4 className="font-bold text-[#ff4800] mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                실전 활용 팁
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-800 text-sm mb-1">방송 시청과 함께 활용</h5>
                  <p className="text-xs text-gray-600">
                    &ldquo;골 때리는 그녀들&rdquo; 방송 언급 선수의 과거 기록을 즉시 확인
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 text-sm mb-1">데이터 기반 예측</h5>
                  <p className="text-xs text-gray-600">
                    과거 맞대결 기록과 최근 폼으로 다음 경기 결과 예측
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section padding="sm" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#ff4800]/10 flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-[#ff4800]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">자주 묻는 질문</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              골크러쉬 데이터센터 이용 중 궁금한 점들을 모아 답변해드립니다
            </p>
          </div>

          <div className="space-y-6">
            {/* 일반 질문 */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#ff4800]">
              <h3 className="text-lg font-bold mb-4 text-[#ff4800] flex items-center gap-2">
                <span className="text-xl">🏆</span>
                일반 질문
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 골크러쉬 데이터센터는 무료로 이용할 수 있나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    네, 모든 기능을 완전 무료로 이용하실 수 있습니다. 회원가입 없이도 대부분의 데이터를 확인할 수 있으며, 
                    일부 커뮤니티 기능만 로그인이 필요합니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. &ldquo;골 때리는 그녀들&rdquo; 방송과 어떤 관계인가요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    저희는 방송에서 다룬 경기들의 상세 데이터를 체계적으로 정리하여 제공하는 팬 사이트입니다. 
                    방송 시청자들이 더 풍부한 정보를 얻을 수 있도록 돕는 것이 목표입니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 모바일에서도 이용할 수 있나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    네, 반응형 디자인으로 제작되어 스마트폰, 태블릿에서도 최적화된 화면으로 이용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 데이터 정확성 */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-bold mb-4 text-blue-500 flex items-center gap-2">
                <span className="text-xl">📊</span>
                데이터 정확성
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 데이터는 얼마나 정확한가요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    공식 경기 기록, 영상 분석, 그리고 방송 내용을 종합하여 최대한 정확한 데이터를 제공하고 있습니다. 
                    다만 일부 세부 통계는 영상 분석에 의존하므로 100% 완벽하지 않을 수 있습니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 잘못된 정보를 발견했을 때는 어떻게 해야 하나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    커뮤니티 게시판을 통해 제보해주시면 확인 후 즉시 수정하겠습니다. 
                    정확한 데이터 제공을 위해 사용자 피드백을 적극 반영하고 있습니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 데이터 출처는 어디인가요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    주요 출처는 다음과 같습니다: ① 공식 경기 기록 및 스코어시트 ② &ldquo;골 때리는 그녀들&rdquo; 방송 영상 분석 
                    ③ 팀별 공식 발표 자료 ④ 기타 신뢰할 수 있는 축구 관련 매체
                  </p>
                </div>
              </div>
            </div>

            {/* 업데이트 관련 */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-bold mb-4 text-green-500 flex items-center gap-2">
                <span className="text-xl">🔄</span>
                업데이트 관련
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 데이터는 얼마나 자주 업데이트되나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    &ldquo;골 때리는 그녀들&rdquo; 방송일 기준으로 매주 업데이트됩니다. 
                    방송에서 다룬 경기의 상세 데이터는 보통 방송 후 24시간 이내에 반영됩니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 과거 시즌 데이터도 계속 추가되나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    네, 방송에서 다뤄진 과거 경기들의 데이터도 지속적으로 보완하고 있습니다. 
                    특히 주요 선수들의 커리어 기록을 완성하는 데 집중하고 있습니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 업데이트 소식은 어디서 확인할 수 있나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    홈페이지의 &ldquo;다가오는 경기&rdquo; 섹션과 커뮤니티 게시판에서 최신 업데이트 소식을 확인하실 수 있습니다. 
                    중요한 기능 추가나 대규모 데이터 업데이트 시에는 별도로 공지하겠습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 기능 사용법 */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
              <h3 className="text-lg font-bold mb-4 text-purple-500 flex items-center gap-2">
                <span className="text-xl">🛠️</span>
                기능 사용법
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 선수 비교 기능은 어떻게 사용하나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    통계 메뉴의 &ldquo;선수 vs 팀&rdquo; 기능을 이용하시면 특정 선수가 각 팀을 상대로 
                    어떤 성과를 보였는지 상세히 비교할 수 있습니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 팀 맞대결 기록은 어디서 볼 수 있나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    통계 → &ldquo;팀 맞대결&rdquo; 메뉴에서 두 팀을 선택하면 상호 전적, 최근 폼, 
                    평균 득점/실점 등을 한눈에 비교할 수 있습니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Q. 특정 포지션 선수들만 보려면 어떻게 하나요?
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">
                    선수 페이지에서 포지션 필터(FW, MF, DF, GK)를 선택하시면 해당 포지션 선수들만 
                    골라서 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 기타 문의 */}
            <div className="bg-gradient-to-r from-[#ff4800]/10 to-orange-100 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-[#ff4800] flex items-center gap-2">
                <span className="text-xl">💬</span>
                기타 문의사항
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>Q. 위에서 다루지 않은 다른 질문이 있어요.</strong>
                </p>
                <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-orange-300">
                  커뮤니티 게시판에 질문을 남겨주시면 빠른 시일 내에 답변드리겠습니다. 
                  많은 분들이 궁금해하시는 내용은 이 FAQ에 추가로 반영하겠습니다.
                </p>
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <Link href="/community">
                    <Button variant="outline" size="sm" className="text-[#ff4800] border-[#ff4800]">
                      커뮤니티로 질문하기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section padding="sm" className="py-16 bg-[#ff4800]/5">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            지금 바로 시작해보세요
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            골크러쉬 데이터센터에서 &ldquo;골 때리는 그녀들&rdquo;의 모든 경기
            데이터를 탐색해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/seasons">
              <Button size="lg" className="px-8 py-4 text-lg">
                시즌 기록 보기
              </Button>
            </Link>
            <Link href="/players">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                선수 검색해보기
              </Button>
            </Link>
            <Link href="/stats">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                통계 랭킹 보기
              </Button>
            </Link>
            <Link href="/stats/head-to-head">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                팀 맞대결 비교하기
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
