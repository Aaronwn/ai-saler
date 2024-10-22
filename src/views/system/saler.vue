<template>
  <div class="chat-assistant">
    <div class="chat-area user-side">
      <div class="chat-header">
        <i class="el-icon-user"></i>
        <span>用户侧</span>
      </div>
      <div class="chat-window" ref="userChatWindow">
        <div
          v-for="(message, index) in chatHistory"
          :key="index"
          :class="['message', message.type === 'user' ? 'right' : 'left']">
          <div class="avatar">
            {{ message.type.toUpperCase() }}
          </div>
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div class="input-area">
        <el-input
          v-model="userMessage"
          type="textarea"
          :rows="2"
          placeholder="请输入用户消息"
          @keydown.enter.exact.prevent="sendUserMessage"
          @keydown.enter.shift.exact="newline"></el-input>
        <el-button type="primary" @click="sendUserMessage">发送</el-button>
      </div>
    </div>
    <div class="chat-area sales-side">
      <div class="chat-header">
        <i class="el-icon-service"></i>
        <span>销售侧</span>
      </div>
      <div class="chat-window" ref="salesChatWindow">
        <div
          v-for="(message, index) in chatHistory"
          :key="index"
          :class="['message', message.type === 'sales' ? 'right' : 'left']">
          <div class="avatar">
            {{ message.type.toUpperCase() }}
          </div>
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div class="input-area">
        <el-input
          v-model="salesMessage"
          type="textarea"
          :rows="2"
          placeholder="请输入销售消息"
          @keydown.enter.exact.prevent="sendSalesMessage"
          @keydown.enter.shift.exact="newline"></el-input>
        <el-button type="primary" @click="sendSalesMessage">发送</el-button>
      </div>
      <div class="ai-suggestion">
        <div class="ai-suggestion-content" v-text="aiSuggestion || 'AI 建议将显示在这里'"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchAIChatAdvice } from '../../api/index'; // Import the function

const chatHistory = ref([]);
const userMessage = ref('');
const salesMessage = ref('');
const aiSuggestion = ref('');
const userChatWindow = ref(null);
const salesChatWindow = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (userChatWindow.value) {
      userChatWindow.value.scrollTop = userChatWindow.value.scrollHeight;
    }
    if (salesChatWindow.value) {
      salesChatWindow.value.scrollTop = salesChatWindow.value.scrollHeight;
    }
  });
};

const sendUserMessage = async () => {
  if (userMessage.value.trim()) {
    chatHistory.value.push({ type: 'user', content: userMessage.value });
    userMessage.value = '';
    scrollToBottom();

    try {
      const res = await fetchAIChatAdvice({ content: chatHistory.value });
      aiSuggestion.value = res.data.data.suggestion;
    } catch (error) {
      ElMessage.error('获取AI建议失败');
    }
  }
};

const sendSalesMessage = () => {
  if (salesMessage.value.trim()) {
    chatHistory.value.push({ type: 'sales', content: salesMessage.value });
    scrollToBottom();
    salesMessage.value = '';
  }
};

// Watch for changes in chatHistory and scroll both sides to bottom
watch(
  chatHistory,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// Scroll both sides to bottom on initial load
onMounted(() => {
  scrollToBottom();
});

const newline = e => {
  const target = e.target;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  const value = target.value;
  target.value = value.substring(0, start) + '\n' + value.substring(end);
  target.selectionStart = target.selectionEnd = start + 1;
};

// const copyAISuggestion = () => {
//   navigator.clipboard.writeText(aiSuggestion.value).then(() => {
//     ElMessage.success('AI 建议已复制到剪贴板');
//   });
// };
</script>

<style scoped>
.chat-assistant {
  display: flex;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f2f5;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 5px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden; /* 添加这行来防止内容溢出 */
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
}

.chat-header i {
  margin-right: 8px;
  font-size: 18px;
}

.user-side .chat-header {
  background-color: #e8f5fe;
  color: #1890ff;
}

.sales-side .chat-header {
  background-color: #f6ffed;
  color: #52c41a;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  margin-bottom: 10px;
  scroll-behavior: smooth;
}

.message {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.left {
  flex-direction: row;
}

.right {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #fff;
  margin: 0 8px;
}

.message-content {
  background-color: #f2f6fc;
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 70%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.4;
}

.right .message-content {
  background-color: #95ec69;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  align-items: flex-end;
}

.input-area .el-textarea {
  flex: 1;
}

.input-area .el-button {
  margin-left: 10px;
  height: 40px; /* 调整按钮高度以匹配输入框 */
}

/* 确保输入框和按钮底部对齐 */
.el-textarea__inner {
  resize: none;
}

.ai-suggestion {
  padding: 8px;
  border-top: 1px solid #e0e0e0;
  height: 25%;
  display: flex;
  flex-direction: column;
}

.ai-suggestion-content {
  flex: 1;
  padding: 10px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: #606266;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  cursor: text;
  user-select: text;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.suggestion-header span {
  font-weight: bold;
}

.el-button--text {
  padding: 0;
}
</style>
