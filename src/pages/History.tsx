import { useNavigate } from 'react-router-dom';
import { historyStore } from '@/store/historyStore.ts';
import { Icon } from '@/components/icons/Icon';
import PageHeader from '@/components/PageHeader';
import BackgroundGradient from '@/components/BackgroundGradient';
import StatsCard from '@/components/StatsCard';
import HistoryItem from '@/components/HistoryItem';

interface HistoryProps {}

export default function History({}: HistoryProps) {
  const navigate = useNavigate();
  const { history, stats, bookmarks, clearHistory, toggleBookmark, isBookmarked } = historyStore();

  const handleClearHistory = () => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      clearHistory();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      <BackgroundGradient variant="cyan-purple" />

      <PageHeader
        title="학습 히스토리"
        showBack={true}
        rightAction={
          <button
            onClick={handleClearHistory}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-red-500 disabled:opacity-30"
            disabled={history.length === 0}
          >
            <Icon name="Trash2" type="lucide" size={20} />
          </button>
        }
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 pb-6 relative z-10">
        <StatsCard stats={stats} />

        {/* Bookmarks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Icon name="Heart" type="lucide" size={20} className="text-red-500 fill-current" />
              북마크
            </h3>
            <span className="text-sm text-[#B0B0B0]">{bookmarks.length}개</span>
          </div>

          {bookmarks.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#1A1A1A] border border-[#2D2D2D] text-center">
              <div className="text-4xl mb-3">❤️</div>
              <p className="text-[#B0B0B0]">북마크한 콘텐츠가 없습니다.</p>
              <p className="text-sm text-[#6B7280] mt-1">
                마음에 드는 콘텐츠를 저장해보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history
                .filter((item) => isBookmarked(item.content.id))
                .map((item, index) => (
                  <HistoryItem
                    key={`bookmark-${item.content.id}-${index}`}
                    content={item.content}
                    viewedAt={item.viewedAt}
                    isBookmarked={true}
                    onToggleBookmark={toggleBookmark}
                    showViewedAt={false}
                  />
                ))}
            </div>
          )}
        </div>

        {/* History List */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">최근 학습</h3>

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
              {history.slice(0, 20).map((item, index) => (
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
      </main>
    </div>
  );
}
