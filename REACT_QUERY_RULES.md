# Goal Crush Data Center - React Query 훅 사용 규칙

## 🎯 프로젝트 개요

이 프로젝트는 Next.js App Router와 React Query를 사용하여 커뮤니티 게시판과 축구 데이터를 관리하는 웹 애플리케이션입니다.

## 🔧 React Query 훅 사용 규칙

### useGoalSuspenseQuery

**용도**: 초기 데이터 로딩이 필요한 컴포넌트
**사용 시**: 부모 컴포넌트에서 반드시 `GoalWrapper`로 감싸야 함
**예시**: 게시글 상세 정보, 사용자 프로필 등
**에러 처리**: Suspense 경계에서 자동 처리

### useGoalQuery

**용도**: 조건부 데이터 조회, 실시간 업데이트가 필요한 데이터
**사용 시**: `enabled` 옵션으로 조건부 실행 가능
**예시**: 좋아요 상태, 포인트 정보, 사용자별 데이터 등
**에러 처리**: `onError` 콜백 또는 기본 에러 핸들러 사용

### useGoalMutation

**용도**: POST, PUT, DELETE 등 데이터 변경 작업
**사용 시**: `onSuccess`, `onError` 콜백으로 결과 처리
**예시**: 게시글 작성, 댓글 작성, 좋아요 처리 등
**상태 관리**: `isPending`, `isError` 등 자동 상태 제공

### useGoalForm

**용도**: 폼 상태 관리 및 유효성 검사
**사용 시**: `useForm` 대신 `useGoalForm` 사용 필수
**기능**: React Hook Form 기반, 에러 처리 자동화
**예시**: 게시글 작성, 댓글 작성, 사용자 정보 수정 등

## 📋 API 함수 규칙

- **단일 매개변수**: 모든 API 함수는 단일 매개변수(객체 또는 배열)를 받아야 함
- **타입 안전성**: TypeScript 인터페이스로 입출력 타입 정의
- **에러 처리**: 일관된 에러 메시지 및 상태 코드 반환

## 🏗️ 컴포넌트 구조

- **Suspense 사용**: `useGoalSuspenseQuery` 사용 시 `GoalWrapper` 필수
- **조건부 렌더링**: `enabled` 옵션으로 불필요한 API 호출 방지
- **상태 동기화**: React Query의 자동 캐싱 및 동기화 활용

## 💻 예시 코드

### Suspense Query

```typescript
const { data: postData } = useGoalSuspenseQuery(getPostDetail, [postId]);
```

### 일반 Query

```typescript
const { data: likeStatus } = useGoalQuery(getLikeStatus, [postId, userId], {
  enabled: !!userId,
});
```

### Mutation

```typescript
const createPostMutation = useGoalMutation(createPost, {
  onSuccess: (data) => router.push(`/posts/${data.post_id}`),
  onError: (error) => alert('작성에 실패했습니다.'),
});
```

### Form

```typescript
const form = useGoalForm({
  defaultValues: {
    title: '',
    content: '',
    category: 'general',
  },
  onSubmit: (data) => createPostMutation.mutate(data),
});
```

## 🚫 금지사항

- `useGoalSuspenseQuery` 사용 시 `GoalWrapper` 없이 사용
- API 함수에 여러 매개변수를 직접 전달
- React Query의 기본 훅(`useQuery`, `useMutation`) 직접 사용
- 에러 처리 없이 API 호출

## ✅ 권장사항

- 모든 데이터 조회는 React Query 훅 사용
- API 함수는 단일 매개변수로 설계
- 적절한 `enabled` 조건으로 불필요한 API 호출 방지
- `onSuccess`, `onError` 콜백으로 결과 처리
- TypeScript로 타입 안전성 보장

## 🔍 파일 위치

- **훅**: `src/hooks/useGoalQuery.ts`, `src/hooks/useGoalMutation.ts`
- **GoalWrapper**: `src/common/GoalWrapper.tsx`
- **API 함수**: 각 기능별 디렉토리의 `api.ts` 파일
- **포인트 시스템**: `src/lib/points.ts`

## 📚 추가 리소스

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
