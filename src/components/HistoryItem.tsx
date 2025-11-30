import { Icon } from '@/components/icons/Icon';
import type { LearningData } from '@/api/model/response/learndata';
import { categoryStore } from '@/store/categoryStore';

interface CategoryInfo {
  icon: string;
  label: string;
}

interface HistoryItemProps {
  content: LearningData;
  viewedAt?: string;
  isBookmarked: boolean;
  onToggleBookmark: (content: LearningData) => void;
  showViewedAt?: boolean;
  compact?: boolean;
}

function getTypeEmoji(type: string): string {
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
}

function formatDate(dateString: string) {
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
}

export default function HistoryItem({
  content,
  viewedAt,
  isBookmarked,
  onToggleBookmark,
  showViewedAt = true,
  compact = false
}: HistoryItemProps) {
  const { categories } = categoryStore();
  const categoryMap = new Map<string, CategoryInfo>();

  categories.forEach(group => {
    group.categories.forEach(category => {
      categoryMap.set(category.key, {
        icon: category.icon,
        label: category.label,
      });
    });
  });

  const getCategoryInfo = (categoryKey: string): CategoryInfo | undefined => {
    return categoryMap.get(categoryKey);
  };

  return (
    <div className={`${compact ? 'p-2.5' : 'p-4'} rounded-xl bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#444] transition-all`}>
      <div className="flex items-start gap-2.5">
        <div className={`${compact ? 'text-lg' : 'text-2xl'} flex-shrink-0`}>
          {getTypeEmoji(content.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-semibold text-white ${compact ? 'text-sm line-clamp-1' : 'text-sm line-clamp-2'}`}>
              {content.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(content);
              }}
              className={`flex-shrink-0 p-1 hover:bg-[#2D2D2D] rounded transition-all ${
                isBookmarked ? 'text-red-500' : 'text-[#6B7280]'
              }`}
            >
              <Icon
                name="Heart"
                type="lucide"
                size={compact ? 14 : 16}
                className={isBookmarked ? 'fill-current' : ''}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {content.tags.slice(0, compact ? 1 : 2).map((tag, idx) => {
                const categoryInfo = getCategoryInfo(tag);
                return (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-full bg-[#2D2D2D] text-[#B0B0B0] ${compact ? 'text-[11px]' : 'text-xs'}`}
                  >
                    {categoryInfo?.label || tag}
                  </span>
                );
              })}
            </div>
            {showViewedAt && viewedAt && (
              <p className={`text-[#6B7280] whitespace-nowrap ml-2 ${compact ? 'text-[11px]' : 'text-xs'}`}>
                {formatDate(viewedAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
