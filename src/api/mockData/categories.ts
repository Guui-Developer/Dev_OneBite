import type { ApiResponse } from '@/types/common';
import type { CategoriesData } from '@/api/model/response/category';

export const mockCategoriesResponse: ApiResponse<CategoriesData> = {
    success: true,
    data: {
        groups: [
            {
                group: '언어',
                groupKey: 'language',
                icon: 'https://d1yviy8q74fot9.cloudfront.net/types.svg',
                categories: [
                    {
                        label: 'JavaScript',
                        key: 'javascript',
                        icon: 'https://simpleicons.org/icons/javascript.svg',
                        count: 245,
                    },
                    {
                        label: 'TypeScript',
                        key: 'typescript',
                        icon: 'https://d1yviy8q74fot9.cloudfront.net/types.svg',
                        count: 187,
                    },
                    {
                        label: 'Python',
                        key: 'python',
                        icon: 'https://simpleicons.org/icons/python.svg',
                        count: 156,
                    },
                ],
            },
            {
                group: '프레임워크',
                groupKey: 'framework',
                icon: 'https://d1yviy8q74fot9.cloudfront.net/types.svg',
                categories: [
                    {
                        label: 'React',
                        key: 'react',
                        icon: 'https://simpleicons.org/icons/react.svg',
                        count: 312,
                    },
                    {
                        label: 'Vue',
                        key: 'vue',
                        icon: 'https://simpleicons.org/icons/vuedotjs.svg',
                        count: 98,
                    },
                    {
                        label: 'Next.js',
                        key: 'nextjs',
                        icon: 'https://simpleicons.org/icons/nextdotjs.svg',
                        count: 142,
                    },
                ],
            },
            {
                group: '공통',
                groupKey: 'common',
                icon: 'https://d1yviy8q74fot9.cloudfront.net/types.svg',
                categories: [
                    {
                        label: 'Git',
                        key: 'git',
                        icon: 'https://simpleicons.org/icons/git.svg',
                        count: 45,
                    },
                    {
                        label: '개발 상식',
                        key: 'dev-common',
                        icon: 'https://simpleicons.org/icons/nextdotjs.svg',
                        count: 62,
                    },
                ],
            },
        ],
        totalCategories: 8,
        totalContent: 1247,
    },
};
