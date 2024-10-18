<template>
  <div>
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :page-change="changePage">
        <template #aiScore="{ rows }">
          <el-progress :percentage="rows.aiScore" :color="getScoreColor(rows.aiScore)" />
        </template>
      </TableCustom>
    </div>
  </div>
</template>

<script setup lang="ts" name="ai-health-score">
import { ref, reactive } from 'vue';
import { fetchAIHealthScoreData } from '@/api'; // 假设您有这个 API 函数
import TableCustom from '@/components/table-custom.vue';
import { Refresh } from '@element-plus/icons-vue';

interface HealthScore {
  id: number;
  name: string;
  aiScore: number;
}

// 表格相关
const columns = ref([
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名' },
  { prop: 'aiScore', label: 'AI健康度评分' },
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
    console.log(123, res);
    tableData.value = res.data.list;
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

const getScoreColor = (score: number) => {
  if (score < 60) return '#F56C6C';
  if (score < 80) return '#E6A23C';
  return '#67C23A';
};
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
