'use client';

interface MatchInfoProps {
  match: {
    match_date: string | Date;
    location: string | null;
    home_team: { team_name: string };
    away_team: { team_name: string };
  };
}

export default function MatchInfo({ match }: MatchInfoProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {new Date(match.match_date).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </h3>
          <p className="text-gray-600">{match.location}</p>
        </div>
        <div className="flex items-center gap-3 text-lg font-bold">
          <span>{match.home_team.team_name}</span>
          <span className="text-gray-400">vs</span>
          <span>{match.away_team.team_name}</span>
        </div>
      </div>
    </div>
  );
}
