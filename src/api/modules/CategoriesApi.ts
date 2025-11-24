import { USE_MOCK } from '../config';
import { httpClient } from '@/api';
import { mockCategoriesResponse } from '../mockData/categories';
import type { CategoryResponseData } from '../model/response/category';

export class CategoriesApi {
  static async getCategories(): Promise<CategoryResponseData> {
    if (USE_MOCK) {
        console.log('use_mock');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockCategoriesResponse as CategoryResponseData);
        }, 500);
      });
    }
      console.log('use_api');
    return httpClient.get<CategoryResponseData>(
      '/api/categories',
      (data) => data as CategoryResponseData
    );
  }
}
