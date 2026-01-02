import { useState, useEffect } from 'react';
import { Icon } from '@/components/icons/Icon';

interface SwipeTutorialProps {
  onClose: () => void;
}

export default function SwipeTutorial({ onClose }: SwipeTutorialProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div className="h-full flex flex-col items-center justify-center px-8">
        {/* Swipe Animation */}
        <div className="relative mb-8">
          <div className="flex flex-col items-center gap-3 animate-bounce">
            <Icon name="ChevronUp" type="lucide" size={40} className="text-[#00D9FF]" />
            <div className="w-12 h-1 bg-[#00D9FF] rounded-full opacity-50"></div>
            <Icon name="ChevronDown" type="lucide" size={40} className="text-[#00D9FF]" />
          </div>
        </div>

        {/* Guide Text */}
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-2xl font-bold text-white">
            위아래로 스와이프하세요
          </h2>
          <p className="text-[#B0B0B0] text-base">
            숏츠처럼 스크롤하여<br />
            다양한 개발 콘텐츠를 만나보세요
          </p>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleClose}
          className="px-6 py-3 bg-[#00D9FF] text-[#0A0A0A] font-semibold rounded-xl hover:bg-[#00B8E6] transition-colors"
        >
          시작하기
        </button>

        {/* Tap to close hint */}
        <p className="text-[#6B7280] text-sm mt-6">
          화면을 탭하여 건너뛰기
        </p>
      </div>
    </div>
  );
}
