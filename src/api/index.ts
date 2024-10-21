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
    url: `/AiTopSales/tags?role=${params.role}`,
    method: 'get',
  });
};


// 获取AI聊天建议,如参为content:聊天记录
export const fetchAIChatAdvice = (params: Array<object>) => {
  return request({
    url: '/AiTopSales/suggestion',
    method: 'post',
    data: JSON.stringify(params),
  });
};
