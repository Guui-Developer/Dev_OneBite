export interface CategoryResponseData {
    success: boolean
    data: CategoriesData
}

export interface CategoriesData {
    groups: CategoryGroup[]
    totalCategories: number
    totalContent: number
}

export interface CategoryGroup {
    group: string
    groupKey: string
    icon: string
    categories: Category[]
}

export interface Category {
    label: string
    key: string
    icon: string
    count: number
}
