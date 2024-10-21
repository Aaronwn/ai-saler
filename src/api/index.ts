import request from '../utils/request';

// 进行中用户分析列表
export const fetchAIHealthScoreData = (page: number, pageSize: number) => {
  return request({
    // url: './mock/ai-health-score.json',
    url: '/AiTopSales/follow',
    method: 'get',
  });
};

// ---看板---
// 用户标签数据(看板),params: object:{role: sale | user, country: string, start: string, end: string}
export const fetchUserTagsData = (params: object) => {
  return request({
    // url: './mock/user-tags.json',
    // url: `/AiTopSales/tags?${Object.entries(params)
    //   .map(([key, value]) => `${key}=${value}`)
    //   .join('&')}`,
    // 只需要传入role
    url: `/AiTopSales/tags?role=${params.role}`,
    method: 'get',
  });
};

// // 用户命中标签通话记录
// export const fetchCallRecords = () => {
//   return request({
//     url: './mock/call-records.json',
//     method: 'get',
//   });
// };
