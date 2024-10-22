<template>
  <div>
    <!-- 筛选条件 -->
    <div class="filter-container">
      <el-select v-model="country" placeholder="请选择国家" class="filter-item country-select">
        <el-option label="境内" value="domestic" />
        <el-option label="境外" value="overseas" disabled />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        class="filter-item date-range-picker" />
    </div>
    <!-- 赢单销售分析 -->
    <el-row :gutter="20" class="mgb20">
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="card-header">
            <p class="card-header-title">销售话术标签</p>
            <p class="card-header-desc">各标签命中数量统计</p>
          </div>
          <v-chart class="chart" :option="salesTagsOpt" @click="params => handleChartClick('sale', params)" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 赢单用户分析 -->
    <el-row :gutter="20" class="mgb20">
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="card-header">
            <p class="card-header-title">用户特征标签</p>
            <p class="card-header-desc">各标签命中用户数量统计</p>
          </div>
          <v-chart class="chart" :option="userTagsOpt" @click="params => handleChartClick('user', params)" />
        </el-card>
      </el-col>
    </el-row>

    <el-drawer
      v-model="drawerVisible"
      :title="selectedTag ? `${selectedTag}标签通话记录` : '通话记录'"
      size="50%"
      direction="rtl">
      <el-table :data="selectedTagRecords" style="width: 100%">
        <el-table-column prop="user" label="用户ID" width="120" />
        <el-table-column prop="follower" label="跟进人ID" width="120" />
        <el-table-column prop="callTime" label="通话时间" width="180" />
        <el-table-column prop="reason" label="对应话术" />
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import { fetchUserTagsData } from '@/api';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent]);

// 国家筛选
const country = ref('domestic');

// 日期范围
const dateRange = ref([]);

// 销售标签数据
const salesTagsData = ref([]);
// 用户标签数据
const userTagsData = ref([]);

// 抽屉相关
const drawerVisible = ref(false);
const selectedTag = ref('');
const selectedRole = ref('');

const createChartOption = color => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  grid: {
    left: '3%',
    right: '8%', // 增加右侧间距
    bottom: '15%',
    top: '8%',
    containLabel: true,
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 0,
      end: 100,
    },
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100,
    },
  ],
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 45,
      textStyle: { fontSize: 10 },
      align: 'right',
      margin: 10,
    },
  },
  yAxis: {
    type: 'value',
    name: '', // 移除 y 轴标题
    axisLabel: {
      margin: 2,
    },
  },
  series: [
    {
      name: '命中个数',
      type: 'bar',
      data: [],
      itemStyle: { color: color },
      barWidth: '50%',
    },
  ],
});

const salesTagsOpt = ref(createChartOption('#3aa1ff')); // 蓝色
const userTagsOpt = ref(createChartOption('#4caf50')); // 绿色

// 获取标签数据
const getTagsData = async role => {
  try {
    const params = {
      role,
      country: country.value,
      start: dateRange.value[0],
      end: dateRange.value[1],
    };
    const res = await fetchUserTagsData(params);
    if (res.data.state === 10000) {
      if (role === 'sale') {
        salesTagsData.value = res.data.data;
        // 把标签名称为"灵活的课程安排"的标签数据放在第一位，并移除原来的位置(演示demo用，正式环境不要)
        const flexibleCourseArrangementIndex = salesTagsData.value.findIndex(item => item.tag === '灵活的课程安排');
        if (flexibleCourseArrangementIndex !== -1) {
          const [flexibleCourseArrangement] = salesTagsData.value.splice(flexibleCourseArrangementIndex, 1);
          salesTagsData.value.unshift(flexibleCourseArrangement);
        }

        updateChartData(salesTagsOpt.value, salesTagsData.value);
      } else {
        userTagsData.value = res.data.data;
        updateChartData(userTagsOpt.value, userTagsData.value);
      }
    } else {
      console.error(`获取${role}标签数据失败:`, res.info);
    }
  } catch (error) {
    console.error(`获取${role}标签数据失败:`, error);
  }
};

// 更新图表数据
const updateChartData = (chartOpt, data) => {
  chartOpt.xAxis = {
    type: 'category',
    data: data.map(item => item.tag),
  };
  chartOpt.series[0].data = data.map(item => item.total);

  // 动态调整图表高度
  const baseHeight = 450;
  const itemHeight = 15;
  const maxHeight = 800;
  const calculatedHeight = Math.min(Math.max(baseHeight, data.length * itemHeight), maxHeight);

  const chartElements = document.querySelectorAll('.chart');
  chartElements.forEach(element => {
    element.style.height = `${calculatedHeight}px`;
  });

  // 根据数据长度动态调整初始缩放范围
  if (data.length > 20) {
    chartOpt.dataZoom[0].end = (20 / data.length) * 100;
    chartOpt.dataZoom[1].end = (20 / data.length) * 100;
  } else {
    chartOpt.dataZoom[0].end = 100;
    chartOpt.dataZoom[1].end = 100;
  }
};

