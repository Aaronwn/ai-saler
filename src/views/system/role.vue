<template>
  <div>
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :page-change="changePage">
        <template #adviceList="slotProps">
          <el-popover
            placement="top-start"
            title="建议列表"
            :width="300"
            trigger="hover"
            :content="getAdviceContent(slotProps)">
            <template #reference>
              <el-button type="text">查看建议</el-button>
            </template>
          </el-popover>
        </template>
      </TableCustom>
    </div>
  </div>
</template>

<script setup lang="ts" name="ai-health-score">
import { ref, reactive } from 'vue';
import { fetchAIHealthScoreData } from '@/api'; // 假设您有这个 API 函数
import TableCustom from '@/components/table-custom.vue';

interface HealthScore {
  user: string;
  follower: string;
  callTime: string;
  callId: string;
  healthScore: number;
  adviceList: string[];
}

// 表格相关
const columns = ref([
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'user', label: '用户' },
  { prop: 'follower', label: '跟进人' },
  { prop: 'callTime', label: '通话时间' },
  { prop: 'callId', label: '通话ID' },
  { prop: 'healthScore', label: '健康分数' },
  { prop: 'adviceList', label: '沟通建议' },
]);

const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});

const tableData = ref<HealthScore[]>([]);

const getData = async () => {
  try {
    const res = await fetchAIHealthScoreData(page.index, page.size);
    console.log(123, res.data.data);
    tableData.value = res.data.data;
    page.total = res.data.pageTotal;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

getData();

const changePage = (val: number) => {
  page.index = val;
  getData();
};

const getAdviceContent = (slotProps: any) => {
  console.log('Slot props:', slotProps);
  const row = slotProps.rows; // 直接使用 rows，不需要通过索引访问
  console.log('Row data:', row);

  if (!row || !row.adviceList || row.adviceList.length === 0) {
    return '暂无建议';
  }
  return row.adviceList.join('\n');
};
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
