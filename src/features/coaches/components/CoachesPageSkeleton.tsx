'use client';

import React from 'react';

import CoachCardSkeleton from './CoachCardSkeleton';

const CoachesPageSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">감독 목록</h1>
        <p className="text-gray-600">
          모든 감독의 정보와 팀 이력을 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <CoachCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CoachesPageSkeleton;
