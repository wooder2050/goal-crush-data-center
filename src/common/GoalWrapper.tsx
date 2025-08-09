'use client';

import { useIsSSR } from '@react-aria/ssr';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import {
  AlertTriangle,
  Home as HomeIcon,
  RefreshCcw,
  TriangleAlert,
} from 'lucide-react';
import Link from 'next/link';
import {
  ComponentProps,
  ComponentType,
  ReactNode,
  Suspense,
  useState,
} from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DefaultErrorHandler = ({ error, resetErrorBoundary }: FallbackProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="mx-auto max-w-3xl mt-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4800]/10 text-[#ff4800]">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                문제가 발생했어요
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                골 때리는 그녀들 데이터센터가 잠시 볼을 놓쳤습니다. 잠시 후 다시
                시도해주세요.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={resetErrorBoundary}
                  className="bg-[#ff4800] hover:bg-[#e34100]"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> 다시 시도
                </Button>
                <Link href="/">
                  <Button variant="outline">
                    <HomeIcon className="mr-2 h-4 w-4" /> 홈으로 가기
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setShowDetails((v) => !v)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />{' '}
                  {showDetails ? '에러 숨기기' : '자세히 보기'}
                </Button>
              </div>

              {showDetails && (
                <div className="mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-700 overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">
                    {error?.message ?? 'Unknown error'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DefaultFallbackComponent = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  return (
    <DefaultErrorHandler
      error={error}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
};

type GoalErrorBoundaryProps = {
  children: ReactNode; // PropsWithChildren is not used, since children is not optional.
  /** Component that will be rendered on error catch. If this component throws error, the default fallback component will be used. */
  FallbackComponent?: ComponentType<FallbackProps>;
};
export const GoalErrorBoundary = ({
  children,
  FallbackComponent,
}: GoalErrorBoundaryProps) => {
  const { reset: resetQueryError } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={DefaultFallbackComponent}
      onReset={resetQueryError}
    >
      {FallbackComponent === undefined ? (
        children
      ) : (
        <ErrorBoundary
          FallbackComponent={FallbackComponent}
          onReset={resetQueryError}
        >
          {children}
        </ErrorBoundary>
      )}
    </ErrorBoundary>
  );
};

type GoalSuspenseProps = ComponentProps<typeof Suspense>;
export const GoalSuspense = (props: GoalSuspenseProps) => {
  const isSSR = useIsSSR();
  if (isSSR) {
    // Prevent rendering `Suspense` and its subtree on server.
    return <>{props.fallback}</>;
  }
  return <Suspense {...props} />;
};

type GoalWrapperProps = ComponentProps<typeof GoalSuspense> & {
  ErrorFallbackComponent?: ComponentType<FallbackProps>;
};
export const GoalWrapper = ({
  children,
  ErrorFallbackComponent,
  ...suspenseProps
}: GoalWrapperProps) => {
  return (
    <GoalErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <GoalSuspense {...suspenseProps}>{children}</GoalSuspense>
    </GoalErrorBoundary>
  );
};
