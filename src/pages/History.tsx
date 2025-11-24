import { useNavigate } from 'react-router-dom';
import { historyStore } from '@/store/historyStore.ts';
import { Icon } from '@/components/icons/Icon';

interface HistoryProps {}

export default function History({}: HistoryProps) {
  const navigate = useNavigate();
  const { history, stats, bookmarks, clearHistory, toggleBookmark, isBookmarked } = historyStore();

  const handleClearHistory = () => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      clearHistory();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const getTypeEmoji = (type: string): string => {
    switch (type) {
      case 'code_tip':
        return '💡';
      case 'bug_challenge':
        return '🐛';
      case 'code_review':
        return '👨‍💻';
      case 'meme':
        return '😂';
      case 'interview':
        return '🎯';
      default:
        return '📦';
    }
  };

  const goalProgress = stats.total > 0 ? Math.min((stats.today / 10) * 100, 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#00D9FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 px-5 py-4 flex items-center justify-between backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
        >
          <Icon name="ArrowLeft" type="lucide" size={20} className="text-[#B0B0B0]" />
        </button>

        <h1 className="text-xl font-bold text-white">학습 히스토리</h1>

        <button
          onClick={handleClearHistory}
          className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-red-500 disabled:opacity-30"
          disabled={history.length === 0}
        >
          <Icon name="Trash2" type="lucide" size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 pb-6 relative z-10">
        {/* Stats Section */}
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 to-purple-500/20 text-white border border-[#00D9FF]/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Icon name="Flame" type="lucide" size={28} className="fill-orange-400 text-orange-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{stats.streak}일 연속!</h2>
              <p className="text-sm text-blue-100">멈추지 말고 계속하세요 🔥</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Calendar" type="lucide" size={16} />
                <span className="text-xs opacity-90">오늘 학습</span>
              </div>
              <span className="text-2xl font-bold">{stats.today}개</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="TrendingUp" type="lucide" size={16} />
                <span className="text-xs opacity-90">총 학습</span>
              </div>
              <span className="text-2xl font-bold">{stats.total}개</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="opacity-90">일일 목표 (10개)</span>
              <span className="font-bold">{Math.round(goalProgress)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
        </div>

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
                  <div
                    key={`bookmark-${item.content.id}-${index}`}
                    className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#444] transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getTypeEmoji(item.content.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm line-clamp-2">
                            {item.content.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(item.content.id);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-[#2D2D2D] rounded transition-all text-red-500"
                          >
                            <Icon name="Heart" type="lucide" size={16} className="fill-current" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {item.content.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs rounded-full bg-[#2D2D2D] text-[#B0B0B0]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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
                <div
                  key={`history-${item.content.id}-${index}`}
                  className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#444] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {getTypeEmoji(item.content.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm line-clamp-2">
                          {item.content.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(item.content.id);
                          }}
                          className={`flex-shrink-0 p-1 hover:bg-[#2D2D2D] rounded transition-all ${
                            isBookmarked(item.content.id) ? 'text-red-500' : 'text-[#6B7280]'
                          }`}
                        >
                          <Icon
                            name="Heart"
                            type="lucide"
                            size={16}
                            className={isBookmarked(item.content.id) ? 'fill-current' : ''}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {item.content.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs rounded-full bg-[#2D2D2D] text-[#B0B0B0]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-[#6B7280] whitespace-nowrap ml-2">
                          {formatDate(item.viewedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
