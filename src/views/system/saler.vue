<template>
  <div class="chat-assistant">
    <div class="chat-area user-side">
      <div class="chat-window">
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
          placeholder="请输入消息"
          @keydown.enter.exact.prevent="sendUserMessage"
          @keydown.enter.shift.exact="newline"></el-input>
        <el-button type="primary" @click="sendUserMessage">发送</el-button>
      </div>
    </div>
    <div class="chat-area sales-side">
      <div class="chat-window">
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
          placeholder="请输入消息"
          @keydown.enter.exact.prevent="sendSalesMessage"
          @keydown.enter.shift.exact="newline"></el-input>
        <el-button type="primary" @click="sendSalesMessage">发送</el-button>
      </div>
      <div class="ai-suggestion">
        <div class="suggestion-header">
          <span>AI 建议</span>
          <el-button type="text" @click="copyAISuggestion">复制</el-button>
        </div>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="AI 建议将显示在这里"
          v-model="aiSuggestion"
          readonly></el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchAIChatAdvice } from '../../api/index'; // Import the function

const chatHistory = ref([
  // { type: 'user', content: '你好' },
  // { type: 'sales', content: '你好，请问有什么问题' },
]);

const userMessage = ref('');
const salesMessage = ref('');
const aiSuggestion = ref('');

const sendUserMessage = async () => {
  if (userMessage.value.trim()) {
    chatHistory.value.push({ type: 'user', content: userMessage.value });

    try {
      const res = await fetchAIChatAdvice({ content: chatHistory.value }); // Call the API
      console.log(111, chatHistory.value);
      aiSuggestion.value = res.data.data.suggestion; // Update AI suggestion
    } catch (error) {
      ElMessage.error('获取AI建议失败');
    }

    userMessage.value = '';
  }
};

const sendSalesMessage = () => {
  if (salesMessage.value.trim()) {
    chatHistory.value.push({ type: 'sales', content: salesMessage.value });
    salesMessage.value = '';
  }
};

const newline = e => {
  const target = e.target;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  const value = target.value;
  target.value = value.substring(0, start) + '\n' + value.substring(end);
  target.selectionStart = target.selectionEnd = start + 1;
};

const copyAISuggestion = () => {
  navigator.clipboard.writeText(aiSuggestion.value).then(() => {
    ElMessage.success('AI 建议已复制到剪贴板');
  });
};
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
  margin: 0 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  margin-bottom: 20px;
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
  padding: 10px;
  border-top: 1px solid #e0e0e0;
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
