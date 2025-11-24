import type { LearningData } from '@/api/model/response/learndata';

// API 모델을 직접 사용
export type Content = LearningData;

// 사용자 설정
export interface UserPreferences {
    categories: string[];
    onboardingCompleted: boolean;
}

// 학습 기록
export interface History {
    today: number;
    total: number;
    streak: number;
    lastVisit: string;
    seenIds: number[];
}

// LocalStorage 전체 구조
export interface DevOneBiteStorage {
    preferences: UserPreferences;
    history: History;
    bookmarks: number[];
}