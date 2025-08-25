'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { AuthModal } from './AuthModal';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description: string;
}

export function LoginRequiredModal({
  isOpen,
  onClose,
  feature,
  description,
}: LoginRequiredModalProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginClick = () => {
    onClose(); // 현재 모달 닫기
    setIsAuthModalOpen(true); // 로그인 모달 열기
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#ff4800]" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              ⚽ 로그인이 필요합니다
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              <span className="font-medium text-[#ff4800]">{feature}</span>{' '}
              기능을 사용하려면 로그인이 필요합니다.
              <br />
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={handleLoginClick}
              className="w-full bg-[#ff4800] hover:bg-[#e63e00] text-white font-medium py-2.5"
            >
              <Heart className="w-4 h-4 mr-2" />
              로그인하고 응원하기
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              나중에 하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        defaultMode="signin"
        redirectUrl="/supports"
      />
    </>
  );
}
