import type { GetLearningDataListData } from '@/api/model/response/learndata';
import mockData from './mockData.json';


export function getMockContentList(): GetLearningDataListData {
  const presetKey = `preset1`;
  return mockData[presetKey] as GetLearningDataListData;
}
