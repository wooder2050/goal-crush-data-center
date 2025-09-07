import FantasyTeams from '@/features/fantasy/components/FantasyTeams';
import { getCurrentUser } from '@/lib/auth';

export default async function FantasyPage() {
  const user = await getCurrentUser();

  return <FantasyTeams user={user} />;
}
