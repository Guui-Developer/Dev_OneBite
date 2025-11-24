import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { categoryStore } from '@/store/categoryStore.ts';
import { Icon } from '@/components/icons/Icon';
import { CategoriesApi } from '@/api';
import type { CategoryGroup } from '@/api/model/response/category';

interface CategoryPageProps {}

export default function Category({}: CategoryPageProps) {
  const navigate = useNavigate();
  const { selectedCategories, setSelectedCategories } = categoryStore();
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLocalLoading(true);
      const response = await CategoriesApi.getCategories();
      if (response.success) {
        setCategories(response.data.groups);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const toggleInterest = (id: string) => {
    const newSelected = selectedCategories.includes(id)
      ? selectedCategories.filter((key) => key !== id)
      : [...selectedCategories, id];
    setSelectedCategories(newSelected);
  };

  const handleStart = () => {
    if (selectedCategories.length > 0) {
      navigate('/learn');
    }
  };

  if (localLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9FF]"></div>
        <p className="mt-4 text-[#B0B0B0]">카테고리 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-5 relative overflow-hidden bg-[#0A0A0A]">
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-green-700/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[50%] left-[-10%] w-[200px] h-[200px] bg-purple-600/30 rounded-full blur-[100px] pointer-events-none -z-10" />

      <header className="mt-5 mb-4 relative z-20">
        <div className="flex items-start justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <Icon name="ArrowLeft" type="lucide" size={24} className="text-[#B0B0B0]" />
          </button>
          <div className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center gap-1.5">
            <Icon name="MoonStar" type="lucide" size={15} />
            <span className="text-xs font-medium text-yellow-500">Beta</span>
          </div>
        </div>

        <p className="text-[#B0B0B0] text-lg leading-relaxed">
          관심 분야를 선택하세요
        </p>
        <p className="text-[#B0B0B0] text-sm leading-relaxed">
          (여러 개 선택 가능)
        </p>
      </header>

      <div className="flex-1 overflow-y-auto pb-24 space-y-6 relative z-10">
        {categories.map((group) => (
          <section key={group.groupKey}>
            <div className="flex gap-2 items-center mb-3">
              <img src={group.icon} className="w-4 h-4 brightness-110 saturate-110" alt={group.group}/>
              <h3 className="text-xl font-semibold text-[#E0E0E0]">{group.group}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => toggleInterest(category.key)}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2',
                    selectedCategories.includes(category.key)
                      ? 'bg-[#00D9FF]/10 border-2 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_8px_rgba(0,217,255,0.3)]'
                      : 'bg-[#1A1A1A] border border-[#2D2D2D] text-[#B0B0B0] hover:border-[#444]'
                  )}
                >
                  <img
                    src={category.icon}
                    alt={category.label}
                    className="w-5 h-5 brightness-110 saturate-110"
                  />
                  {category.label}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent z-20">
        <button
          onClick={handleStart}
          disabled={selectedCategories.length === 0}
          className={cn(
            'w-full h-[56px] text-lg font-bold rounded-xl transition-all duration-200',
            selectedCategories.length > 0
              ? 'bg-[#00D9FF] text-[#0A0A0A] hover:bg-[#00B8E6] hover:scale-[1.02] shadow-lg shadow-[#00D9FF]/20'
              : 'bg-[#2D2D2D] text-[#6B7280] cursor-not-allowed'
          )}
        >
          {selectedCategories.length > 0 ? `시작하기 (${selectedCategories.length}개 선택됨)` : '시작하기'}
        </button>
      </div>
    </div>
  );
}
