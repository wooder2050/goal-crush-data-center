import { useCallback, useEffect, useRef } from 'react';

export const ScrollTrigger = ({
  updateOptions,
}: {
  updateOptions: () => void;
}) => {
  const fetchTrigger = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting) {
        updateOptions();
      }
    },
    [updateOptions]
  );

  useEffect(() => {
    if (!fetchTrigger.current) return;

    // IntersectionObserver 생성
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px', // 100px 전에 미리 트리거
      threshold: 0.1,
    });

    const currentElement = fetchTrigger.current;
    observerRef.current.observe(currentElement);

    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement);
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  return (
    <div
      style={{ display: 'flex', minHeight: '20px' }}
      ref={fetchTrigger}
      aria-hidden="true"
    />
  );
};
