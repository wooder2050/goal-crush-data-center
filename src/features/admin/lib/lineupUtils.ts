import { MatchLineup, MatchSubstitution } from '../types';

/**
 * 선발/교체/벤치 상태를 판별하는 유틸리티 함수
 * 기존 프로젝트의 로직을 참고하여 구현
 */
export const getParticipationStatus = (
  lineup: MatchLineup,
  substitutions: MatchSubstitution[]
): 'starting' | 'substitute' | 'bench' => {
  // 출전 시간이 0이면 벤치
  if (lineup.minutes_played === 0) {
    return 'bench';
  }

  // 교체로 들어온 선수인지 확인
  const isSubstituteIn = substitutions.some(
    (sub) => sub.player_in_id === lineup.player_id
  );

  if (isSubstituteIn) {
    return 'substitute'; // 교체로 들어온 선수
  }

  // 교체로 나간 선수인지 확인
  const isSubstituteOut = substitutions.some(
    (sub) => sub.player_out_id === lineup.player_id
  );

  if (isSubstituteOut) {
    return 'starting'; // 교체로 나간 선수는 선발로 간주
  }

  // 출전 시간이 있고 교체 기록이 없는 경우 선발로 간주
  if (lineup.minutes_played && lineup.minutes_played > 0) {
    return 'starting';
  }

  // 기본값은 선발 (minutes_played 정보가 없는 경우)
  return 'starting';
};

/**
 * 상태를 한국어로 변환하는 함수
 */
export const getStatusLabel = (
  status: 'starting' | 'substitute' | 'bench'
): string => {
  switch (status) {
    case 'starting':
      return '선발';
    case 'substitute':
      return '교체';
    case 'bench':
      return '벤치';
    default:
      return '알 수 없음';
  }
};

/**
 * 상태에 따른 스타일 클래스를 반환하는 함수
 */
export const getStatusBadgeClass = (
  status: 'starting' | 'substitute' | 'bench'
): string => {
  const baseClass =
    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';

  switch (status) {
    case 'starting':
      return `${baseClass} bg-green-100 text-green-800`;
    case 'substitute':
      return `${baseClass} bg-blue-100 text-blue-800`;
    case 'bench':
      return `${baseClass} bg-gray-100 text-gray-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
};
