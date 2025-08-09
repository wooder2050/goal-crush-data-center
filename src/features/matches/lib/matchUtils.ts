import { MatchWithTeams } from '@/lib/types/database';

/**
 * 경기 결과를 문자열로 반환
 */
export const getMatchResult = (match: MatchWithTeams): string => {
  if (match.home_score === null || match.away_score === null) {
    return 'vs';
  }
  return `${match.home_score}:${match.away_score}`;
};

/**
 * 승부차기가 있는지 확인
 */
export const hasPenaltyShootout = (match: MatchWithTeams): boolean => {
  return (
    match.penalty_home_score != null &&
    match.penalty_away_score != null &&
    typeof match.penalty_home_score === 'number' &&
    typeof match.penalty_away_score === 'number'
  );
};

/**
 * 경기 승자를 반환 ('home' | 'away' | 'draw' | null)
 */
export const getWinnerTeam = (
  match: MatchWithTeams
): 'home' | 'away' | 'draw' | null => {
  if (match.home_score === null || match.away_score === null) {
    return null;
  }

  // 먼저 정규시간 결과 확인
  if (match.home_score > match.away_score) {
    return 'home';
  } else if (match.away_score > match.home_score) {
    return 'away';
  }

  // 동점인 경우 승부차기 결과 확인
  if (match.home_score === match.away_score) {
    if (
      match.penalty_home_score != null &&
      match.penalty_away_score != null &&
      typeof match.penalty_home_score === 'number' &&
      typeof match.penalty_away_score === 'number'
    ) {
      if (match.penalty_home_score > match.penalty_away_score) {
        return 'home';
      } else if (match.penalty_away_score > match.penalty_home_score) {
        return 'away';
      }
    }
  }

  return 'draw';
};

/**
 * 포지션별 색상 클래스 반환
 */
export const getPositionColor = (position: string): string => {
  const code = getPositionText(position);
  switch (code) {
    case 'GK':
      return 'bg-yellow-100 text-yellow-800';
    case 'DF':
      return 'bg-blue-100 text-blue-800';
    case 'MF':
      return 'bg-green-100 text-green-800';
    case 'FW':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * 포지션별 축약 텍스트 반환
 */
export const getPositionText = (position: string): string => {
  switch (position) {
    case 'Goalkeeper':
      return 'GK';
    case 'Defender':
      return 'DF';
    case 'Midfielder':
      return 'MF';
    case 'Forward':
      return 'FW';
    default:
      return position;
  }
};

/**
 * 포지션별 정렬 순서 반환 (공격수 -> 미드필더 -> 수비수 -> 골키퍼)
 */
export const getPositionOrder = (position: string): number => {
  switch (position) {
    case 'Forward':
      return 0;
    case 'Midfielder':
      return 1;
    case 'Defender':
      return 2;
    case 'Goalkeeper':
      return 3;
    default:
      return 4;
  }
};
