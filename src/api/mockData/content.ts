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

## 해결 방법

### 함수형 업데이트 사용
\`\`\`javascript
setTimeout(() => {
  setCount(prev => prev + 1)
}, 1000)

setTimeout(() => {
  setCount(prev => prev + 1)
}, 2000)
\`\`\`

함수형 업데이트를 사용하면 항상 최신 상태를 참조합니다!

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

Set을 활용하면 간결하고 성능도 좋습니다.

### Before 문제점
- **O(n²) 시간 복잡도**: \`includes()\`가 매번 배열 전체를 순회 (O(n))
- 코드가 길고 복잡함
- 가독성이 떨어짐

### After 장점
- ✅ **O(n) 시간 복잡도**: Set은 해시 테이블 기반
- ✅ **한 줄로 해결**: 간결한 코드
- ✅ **가독성 향상**: 의도가 명확함

### Set의 특징
- 중복을 자동으로 제거
- 순서 보장 (ES2015+)
- 원시값과 객체 참조 모두 저장 가능

### 추가 팁
객체 배열의 중복 제거는 다른 방법이 필요합니다:
\`\`\`javascript
const unique = arr.filter((item, index, self) =>
  index === self.findIndex(t => t.id === item.id)
)
\`\`\``,
    tags: ['JavaScript', 'Array', 'Set', 'Performance'],
    createdAt: '2024-11-22T10:00:00Z',
  },
  {
    id: 4,
    type: 'meme',
    title: '😂 Console.log 디버깅의 진실',
    image: 'https://cdn.dev-onebite.com/images/meme_console_log.png',
    description: `## Console.log 디버깅의 진실

> "디버거? 아니 console.log면 충분해"

모든 개발자가 거쳐가는 단계입니다. 😅

### 왜 console.log를 쓰나요?
- 💡 **빠르고 직관적**: 바로 확인 가능
- 🔍 **실시간 값 확인**: 변수 상태를 즉시 파악
- 🎯 **정확한 위치**: 원하는 곳에 정확히 배치
- 🚀 **설정 불필요**: 별도 도구 없이 즉시 사용

### 하지만...

**디버거의 장점도 알아두세요!**
- ⏸️ 중단점(Breakpoint)으로 실행 멈추기
- 👁️ 모든 변수 상태 한눈에 보기
- ⏭️ 단계별 실행으로 흐름 파악
- 📊 콜스택 확인

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

## 왜 사용하나요?

### 1. 성능 최적화
실제 DOM 조작은 비용이 매우 큽니다. Virtual DOM은:

**작동 방식**
1. 변경사항을 먼저 Virtual DOM에 적용
2. 이전 Virtual DOM과 비교 (Diffing Algorithm)
3. 실제로 변경된 부분만 Real DOM에 반영 (Reconciliation)

### 2. 배치 업데이트
여러 변경사항을 모아서 한 번에 처리하여 효율적입니다.

\`\`\`javascript
// 여러 상태 변경이 있어도
setState1(...)
setState2(...)
setState3(...)
// 한 번의 렌더링으로 처리
\`\`\`

### 3. 선언적 프로그래밍
개발자는 '어떻게'가 아닌 '무엇을' 렌더링할지만 신경쓰면 됩니다.

\`\`\`javascript
// 선언적: 최종 상태만 기술
return <div>{count}</div>

// 명령적: 각 단계를 지시 (불필요)
const div = document.createElement('div')
div.textContent = count
parent.appendChild(div)
\`\`\`

## 오해하지 말아야 할 점

❌ **잘못된 이해**: "Virtual DOM이 무조건 빠르다"

✅ **올바른 이해**: "Virtual DOM은 효율적인 업데이트 전략이다"

- Virtual DOM 자체가 빠른 게 아님
- 불필요한 DOM 조작을 줄여서 빠름
- 개발 편의성과 성능의 좋은 균형점

## 면접 팁

1. **기본 개념** 먼저 설명
2. **작동 방식** (Diffing, Reconciliation) 언급
3. **장점**을 구체적으로 설명
4. **오해**를 바로잡으며 깊이 있는 이해도 표현
5. **Fiber** 아키텍처까지 아시면 보너스!

### 꼬리 질문 대비
- "Virtual DOM의 단점은?" → 메모리 사용, 초기 렌더링 오버헤드
- "Svelte는 왜 Virtual DOM을 안 쓰나요?" → 컴파일 타임 최적화
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
