import {useState, useEffect, useCallback, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {ContentApi, CategoriesApi} from '@/api';
import {contentStore} from '@/store/contentStore.ts';
import {historyStore} from '@/store/historyStore.ts';
import {categoryStore} from '@/store/categoryStore.ts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ContentCard from '@/components/ContentCard';
import {Icon} from '@/components/icons/Icon';
import SwipeTutorial from '@/components/SwipeTutorial';

interface LearnProps {
}

export default function Learn({}: LearnProps) {
    const navigate = useNavigate();
    const {selectedCategories, categories, setCategories: setCategoriesInStore} = categoryStore();
    const {contentList, setContentList, setLoading} = contentStore();
    const {addToHistory, toggleBookmark, isBookmarked, learnState, updateLearnState, settings, setHasSeenSwipeTutorial} = historyStore();
    const [localLoading, setLocalLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 카테고리 정보 로드 (태그 아이콘 표시용)
    useEffect(() => {
        if (categories.length === 0) {
            loadCategories().then(r => r);
        }
    }, []);

    useEffect(() => {
        if (!settings.hasSeenSwipeTutorial) {
            setShowTutorial(true);
        }
    }, [settings.hasSeenSwipeTutorial]);

    useEffect(() => {
        if (selectedCategories.length === 0) {
            navigate('/category');
            return;
        }
        loadContent().then(r => r);
    }, [selectedCategories]);

    const loadCategories = async () => {
        try {
            const response = await CategoriesApi.getCategories();
            setCategoriesInStore(response.groups, response.totalContent);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadContent = async () => {
        try {
            setLoading(true);
            setLocalLoading(true);
            const categoriesString = selectedCategories.join(',');

            let currentSeed = learnState.seed;
            let currentLastSeenId = learnState.lastSeenId;

            // 카테고리가 변경된 경우에만 seed와 lastSeenId 초기화
            if (learnState.categories !== categoriesString) {
                currentSeed = Math.floor(Math.random() * 1000000);
                currentLastSeenId = 0;
                updateLearnState({
                    categories: categoriesString,
                    seed: currentSeed,
                    lastSeenId: 0,
                });
            }

            // 같은 카테고리면 lastSeenId를 사용해서 이어보기
            // 다른 카테고리면 lastSeenId가 0이므로 처음부터 시작
            const requestParams: any = {
                categories: categoriesString,
                limit: 20,
                seed: currentSeed
            };

            // lastSeenId가 0보다 크면 전달 (이어보기)
            if (currentLastSeenId > 0) {
                requestParams.lastSeenId = currentLastSeenId;
            }

            const response = await ContentApi.getContentList(requestParams);
            setContentList(response.content);

            // lastSeenId는 스크롤 이벤트에서만 업데이트 (실제로 본 것만)
        } catch (error) {
            console.error('Failed to load content:', error);
        } finally {
            setLoading(false);
            setLocalLoading(false);
        }
    };

    const loadMoreContent = useCallback(async () => {
        if (isLoadingMore || contentList.length === 0) return;

        try {
            setIsLoadingMore(true);

            // contentList의 마지막 콘텐츠 ID를 사용 (더 많은 콘텐츠 로딩용)
            const lastContentId = contentList[contentList.length - 1].id;

            const response = await ContentApi.getContentList({
                categories: learnState.categories,
                limit: 20,
                lastSeenId: lastContentId, // contentList의 마지막 ID 사용
                seed: learnState.seed
            });

            setContentList([...contentList, ...response.content]);

            // lastSeenId는 스크롤 이벤트에서만 업데이트 (실제로 본 것만)
        } catch (error) {
            console.error('Failed to load more content:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, learnState.categories, learnState.seed, contentList, setContentList]);

    useEffect(() => {
        if (contentList.length === 0) return;

        // IntersectionObserver는 더 많은 콘텐츠 로딩용으로만 사용
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0');

                        // 더 많은 콘텐츠 로딩만 처리
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

        // 스크롤 종료 시 현재 스냅된 콘텐츠만 히스토리에 추가
        let scrollTimeout: NodeJS.Timeout;
        const handleScrollEnd = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!containerRef.current) return;

                const container = containerRef.current;
                const scrollTop = container.scrollTop;
                const viewportHeight = container.clientHeight;
                const currentIndex = Math.round(scrollTop / viewportHeight);

                if (contentList[currentIndex]) {
                    const currentContent = contentList[currentIndex];
                    addToHistory(currentContent);
                    // lastSeenId 업데이트 (이어보기 위해)
                    updateLearnState({
                        lastSeenId: currentContent.id,
                    });
                }
            }, 200); // 스크롤 멈춘 후 200ms (snap 완료 대기)
        };

        const container = containerRef.current;
        container?.addEventListener('scroll', handleScrollEnd);

        // 첫 화면 자동 히스토리 추가 (1초 후)
        const initialTimeout = setTimeout(() => {
            if (contentList[0] && containerRef.current) {
                const container = containerRef.current;
                const scrollTop = container.scrollTop;
                const viewportHeight = container.clientHeight;
                const currentIndex = Math.round(scrollTop / viewportHeight);

                if (contentList[currentIndex]) {
                    addToHistory(contentList[currentIndex]);
                    updateLearnState({
                        lastSeenId: contentList[currentIndex].id,
                    });
                }
            }
        }, 1000);

        return () => {
            observer.disconnect();
            clearTimeout(scrollTimeout);
            clearTimeout(initialTimeout);
            container?.removeEventListener('scroll', handleScrollEnd);
        };
    }, [contentList, isLoadingMore, loadMoreContent]);

    const handleToggleBookmark = (contentId: number) => {
        const content = contentList.find(c => c.id === contentId);
        if (content) {
            toggleBookmark(content);
        }
    };

    const handleCloseTutorial = () => {
        setShowTutorial(false);
        setHasSeenSwipeTutorial(true);
    };

    if (localLoading || contentList.length === 0) {
        return <LoadingSpinner message="콘텐츠 로딩 중..."/>;
    }

    return (
        <div className="h-screen bg-[#0A0A0A] overflow-hidden" style={{ height: '100dvh' }}>
            {showTutorial && <SwipeTutorial onClose={handleCloseTutorial} />}

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
                        className="h-screen snap-start snap-always flex items-center justify-center px-4 pt-[60px] relative overflow-y-auto"
                    >
                        <div className="w-full">
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
