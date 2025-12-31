import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { LearningData } from '@/api/model/response/learndata';
import ContentCard from '@/components/ContentCard';
import { Icon } from '@/components/icons/Icon';

interface ContentModalProps {
  content: LearningData;
  isBookmarked: boolean;
  onToggleBookmark: (content: LearningData) => void;
  onClose: () => void;
}

export default function ContentModal({
  content,
  isBookmarked,
  onToggleBookmark,
  onClose,
}: ContentModalProps) {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // 위로만 드래그 가능
    if (diff < 0) {
      currentYRef.current = currentY;
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const diff = currentYRef.current - startYRef.current;

    // 100px 이상 위로 드래그하면 닫기
    if (diff < -100) {
      handleClose();
    } else {
      // 원위치로 복귀
      setTranslateY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startYRef.current = e.clientY;
    currentYRef.current = e.clientY;
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const currentY = e.clientY;
    const diff = currentY - startYRef.current;

    // 위로만 드래그 가능
    if (diff < 0) {
      currentYRef.current = currentY;
      setTranslateY(diff);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const diff = currentYRef.current - startYRef.current;

    // 100px 이상 위로 드래그하면 닫기
    if (diff < -100) {
      handleClose();
    } else {
      // 원위치로 복귀
      setTranslateY(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleToggleBookmarkWrapper = () => {
    onToggleBookmark(content);
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0A0A0A] transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div
        ref={containerRef}
        className={`h-screen snap-start snap-always flex items-start justify-center px-4 py-4 relative overflow-y-auto transition-transform duration-300 max-w-md mx-auto ${
          isDragging ? '' : 'ease-out'
        }`}
        style={{
          transform: `translateY(${translateY}px)`,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#1A1A1A]/80 hover:bg-[#2D2D2D] rounded-full transition-colors backdrop-blur-sm"
          aria-label="닫기"
        >
          <Icon name="X" type="lucide" size={20} className="text-[#B0B0B0]" />
        </button>

        {/* 드래그 인디케이터 */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
          <div className="w-12 h-1 bg-[#B0B0B0]/30 rounded-full"></div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="w-full">
          <ContentCard
            content={content}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmarkWrapper}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
