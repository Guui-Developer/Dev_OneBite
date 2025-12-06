import { useNavigate } from 'react-router-dom';
import { historyStore } from '@/store/historyStore.ts';
import { Icon } from '@/components/icons/Icon';
import PageHeader from '@/components/PageHeader';
import BackgroundGradient from '@/components/BackgroundGradient';
import StatsCard from '@/components/StatsCard';
import HistoryItem from '@/components/HistoryItem';
import {categoryStore} from "@/store/categoryStore.ts";

interface HistoryProps {}

export default function History({}: HistoryProps) {
  const navigate = useNavigate();
  const { history, stats, bookmarks, clearHistory, clearBookmarks, toggleBookmark, isBookmarked, reset: resetHistory } = historyStore();
  const { reset: resetCategory } = categoryStore();

  const handleClearHistory = () => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      clearHistory();
    }
  };

  const handleClearBookmarks = () => {
    if (window.confirm('모든 북마크를 삭제하시겠습니까?')) {
      clearBookmarks();
    }
  };

  const handleResetAll = () => {
    if (window.confirm('⚠️ 모든 데이터를 삭제하고 앱을 초기화하시겠습니까?\n\n- 학습 히스토리\n- 북마크\n- 학습 진행 상태\n- 모든 설정\n\n이 작업은 되돌릴 수 없습니다.')) {
      localStorage.clear();
      resetHistory();
      resetCategory();
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] relative">
      <BackgroundGradient variant="cyan-purple" />

      <PageHeader
        title="학습 히스토리"
        showBack={true}
        rightAction={
          <button
            onClick={handleResetAll}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
            title="앱 초기화"
          >
            <Icon name="RotateCcw" type="lucide" size={20} className="text-red-500 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        }
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 pb-6 relative z-10">
        <StatsCard stats={stats} />

        {/* Bookmarks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Icon name="Heart" type="lucide" size={20} className="text-red-500 fill-current" />
              북마크
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#B0B0B0]">{bookmarks.length}개</span>
              {bookmarks.length > 0 && (
                <button
                  onClick={handleClearBookmarks}
                  className="p-1.5 hover:bg-[#1A1A1A] rounded-lg transition-colors text-red-500"
                >
                  <Icon name="Trash2" type="lucide" size={16} />
                </button>
              )}
            </div>
          </div>

          {bookmarks.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2D2D2D] text-center">
              <div className="text-3xl mb-2">❤️</div>
              <p className="text-sm text-[#B0B0B0]">북마크한 콘텐츠가 없습니다.</p>
              <p className="text-xs text-[#6B7280] mt-1">
                마음에 드는 콘텐츠를 저장해보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {bookmarks.slice(0, 10).map((item, index) => (
                <HistoryItem
                  key={`bookmark-${item.content.id}-${index}`}
                  content={item.content}
                  viewedAt={item.bookmarkedAt}
                  isBookmarked={true}
                  onToggleBookmark={toggleBookmark}
                  showViewedAt={false}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* History List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Icon name="Clock" type="lucide" size={20} className="text-[#00D9FF]" />
              최근 학습
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#B0B0B0]">{history.length}개</span>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 hover:bg-[#1A1A1A] rounded-lg transition-colors text-red-500"
                >
                  <Icon name="Trash2" type="lucide" size={16} />
                </button>
              )}
            </div>
          </div>

          {history.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#1A1A1A] border border-[#2D2D2D] text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-[#B0B0B0] mb-4">
                아직 학습한 콘텐츠가 없습니다.
              </p>
              <button
                onClick={() => navigate('/learn')}
                className="px-6 py-3 rounded-lg bg-[#00D9FF] text-[#0A0A0A] font-medium hover:bg-[#00B8E6] transition-all"
              >
                학습 시작하기
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => (
                <HistoryItem
                  key={`history-${item.content.id}-${index}`}
                  content={item.content}
                  viewedAt={item.viewedAt}
                  isBookmarked={isBookmarked(item.content.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-5 pt-3 border-t border-[#2D2D2D] text-center">
          <button
            onClick={() => navigate('/terms')}
            className="text-sm text-[#6B7280] hover:text-[#00D9FF] transition-colors inline-flex items-center gap-1"
          >
            <Icon name="FileText" type="lucide" size={14} />
            이용약관
          </button>
        </div>
      </main>
    </div>
  );
}
