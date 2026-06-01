<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

interface ArticleMeta {
  title: string
  description: string
  date: string
  tag: string[]
  recommend?: boolean | number | string | string[]
  top?: boolean | number
  readingTime?: boolean
  comment?: boolean
}

interface Article {
  route: string
  meta: ArticleMeta
}

const { site } = useData()

const blogConfig = computed(() => {
  return site.value.themeConfig?.blog || {}
})

const articles = computed(() => {
  const pagesData = blogConfig.value.pagesData || []
  return pagesData.map((page: any) => ({
    route: page.route,
    meta: {
      title: page.meta?.title || '',
      description: page.meta?.description || '',
      date: page.meta?.date || '',
      tag: page.meta?.tag || page.meta?.tags || [],
      recommend: page.meta?.recommend,
      top: page.meta?.top,
      readingTime: page.meta?.readingTime,
      comment: page.meta?.comment
    }
  }))
})
const searchKeyword = ref('')
const newTagName = ref('')

const allTags = computed(() => {
  const tagMap = new Map<string, { name: string; count: number; articles: Article[] }>()

  articles.value.forEach((article: Article) => {
    const tags = article.meta.tag || []
    const tagArray = Array.isArray(tags) ? tags : [tags]

    tagArray.forEach((tag: string) => {
      if (typeof tag === 'string') {
        if (tagMap.has(tag)) {
          tagMap.get(tag)!.count++
          tagMap.get(tag)!.articles.push(article)
        } else {
          tagMap.set(tag, {
            name: tag,
            count: 1,
            articles: [article]
          })
        }
      }
    })
  })

  return Array.from(tagMap.values())
})

const filteredTags = computed(() => {
  if (!searchKeyword.value) return allTags.value

  const keyword = searchKeyword.value.toLowerCase()
  return allTags.value.filter(tag => tag.name.toLowerCase().includes(keyword))
})

function addTag() {
  if (!newTagName.value.trim()) {
    alert('请输入标签名称')
    return
  }

  if (allTags.value.some(tag => tag.name === newTagName.value.trim())) {
    alert('该标签已存在')
    return
  }

  alert(`标签 "${newTagName.value}" 添加成功`)
  newTagName.value = ''
}

function deleteTag(tagName: string) {
  if (confirm(`确定要删除标签 "${tagName}" 吗？这将从所有文章中移除该标签。`)) {
    alert(`标签 "${tagName}" 删除成功`)
  }
}

function handleEditTag(tagName: string) {
  const newName = window.prompt('请输入新标签名称:', tagName)
  if (!newName) return

  if (!newName.trim()) {
    alert('请输入新标签名称')
    return
  }

  if (tagName === newName.trim()) return

  alert(`标签 "${tagName}" 已重命名为 "${newName}"`)
}
</script>

<template>
  <div class="tag-manager">
    <div class="manager-header">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="搜索标签..."
          class="search-input"
        />
      </div>
      <div class="add-tag-section">
        <input
          type="text"
          v-model="newTagName"
          placeholder="输入新标签名称"
          class="tag-input"
          @keyup.enter="addTag"
        />
        <button class="add-btn" @click="addTag">添加标签</button>
      </div>
    </div>

    <div class="tags-grid">
      <div
        v-for="tag in filteredTags"
        :key="tag.name"
        class="tag-card"
      >
        <div class="tag-header">
          <span class="tag-name">{{ tag.name }}</span>
          <span class="tag-count">{{ tag.count }} 篇文章</span>
        </div>
        <div class="tag-articles">
          <div
            v-for="article in tag.articles.slice(0, 3)"
            :key="article.route"
            class="article-item"
          >
            {{ article.meta.title }}
          </div>
          <div v-if="tag.count > 3" class="more-articles">
            还有 {{ tag.count - 3 }} 篇文章...
          </div>
        </div>
        <div class="tag-actions">
          <button class="action-btn edit-btn" @click="handleEditTag(tag.name)">编辑</button>
          <button class="action-btn delete-btn" @click="deleteTag(tag.name)">删除</button>
        </div>
      </div>
    </div>

    <div v-if="filteredTags.length === 0" class="empty-state">
      <p>暂无标签数据</p>
    </div>
  </div>
</template>

<style scoped>
.tag-manager {
  padding: 20px;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-bar {
  flex: 1;
  min-width: 200px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  max-width: 300px;
}

.add-tag-section {
  display: flex;
  gap: 10px;
}

.tag-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 180px;
}

.add-btn {
  padding: 8px 20px;
  background: #4080ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #3070ef;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.tag-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #eee;
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tag-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.tag-count {
  font-size: 12px;
  color: #999;
  background: white;
  padding: 2px 8px;
  border-radius: 10px;
}

.tag-articles {
  margin-bottom: 12px;
}

.article-item {
  font-size: 13px;
  color: #666;
  padding: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-articles {
  font-size: 12px;
  color: #999;
  padding: 4px 0;
}

.tag-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.3s;
}

.action-btn:hover {
  opacity: 0.8;
}

.edit-btn {
  background: #67c23a;
  color: white;
}

.delete-btn {
  background: #f56c6c;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
  grid-column: 1 / -1;
}
</style>