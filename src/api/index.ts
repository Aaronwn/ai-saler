import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};

// 进行中用户分析列表
export const fetchAIHealthScoreData = (pageIndex: number, pageSize: number) => {
    return request({
        url: './mock/ai-health-score.json',
        method: 'get'
    });
};

// ---看板---
// 用户标签数据(看板)
export const fetchUserTagsData = () => {
    return request({
        url: './mock/user-tags.json',
        method: 'get'
    });
};

// 用户命中标签通话记录
export const fetchCallRecords = () => {
    return request({
        url: './mock/call-records.json',
        method: 'get'
    });
};

