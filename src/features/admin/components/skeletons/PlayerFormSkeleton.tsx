'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlayerFormSkeletonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}

export function PlayerFormSkeleton({
  open,
  onOpenChange,
  title,
}: PlayerFormSkeletonProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="animate-pulse bg-gray-200 h-5 w-5 rounded"></div>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 선수명 필드 */}
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
          </div>

          {/* 생년월일 필드 */}
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
          </div>

          {/* 국적 필드 */}
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
          </div>

          {/* 신장/등번호 필드 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
            </div>
          </div>

          {/* 프로필 이미지 URL 필드 */}
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 pt-4">
            <div className="animate-pulse bg-gray-200 h-10 w-16 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-16 rounded"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
