<template>
  <div>
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :page-change="changePage">
        <template #healthScore="slotProps">
          <el-tooltip :content="slotProps.rows.conclusion" placement="top">
            <span>{{ slotProps.rows.healthScore }}</span>
          </el-tooltip>
        </template>
        <template #adviceList="slotProps">
          <el-popover placement="top-start" title="" :width="300" trigger="hover">
            <template #reference>
              <el-button type="text">查看建议</el-button>
            </template>
            <div>
              <div><strong>正面：</strong></div>
              <div v-if="slotProps.rows.positiveList.length">{{ formatList(slotProps.rows.positiveList) }}</div>
              <div v-else>无</div>
              <br />
              <div><strong>负面：</strong></div>
              <div v-if="slotProps.rows.negativeList.length">{{ formatList(slotProps.rows.negativeList) }}</div>
              <div v-else>无</div>
              <br />
              <div><strong>沟通建议：</strong></div>
              <div v-if="slotProps.rows.adviceList.length">{{ formatList(slotProps.rows.adviceList) }}</div>
              <div v-else>无</div>
            </div>
          </el-popover>
        </template>
      </TableCustom>
    </div>
  </div>
</template>

<script setup name="ai-health-score">
import { ref, reactive } from 'vue';
import { fetchAIHealthScoreData } from '@/api'; // 假设您有这个 API 函数
import TableCustom from '@/components/table-custom.vue';

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

const tableData = ref([]);

const getData = async () => {
  try {
    const res = await fetchAIHealthScoreData(page.index, page.size);
    tableData.value = res.data.data;
    page.total = res.data.data.length;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

getData();

const changePage = (val) => {
  page.index = val;
  getData();
};

const formatList = (list) => {
  return list.map((item, index) => `${index + 1}. ${item}`).join('\n');
};
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
