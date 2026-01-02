import { useState, useEffect } from 'react';
import { Icon } from '@/components/icons/Icon';

interface PWATutorialProps {
  onClose: () => void;
}

export default function PWATutorial({ onClose }: PWATutorialProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
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
        {/* App Icon */}
        <div className="mb-6 p-4 rounded-3xl bg-[#00D9FF]/10 border-2 border-[#00D9FF]/30 shadow-[0_0_30px_rgba(0,217,255,0.3)]">
          <Icon name="logo" size={64} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3 text-center">
          홈 화면에 추가하세요
        </h2>

        <p className="text-[#B0B0B0] text-base mb-8 text-center">
          앱처럼 빠르고 편리하게<br />
          개발 한입을 즐기세요
        </p>

        {/* Instructions */}
        <div className="w-full max-w-sm mb-8 p-5 rounded-2xl bg-[#1A1A1A] border border-[#2D2D2D]">
          {isIOS ? (
            // iOS Instructions
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    하단 <Icon name="Share" type="lucide" size={16} className="inline mx-1" />
                    <span className="font-semibold">(공유)</span> 버튼 탭
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">"홈 화면에 추가"</span> 선택
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">"추가"</span> 버튼 탭
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Android Instructions
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    우측 상단 <Icon name="MoreVertical" type="lucide" size={16} className="inline mx-1" />
                    <span className="font-semibold">(메뉴)</span> 버튼 탭
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">"홈 화면에 추가"</span> 또는<br />
                    <span className="font-semibold">"앱 설치"</span> 선택
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">"설치"</span> 버튼 탭
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="px-8 py-3 bg-[#00D9FF] text-[#0A0A0A] font-semibold rounded-xl hover:bg-[#00B8E6] transition-colors"
        >
          나중에 하기
        </button>

        {/* Tap to close hint */}
        <p className="text-[#6B7280] text-sm mt-6">
          화면을 탭하여 건너뛰기
        </p>
      </div>
    </div>
  );
}
