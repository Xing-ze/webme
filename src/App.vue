<script setup lang="ts">
</script>

<template>
  <div class="welcome">
    <h1>WebMe 🌱</h1>
    <p>你的个人数字空间，正在搭建中...</p>
    <p class="hint">第一阶段 · 项目脚手架已就绪</p>
  </div>
</template>

<style scoped>
.welcome {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', 'Helvetica Neue', sans-serif;
}
.welcome h1 {
  font-size: 3.5rem;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.welcome p {
  font-size: 1.25rem;
  color: #555;
  margin: 0.5rem 0;
}
.welcome .hint {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #999;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  background: rgba(102, 126, 234, 0.08);
}
</style>
