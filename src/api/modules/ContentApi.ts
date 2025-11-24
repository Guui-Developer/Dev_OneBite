import { USE_MOCK } from '../config';
import { httpClient } from '../httpClient';
import { mockContentListResponse } from '../mockData/content';
import type { GetLearningDataListParams } from '../model/request/learndata';
import type { GetLearningDataListResponse } from '../model/response/learndata';

export class ContentApi {
  /**
   * 학습 데이터 목록 조회
   */
  static async getContentList(params: GetLearningDataListParams): Promise<GetLearningDataListResponse> {
    // Mock 모드일 경우 mock 데이터 반환
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockContentListResponse as unknown as GetLearningDataListResponse);
        }, 500); // 네트워크 지연 시뮬레이션
      });
    }

    // 실제 API 호출
    const queryParams = new URLSearchParams();
    if (params.categories) queryParams.append('categories', params.categories);
    if (params.types) queryParams.append('types', params.types);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.random !== undefined) queryParams.append('random', params.random.toString());
    if (params.excludeIds) queryParams.append('excludeIds', params.excludeIds);
    if (params.page) queryParams.append('page', params.page.toString());

    return httpClient.get<GetLearningDataListResponse>(
      `/api/content?${queryParams.toString()}`,
      (data) => data as GetLearningDataListResponse
    );
  }

  /**
   * 학습 데이터 상세 조회
   */
  static async getContentDetail(id: number): Promise<any> {
    // Mock 모드일 경우 mock 데이터 반환
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const mockData = mockContentListResponse.data.content.find((item: any) => item.id === id);
          if (mockData) {
            resolve({
              success: true,
              data: mockData,
            });
          } else {
            reject(new Error('Content not found'));
          }
        }, 300);
      });
    }

    // 실제 API 호출
    return httpClient.get<any>(
      `/api/content/${id}`,
      (data) => data
    );
  }
}
