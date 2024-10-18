<template>
    <div>
        <el-row :gutter="20" class="mgb20">
            <el-col :span="24">
                <el-card shadow="hover">
                    <div class="card-header">
                        <p class="card-header-title">用户标签命中个数</p>
                        <p class="card-header-desc">各标签命中用户数量统计</p>
                    </div>
                    <v-chart class="chart" :option="userTagsOpt" @click="handleChartClick" />
                </el-card>
            </el-col>
        </el-row>

        <el-drawer
            v-model="drawerVisible"
            :title="selectedTag ? `${selectedTag}标签通话记录` : '通话记录'"
            size="50%"
            direction="rtl"
        >
            <el-table :data="callRecords" style="width: 100%">
                <el-table-column prop="userId" label="用户ID" width="180" />
                <el-table-column prop="salesId" label="销售ID" width="180" />
                <el-table-column prop="callTime" label="通话时间" />
                <el-table-column prop="duration" label="通话时长（分钟）" />
                <el-table-column prop="result" label="通话结果" />
            </el-table>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import type { EChartsOption } from 'echarts';

use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
]);

// 用户标签数据（示例数据）
const userTagsData = [
    { name: '涨价提醒', value: 120 },
    { name: '优惠券用户', value: 200 },
    { name: '高频用户', value: 150 },
    { name: '新用户', value: 80 },
    { name: '流失用户', value: 70 },
].sort((a, b) => b.value - a.value);  // 按照标签个数降序排序

const userTagsOpt: EChartsOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: userTagsData.map(item => item.name),
        axisLabel: {
            interval: 0,
            rotate: 30
        }
    },
    yAxis: {
        type: 'value',
        name: '命中个数'
    },
    series: [
        {
            name: '命中个数',
            type: 'bar',
            data: userTagsData.map(item => item.value),
            itemStyle: {
                color: '#3aa1ff'
            }
        }
    ]
};

// 抽屉相关
const drawerVisible = ref(false);
const selectedTag = ref('');

// 模拟的通话记录数据
const callRecords = reactive([
    { userId: 'U001', salesId: 'S001', callTime: '2023-05-01 10:00', duration: 5, result: '成功' },
    { userId: 'U002', salesId: 'S002', callTime: '2023-05-01 11:00', duration: 3, result: '未接通' },
    { userId: 'U003', salesId: 'S001', callTime: '2023-05-01 14:00', duration: 8, result: '成功' },
    { userId: 'U004', salesId: 'S003', callTime: '2023-05-01 16:00', duration: 4, result: '成功' },
    { userId: 'U005', salesId: 'S002', callTime: '2023-05-02 09:00', duration: 6, result: '成功' },
    { userId: 'U006', salesId: 'S001', callTime: '2023-05-02 11:00', duration: 2, result: '未接通' },
    { userId: 'U007', salesId: 'S003', callTime: '2023-05-02 14:00', duration: 7, result: '成功' },
    { userId: 'U008', salesId: 'S002', callTime: '2023-05-02 16:00', duration: 5, result: '成功' },
    { userId: 'U009', salesId: 'S001', callTime: '2023-05-03 10:00', duration: 4, result: '成功' },
    { userId: 'U010', salesId: 'S003', callTime: '2023-05-03 11:00', duration: 3, result: '未接通' },
]);

// 处理图表点击事件
const handleChartClick = (params: any) => {
    if (params.componentType === 'series') {
        selectedTag.value = params.name;
        drawerVisible.value = true;
        // 这里可以根据选中的标签筛选或请求对应的通话记录
        // 目前使用的是同一组模拟数据
    }
};
</script>

<style scoped>
.chart {
    width: 100%;
    height: 400px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header-title {
    font-size: 18px;
    font-weight: bold;
}

.card-header-desc {
    font-size: 14px;
    color: #999;
}
</style>
