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
    if (params.types) queryParams.append('types', params.types);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.random !== undefined) queryParams.append('random', params.random.toString());
    if (params.excludeIds) queryParams.append('excludeIds', params.excludeIds);
    if (params.page) queryParams.append('page', params.page.toString());


    return httpClient.get<GetLearningDataListData>(
      `/content?${queryParams.toString()}`,
      (data) => data as GetLearningDataListData
    );
  }
}
