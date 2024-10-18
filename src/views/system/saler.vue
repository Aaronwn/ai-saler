<template>
  <div class="chat-assistant">
    <div class="chat-window">
      <div v-for="(message, index) in chatHistory" :key="index" :class="['message', message.type]">
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    <div class="bottom-area">
      <div class="input-area">
        <el-input v-model="newMessage" type="textarea" :rows="4" placeholder="请输入消息"></el-input>
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
      <div class="ai-suggestion">
        <div class="suggestion-header">
          <span>AI 建议</span>
          <el-button type="text" @click="copyAISuggestion">复制</el-button>
        </div>
        <div class="suggestion-content">{{ aiSuggestion }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

interface ChatMessage {
  type: 'user' | 'sales';
  content: string;
}

const chatHistory = ref<ChatMessage[]>([
  { type: 'user', content: '你好，我想咨询一下产品的价格。' },
  { type: 'sales', content: '您好！我很乐意为您提供产品价格信息。请问您对哪款产品感兴趣呢？' },
]);

const newMessage = ref('');
const aiSuggestion = ref('建议您可以详细介绍一下我们的主打产品，包括其特点和优势。');

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatHistory.value.push({ type: 'sales', content: newMessage.value });
    newMessage.value = '';
    // 这里可以添加发送消息到后端的逻辑
  }
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
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f2f5;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.message {
  margin-bottom: 15px;
  max-width: 80%;
}

.user {
  align-self: flex-start;
}

.sales {
  align-self: flex-end;
  margin-left: auto;
}

.message-content {
  background-color: #f2f6fc;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.bottom-area {
  display: flex;
  height: 180px; /* 调整底部区域的高度 */
}

.input-area {
  flex: 2;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-right: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.input-area .el-textarea {
  flex: 1;
}

.input-area .el-button {
  align-self: flex-end;
  margin-top: 10px;
}

.ai-suggestion {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.suggestion-content {
  flex: 1;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.5;
}

/* 新增样式 */
.el-textarea__inner {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}

.el-button--text {
  color: #409eff;
}
</style>
