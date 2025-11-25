import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ContentApi } from '@/api';
import { contentStore } from '@/store/contentStore.ts';
import { historyStore } from '@/store/historyStore.ts';
import { categoryStore } from '@/store/categoryStore.ts';
import type { LearningData } from '@/api/model/response/learndata';
import { isCodeTip, isBugChallenge, isCodeReview, isMeme, isInterview } from '@/api/model/response/learndata';
import CodeBox from '@/components/CodeBox';
import MarkdownBox from '@/components/MarkdownBox';
import Card from '@/components/Card';
import { Icon } from '@/components/icons/Icon';

interface LearnProps {}

export default function Learn({}: LearnProps) {
  const navigate = useNavigate();
  const { selectedCategories } = categoryStore();
  const { contentList, setContentList, setLoading } = contentStore();
  const { addToHistory, toggleBookmark, isBookmarked } = historyStore();
  const [localLoading, setLocalLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      navigate('/category');
      return;
    }
    loadContent().then(r => r);
  }, [selectedCategories]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setLocalLoading(true);
      const response = await ContentApi.getContentList({
        limit: 20,
        random: true,
      });

      setContentList(response.content);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  const loadMoreContent = useCallback(async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const response = await ContentApi.getContentList({
        limit: 20,
        random: true,
      });

        setContentList([...contentList, ...response.content])
    } catch (error) {
      console.error('Failed to load more content:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, selectedCategories, contentList, setContentList]);

  useEffect(() => {
    if (contentList.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');

            const content = contentList[index];
            if (content) {
              addToHistory(content);
            }

            if (index >= contentList.length - 3 && !isLoadingMore) {
              loadMoreContent();
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    const elements = containerRef.current?.querySelectorAll('[data-index]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [contentList, isLoadingMore, loadMoreContent, addToHistory]);

  const handleToggleBookmark = (contentId: number) => {
    toggleBookmark(contentId);
  };

  if (localLoading || contentList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9FF]"></div>
        <p className="mt-4 text-[#B0B0B0]">콘텐츠 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-[#2D2D2D]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate('/category')}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <Icon name="Settings" type="lucide" size={20} className="text-[#B0B0B0]" />
          </button>

          <div className="flex items-center gap-2">
            <Icon name="logo" size={40}/>
            <span className="text-lg font-bold text-white">
              개발<span className="text-[#00D9FF]">한입</span>
            </span>
          </div>

          <button
            onClick={() => navigate('/history')}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <Icon name="History" type="lucide" size={20} className="text-[#B0B0B0]" />
          </button>
        </div>
      </header>

      {/* Shorts-style Content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .shorts-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {contentList.map((content, index) => (
          <div
            key={content.id}
            data-index={index}
            className="h-screen snap-start snap-always flex items-center justify-center p-4 pt-20 pb-8 relative overflow-y-auto"
          >
            <div className="max-w-2xl w-full">
              <Card padding="lg" className="bg-[#1A1A1A] border border-[#2D2D2D]">
                {/* Type Badge */}
                <div className="mb-3 flex items-center justify-between">
                  <span className={cn(
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                    getTypeBadgeStyles(content.type)
                  )}>
                    {getTypeLabel(content.type)}
                  </span>

                  <button
                    onClick={() => handleToggleBookmark(content.id)}
                    className={cn(
                      'p-2 hover:bg-[#2D2D2D] rounded-lg transition-all',
                      isBookmarked(content.id) && 'text-[#00D9FF]'
                    )}
                  >
                    <Icon
                      name="Heart"
                      type="lucide"
                      size={20}
                      className={cn(isBookmarked(content.id) && 'fill-current')}
                    />
                  </button>
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold text-white mb-4">
                  {content.title}
                </h1>

                {/* Render content based on type */}
                <div className="mb-4">
                  {renderContentByType(content)}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-[#2D2D2D] text-[#B0B0B0] border border-[#444]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoadingMore && (
          <div className="h-screen snap-start flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9FF]"></div>
              <p className="mt-4 text-[#B0B0B0]">더 많은 콘텐츠 로딩 중...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getTypeBadgeStyles(type: string): string {
  switch (type) {
    case 'code_tip':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'bug_challenge':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    case 'code_review':
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'meme':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'interview':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    default:
      return 'bg-[#2D2D2D] text-[#B0B0B0] border border-[#444]';
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'code_tip':
      return '💡 코드 팁';
    case 'bug_challenge':
      return '🐛 버그 챌린지';
    case 'code_review':
      return '👨‍💻 코드 리뷰';
    case 'meme':
      return '😂 밈';
    case 'interview':
      return '🎯 면접 질문';
    default:
      return '📦 콘텐츠';
  }
}

function renderContentByType(content: LearningData) {
  if (isCodeTip(content)) {
    return (
      <div className="space-y-4">
        <CodeBox code={content.code} title="Code" />
        <MarkdownBox content={content.description} />
      </div>
    );
  }

  if (isBugChallenge(content)) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">문제 코드</h3>
          <CodeBox code={content.code} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">해답</h3>
          <MarkdownBox content={content.answer} />
        </div>
      </div>
    );
  }

  if (isCodeReview(content)) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-2">❌ Before</h3>
          <CodeBox code={content.before} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-green-400 mb-2">✅ After</h3>
          <CodeBox code={content.after} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">피드백</h3>
          <MarkdownBox content={content.feedback} />
        </div>
      </div>
    );
  }

  if (isMeme(content)) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <img
            src={content.image}
            alt={content.title}
            className="max-w-full h-auto rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <MarkdownBox content={content.description} />
      </div>
    );
  }

  if (isInterview(content)) {
    return (
      <div className="space-y-4">
        <div className="bg-[#00D9FF]/10 p-4 rounded-lg border border-[#00D9FF]/30">
          <h3 className="text-sm font-semibold text-[#00D9FF] mb-2">질문</h3>
          <p className="text-white text-sm">{content.question}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">답변</h3>
          <MarkdownBox content={content.answer} />
        </div>
        {content.tail && (
          <div className="bg-[#2D2D2D] p-3 rounded-lg border border-[#444]">
            <p className="text-sm text-[#B0B0B0]">{content.tail}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
