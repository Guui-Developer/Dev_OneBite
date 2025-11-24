import type { ApiResponse } from '@/types/common';
import type { LearningData, GetLearningDataListData } from '@/api/model/response/learndata';

const mockContentItems: LearningData[] = [
  {
    id: 1,
    type: 'code_tip',
    title: '💡 배열 마지막 요소 접근',
    code: `const arr = [1, 2, 3, 4, 5]
arr.at(-1) // 5
arr.at(-2) // 4`,
    description: `## 배열 마지막 요소 접근

배열의 마지막 요소에 접근할 때 \`.at(-1)\`을 사용하면 더 깔끔합니다.
**ES2022**부터 지원됩니다!`,
    tags: ['JavaScript', 'ES2022', 'Array'],
    createdAt: '2024-11-20T10:00:00Z',
  },
  {
    id: 2,
    type: 'bug_challenge',
    title: '🐛 useState 클로저 트랩',
    code: `const [count, setCount] = useState(0)

setTimeout(() => {
  setCount(count + 1)
}, 1000)

setTimeout(() => {
  setCount(count + 1)
}, 2000)`,
    answer: `## 문제점

\`count\`가 클로저에 캡처되어 두 setTimeout 모두 \`count = 0\`을 참조합니다.
따라서 2초 후 count는 2가 아닌 1이 됩니다.

### 왜 발생하나요?
- 클로저는 함수가 선언될 때의 변수를 캡처
- \`count\`는 0으로 고정됨
- 함수형 업데이트는 React가 최신 값을 제공`,
    tags: ['React', 'useState', 'Closure', 'Hook'],
    createdAt: '2024-11-21T10:00:00Z',
  },
  {
    id: 3,
    type: 'code_review',
    title: '👨‍💻 배열 중복 제거 개선',
    before: `const unique = []
for(let i = 0; i < arr.length; i++) {
  if(!unique.includes(arr[i])) {
    unique.push(arr[i])
  }
}`,
    after: `const unique = [...new Set(arr)]`,
    feedback: `## 개선 포인트

Set을 활용하면 간결하고 성능도 좋습니다.`,
    tags: ['JavaScript', 'Array', 'Set', 'Performance'],
    createdAt: '2024-11-22T10:00:00Z',
  },
  {
    id: 4,
    type: 'meme',
    title: '😂 Console.log 디버깅의 진실',
    image: 'https://cdn.dev-onebite.com/images/meme_console_log.png',
    description: `## Console.log 디버깅의 진실

### 프로 개발자의 비밀
실제로는 둘 다 사용합니다:
- **빠른 확인**: console.log
- **복잡한 버그**: 디버거

### 재미있는 통계
> 프로그래머의 90%는 디버거를 알고 있지만,
> 90%는 여전히 console.log를 더 많이 씁니다. 🤣`,
    tags: ['밈', '디버깅', '현실', '개발자'],
    createdAt: '2024-11-23T10:00:00Z',
  },
  {
    id: 5,
    type: 'interview',
    title: '🎯 Virtual DOM이 뭔가요?',
    question: 'React의 Virtual DOM이 무엇이고, 왜 사용하나요?',
    answer: `## Virtual DOM이란?

React가 실제 DOM의 가벼운 복사본을 메모리에 유지하는 것입니다.

## 오해하지 말아야 할 점

❌ **잘못된 이해**: "Virtual DOM이 무조건 빠르다"
✅ **올바른 이해**: "Virtual DOM은 효율적인 업데이트 전략이다"


### 꼬리 질문 대비
- "React 18의 Concurrent 기능과 관계는?" → 렌더링 우선순위 제어`,
    tail: '토스',
    tags: ['React', '면접', 'Virtual DOM', 'Architecture'],
    createdAt: '2024-11-24T10:00:00Z',
  },
];

export const mockContentListResponse: ApiResponse<GetLearningDataListData> = {
  success: true,
  data: {
    content: mockContentItems,
    pagination: {
      page: 1,
      limit: 5,
      total: 1247,
      totalPages: 250,
      hasNext: true,
      hasPrev: false,
    },
    filters: {
      categories: [],
      types: [],
      excludedCount: 0,
    },
  },
};
