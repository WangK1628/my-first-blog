<script setup lang="ts">
import { ref } from 'vue'
import ArticleManager from './ArticleManager.vue'
import TagManager from './TagManager.vue'

const activeTab = ref('articles')

const tabs = [
  { id: 'articles', label: '文章管理' },
  { id: 'tags', label: '标签管理' }
]
</script>

<template>
  <div class="admin-container admin-page">
    <div class="admin-header">
      <h1>作者后台管理</h1>
      <p>文章、标签、精选、置顶等管理功能</p>
    </div>
    
    <div class="admin-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="admin-content">
      <ArticleManager v-if="activeTab === 'articles'" />
      <TagManager v-if="activeTab === 'tags'" />
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 20px;
  box-sizing: border-box;
  display: block;
}

.admin-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.admin-header h1 {
  font-size: 28px;
  margin: 0 0 10px 0;
  color: #333;
}

.admin-header p {
  color: #666;
  margin: 0;
}

.admin-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.admin-tabs button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.admin-tabs button:hover {
  border-color: #4080ff;
  color: #4080ff;
}

.admin-tabs button.active {
  background: #4080ff;
  color: white;
  border-color: #4080ff;
}

.admin-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-height: 500px;
  padding: 20px;
}
</style>