// 处理图表点击事件
const handleChartClick = (role, params) => {
  if (params.componentType === 'series') {
    selectedTag.value = params.name;
    selectedRole.value = role;
    drawerVisible.value = true;
    console.log('Selected tag:', selectedTag.value);
    console.log('Selected role:', selectedRole.value);
  }
};

// 计算属性：根据选中的标签筛选对应的通话记录
const selectedTagRecords = computed(() => {
  // 演示demo用，后面正式环境不需要
  const testReasonList = [
    {
      user: 'User-59231788',
      follower: 'Follower-4103952',
      callTime: '2024-05-07 08:35:21',
      reason:
        '然后我们是上课时间是从早上6点到到晚上24点，整点或者半点开课，您可以根据您自己的时间，自己的情况的话去选择对应的课程。',
    },
    {
      user: 'User-59234564',
      follower: 'Follower-4103952',
      callTime: '2024-05-07 9:40:51',
      reason:
        '时间的话，根据您的时间嘛，然后你如果说你想你想要固定几个老师，那你可以提前把时间的话给他确定下来，然后提前去约。如果您可以就不固定老师，那你这边的话，时间就不用提前去约。',
    },
    {
      user: 'User-59223242',
      follower: 'Follower-4088624',
      callTime: '2024-05-07 09:45:32',
      reason: '根据孩子当下的能力水平，咱们可以灵活调整上课内容和难度的。',
    },
    {
      user: 'User-59233374',
      follower: 'Follower-4103952',
      callTime: '2024-05-07 10:01:45',
      reason:
        '上课的话根据您自己的情况呀，比如说您现在有时间，那您现在立马就可以安排，我们是提前半个小时约课，整点或者半点安排课程，那您现在的话到呃7点半之前都是可以安排8点钟的课嘛。',
    },
    {
      user: 'User-59223242',
      follower: 'Follower-4088624',
      callTime: '2024-05-07 14:26:05',
      reason: '当然当然，从男老师女老师教学风格、教学经验、教学年限这些都可以帮你去筛选。',
    },
    {
      user: 'User-59223242',
      follower: 'Follower-4088624',
      callTime: '2024-05-08 14:26:05',
      reason:
        '我们一节课是25分钟，然后呢整点半点都可以上。最晚提前半小时预约，对最晚提前一小时可以免费取消，早十晚十可以安排试听课，然后正式课的话呢，是早六晚24。',
    },
    {
      user: 'User-59223242',
      follower: 'Follower-4088624',
      callTime: '2024-05-08 14:26:05',
      reason: '可以呀，我们早六晚二十四整点半点都可以上的。',
    },
    {
      user: 'User-59221503',
      follower: 'Follower-10572',
      callTime: '2024-06-10 10:33:27',
      reason:
        '再就是，嗯，对课程教材的话，因为昨天跟咱们大概讲过嘛，就学那个主修课经典英语，那顺着这边往后学，如果说简单难，随时可以调适合孩子为准。',
    },
  ];
  //   如果 selectedRole.value === 'sale' ， 当前点击的标签为 '灵活的课程安排', 则返回上面的 testReasonList
  if (selectedRole.value === 'sale' && selectedTag.value === '灵活的课程安排') {
    return testReasonList;
  }

  const data = selectedRole.value === 'sale' ? salesTagsData.value : userTagsData.value;
  const selectedData = data.find(item => item.tag === selectedTag.value);
  return selectedData ? selectedData.reasonList : [];
});

// 添加日志输出，用于调试
watch(selectedTagRecords, newValue => {
  console.log('Selected tag records:', newValue);
});

// 监听筛选条件变化
watch([country, dateRange], () => {
  getTagsData('sale');
  getTagsData('user');
});

onMounted(() => {
  getTagsData('sale');
  getTagsData('user');
});
</script>

<style scoped>
.chart {
  width: 100%;
  min-height: 450px;
  max-height: 800px;
  height: auto;
  margin-bottom: 20px;
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

.mgb20 {
  margin-bottom: 10px;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.filter-item {
  margin-right: 15px;
}

.country-select {
  width: 120px;
}

.date-range-picker {
  width: 320px;
}
</style>
