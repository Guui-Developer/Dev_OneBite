import { httpClient } from '@/api';
import type { GetLearningDataListParams } from '../model/request/learndata';
import {GetLearningDataListData} from '../model/response/learndata';

export class ContentApi {
  /**
   * 학습 데이터 목록 조회
   */
  static async getContentList(params: GetLearningDataListParams): Promise<GetLearningDataListData> {
    const queryParams = new URLSearchParams();
    if (params.categories) queryParams.append('categories', params.categories);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.lastSeenId !== undefined) queryParams.append('lastSeenId', params.lastSeenId.toString());
    if (params.seed) queryParams.append('seed', params.seed.toString());


    return httpClient.get<GetLearningDataListData>(
      `/content?${queryParams.toString()}`,
      (data) => data as GetLearningDataListData
    );
  }
}
