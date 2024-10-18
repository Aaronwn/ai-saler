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
      direction="rtl">
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
import { ref, reactive, onMounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import type { EChartsOption } from 'echarts';
import { fetchUserTagsData, fetchCallRecords } from '@/api';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent]);

// 用户标签数据
const userTagsData = ref([]);

// 通话记录数据
const callRecords = ref([]);

// 抽屉相关
const drawerVisible = ref(false);
const selectedTag = ref('');

const userTagsOpt = ref<EChartsOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%', // 增加底部边距
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 45, // 增加旋转角度
      textStyle: {
        fontSize: 12, // 可以根据需要调整字体大小
      },
    },
  },
  yAxis: {
    type: 'value',
    name: '命中个数',
  },
  series: [
    {
      name: '命中个数',
      type: 'bar',
      data: [],
      itemStyle: {
        color: '#3aa1ff',
      },
      barWidth: '40%', // 调整柱子宽度
    },
  ],
});

// 获取用户标签数据
const getUserTagsData = async () => {
  try {
    const res = await fetchUserTagsData();
    userTagsData.value = res.data.list.sort((a, b) => b.value - a.value);
    updateChartData();
  } catch (error) {
    console.error('获取用户标签数据失败:', error);
  }
};

// 获取通话记录数据
const getCallRecords = async () => {
  try {
    const res = await fetchCallRecords();
    callRecords.value = res.data.list;
  } catch (error) {
    console.error('获取通话记录数据失败:', error);
  }
};

// 更新图表数据
const updateChartData = () => {
  userTagsOpt.value.xAxis.data = userTagsData.value.map(item => item.name);
  userTagsOpt.value.series[0].data = userTagsData.value.map(item => item.value);

  // 动态调整图表高度
  const chartHeight = Math.max(400, userTagsData.value.length * 30);
  document.querySelector('.chart').style.height = `${chartHeight}px`;
};

// 处理图表点击事件
const handleChartClick = (params: any) => {
  if (params.componentType === 'series') {
    selectedTag.value = params.name;
    drawerVisible.value = true;
    // 这里可以根据选中的标签筛选对应的通话记录
    // 目前使用的是所有通话记录
  }
};

onMounted(() => {
  getUserTagsData();
  getCallRecords();
});
</script>

<style scoped>
.chart {
  width: 100%;
  min-height: 400px; /* 设置最小高度 */
  height: auto; /* 允许高度自动调整 */
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
