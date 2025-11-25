import { httpClient } from '@/api';
import type { CategoriesData } from '../model/response/category';

export class CategoriesApi {
  static async getCategories(): Promise<CategoriesData> {
    return httpClient.get<CategoriesData>(
      '/categories',(data) => data);
  }
}
