import {useState, useEffect, useCallback, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {ContentApi} from '@/api';
import {contentStore} from '@/store/contentStore.ts';
import {historyStore} from '@/store/historyStore.ts';
import {categoryStore} from '@/store/categoryStore.ts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ContentCard from '@/components/ContentCard';
import {Icon} from '@/components/icons/Icon';

interface LearnProps {
}

export default function Learn({}: LearnProps) {
    const navigate = useNavigate();
    const {selectedCategories} = categoryStore();
    const {contentList, setContentList, setLoading} = contentStore();
    const {addToHistory, toggleBookmark, isBookmarked, learnState, updateLearnState} = historyStore();
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
            const categoriesString = selectedCategories.join(',');

            if (learnState.categories !== categoriesString) {
                updateLearnState({
                    categories: categoriesString,
                    seed: Math.floor(Math.random() * 1000000),
                    lastSeenId: 0,
                });
            }

            const response = await ContentApi.getContentList({
                categories: categoriesString,
                limit: 20,
                lastSeenId: 0,
                seed: learnState.seed,
            });
            setContentList(response.content);

            if (response.content.length > 0) {
                updateLearnState({
                    lastSeenId: response.content[response.content.length - 1].id,
                });
            }
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
                categories: learnState.categories,
                limit: 20,
                lastSeenId: learnState.lastSeenId,
                seed: learnState.seed,
            });

            setContentList([...contentList, ...response.content]);

            if (response.content.length > 0) {
                updateLearnState({
                    lastSeenId: response.content[response.content.length - 1].id,
                });
            }
        } catch (error) {
            console.error('Failed to load more content:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, learnState, contentList, setContentList, updateLearnState]);

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
                            loadMoreContent().then(r => r);
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
        const content = contentList.find(c => c.id === contentId);
        if (content) {
            toggleBookmark(content);
        }
    };

    if (localLoading || contentList.length === 0) {
        return <LoadingSpinner message="콘텐츠 로딩 중..."/>;
    }

    return (
        <div className="h-screen bg-[#0A0A0A] overflow-hidden">
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-[#2D2D2D]">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => navigate('/category')}
                        className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                    >
                        <Icon name="Settings" type="lucide" size={20} className="text-[#B0B0B0]"/>
                    </button>

                    <div className="flex items-center gap-2">
                        <Icon name="logo" size={24}/>
                        <span className="text-lg font-bold text-white">
              개발<span className="text-[#00D9FF]"> 한입</span>
            </span>
                    </div>

                    <button
                        onClick={() => navigate('/history')}
                        className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                    >
                        <Icon name="History" type="lucide" size={20} className="text-[#B0B0B0]"/>
                    </button>
                </div>
            </header>

            <div
                ref={containerRef}
                className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
            >

                {contentList.map((content, index) => (
                    <div
                        key={content.id}
                        data-index={index}
                        className="h-screen snap-start snap-always flex items-center justify-center p-4 pt-20 pb-8 relative overflow-y-auto"
                    >
                        <div className="max-w-2xl w-full">
                            <ContentCard
                                content={content}
                                isBookmarked={isBookmarked(content.id)}
                                onToggleBookmark={handleToggleBookmark}
                            />
                        </div>
                    </div>
                ))}

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
