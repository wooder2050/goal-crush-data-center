'use client';

import { useResolvedPathParams } from '@/common/path-params/client';
import PlayerDetailPage from '@/features/players/components/PlayerDetailPage';

export default function Page() {
  const [playerIdStr] = useResolvedPathParams('playerId');
  const idNum = Number(playerIdStr);
  const resolvedId = Number.isFinite(idNum) ? idNum : null;
  return <PlayerDetailPage playerId={resolvedId} />;
}
