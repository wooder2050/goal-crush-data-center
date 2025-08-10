import { useEffect, useRef } from 'react';

export const ScrollTrigger = ({
  updateOptions,
}: {
  updateOptions: () => void;
}) => {
  const fetchTrigger = useRef<HTMLDivElement>(null);
  const scrollObserver = new IntersectionObserver((observerCallback) => {
    if (observerCallback[0]?.isIntersecting) updateOptions();
  });

  useEffect(() => {
    if (fetchTrigger.current) {
      const copyRef = fetchTrigger.current;
      if (copyRef) scrollObserver.observe(copyRef);
      return () => {
        if (copyRef) scrollObserver.unobserve(copyRef);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ display: 'flex', minHeight: '1px' }} ref={fetchTrigger} />
  );
};
