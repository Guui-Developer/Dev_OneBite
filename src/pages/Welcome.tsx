import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {cn} from '../lib/utils'
import {Icon} from '@/components/icons'
import {categoryStore} from '../store/categoryStore.ts'
import {CategoriesApi} from '@/api'
import type {CategoryGroup} from '@/api/model/response/category'
import LoadingSpinner from '@/components/LoadingSpinner'
import BackgroundGradient from '@/components/BackgroundGradient'

export function Welcome() {
    const navigate = useNavigate()
    const {selectedCategories, setSelectedCategories, setCategories: setCategoriesInStore} = categoryStore()
    const [categories, setCategories] = useState<CategoryGroup[]>([])
    const [localLoading, setLocalLoading] = useState(true)

    useEffect(() => {
        loadCategories().then(r => r)
    }, [])

    const loadCategories = async () => {
        try {
            setLocalLoading(true)
            const response = await CategoriesApi.getCategories()
            setCategories(response.groups)
            setCategoriesInStore(response.groups, response.totalContent)
        } catch (error) {
            console.error('Failed to load categories:', error)
            setCategories([])
        } finally {
            setLocalLoading(false)
        }
    }

    const toggleInterest = (id: string) => {
        const newSelected = selectedCategories.includes(id)
            ? selectedCategories.filter((key) => key !== id)
            : [...selectedCategories, id]
        setSelectedCategories(newSelected)
    }

    const handleStart = () => {
        if (selectedCategories.length > 0) {
            navigate('/learn')
        }
    }

    if (localLoading) {
        return <LoadingSpinner message="카테고리 로딩 중..." />
    }

    return (
        <div className="flex flex-col h-screen p-5 relative overflow-hidden bg-[#0A0A0A]">
                <BackgroundGradient variant="green-purple" />

            <header className="mt-5 mb-4 relative z-20">
                <div className="flex items-start justify-between mb-3">
                    <div
                        className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 shadow-[0_0_20px_-5px_rgba(0,217,255,0.3)] backdrop-blur-sm">
                        <Icon name="logo" size={55}/>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center gap-1.5">
                        <Icon name="MoonStar" type="lucide" size={15}/>
                        <span className="text-xs font-medium text-yellow-500">Beta</span>
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
                    개발<span className="text-[#00D9FF]"> 한입</span>
                </h1>

                <p className="text-[#B0B0B0] text-lg leading-relaxed">
                    바쁜 당신을 위한 <br/>
                    <span className="text-white font-semibold relative inline-block">
            하루 5초
            <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#00D9FF]/20 -z-10 rounded-full"></span>
          </span>{' '}
                    개발 충전소 ⚡️
                </p>
            </header>

            <div className="flex-1 overflow-y-auto space-y-6 relative z-10 min-h-0">
                {categories.map((group) => (
                    <section key={group.groupKey}>
                        <div className="flex gap-2 items-center mb-3">
                            <img src={group.icon} className="w-4 h-4 brightness-110 saturate-110"
                                 alt={group.groupLabel}/>
                            <h3 className="text-xl font-semibold text-[#E0E0E0]">{group.groupLabel}</h3>
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

            <div className="flex-shrink-0 pt-4 pb-5 px-5 -mx-5 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent relative z-20">
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
    )
}