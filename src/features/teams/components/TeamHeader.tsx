'use client';

import Image from 'next/image';

import type { Team } from '@/lib/types';

interface TeamHeaderProps {
  team: Team;
}

export default function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 relative rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
        {team.logo ? (
          <Image
            src={team.logo}
            alt={`${team.team_name} 로고`}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <span className="text-xl text-gray-600 font-semibold">
            {team.team_name?.charAt(0) ?? '?'}
          </span>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{team.team_name}</h1>
        <div className="text-sm text-gray-500">
          {team.founded_year ? `${team.founded_year}년 창단` : '창단년도 미상'}
        </div>
        {team.description && (
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
            {team.description}
          </p>
        )}
      </div>
    </div>
  );
}
