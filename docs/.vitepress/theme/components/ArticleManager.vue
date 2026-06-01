<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import ArticleModal from './ArticleModal.vue'

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
  return pagesData.filter((page: any) => {
    const route = page.route || ''
    return !route.includes('admin')
  }).map((page: any) => {
    const meta = page.meta || {}
    return {
      route: page.route,
      meta: {
        title: meta.title || '',
        description: meta.description || '',
        date: meta.date || '',
        tag: meta.tag || meta.tags || [],
        recommend: normalizeBoolean(meta.recommend),
        top: normalizeBoolean(meta.top),
        readingTime: normalizeBoolean(meta.readingTime),
        comment: normalizeBoolean(meta.comment)
      }
    }
  })
})

function normalizeBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1'
  if (typeof value === 'number') return value !== 0
  return false
}

const showModal = ref(false)
const editingArticle = ref<Article | null>(null)
const searchKeyword = ref('')
const filterStatus = ref('all')
const sortBy = ref('date')
const currentPage = ref(1)
const pageSize = ref(10)
const showTagInput = ref<string | null>(null)
const selectedNewTag = ref('')

const allAvailableTags = computed(() => {
  const tagSet = new Set<string>()
  articles.value.forEach((article: Article) => {
    const tags = article.meta.tag || []
    tags.forEach((tag: string) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

const filteredArticles = computed(() => {
  let result = [...articles.value]

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(article =>
      article.meta.title?.toLowerCase().includes(keyword) ||
      article.meta.description?.toLowerCase().includes(keyword)
    )
  }

  if (filterStatus.value === 'recommend') {
    result = result.filter(article => article.meta.recommend === true)
  } else if (filterStatus.value === 'top') {
    result = result.filter(article => article.meta.top === true)
  }

  if (sortBy.value === 'date') {
    result.sort((a, b) => new Date(b.meta.date || 0).getTime() - new Date(a.meta.date || 0).getTime())
  } else if (sortBy.value === 'title') {
    result.sort((a, b) => (a.meta.title || '').localeCompare(b.meta.title || ''))
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize.value))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
})

function goToPage(page: number) {
  currentPage.value = page
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function openEditModal(article: Article) {
  editingArticle.value = { ...article, meta: { ...article.meta, tag: [...article.meta.tag] } }
  showModal.value = true
}

function handleSave(article: Article) {
  showModal.value = false
  editingArticle.value = null
  alert('文章保存成功')
}

function toggleRecommend(article: Article) {
  article.meta.recommend = !article.meta.recommend
  alert(`文章"${article.meta.title}"已${article.meta.recommend ? '设为精选' : '取消精选'}`)
}

function toggleTop(article: Article) {
  article.meta.top = !article.meta.top
  alert(`文章"${article.meta.title}"已${article.meta.top ? '置顶' : '取消置顶'}`)
}

function toggleTagInput(route: string) {
  if (showTagInput.value === route) {
    showTagInput.value = null
    newTagInput.value = ''
  } else {
    showTagInput.value = route
    newTagInput.value = ''
  }
}

function addTagToArticle(article: Article) {
  const newTag = selectedNewTag.value
  if (!newTag) {
    alert('请选择要添加的标签')
    return
  }
  if (article.meta.tag.includes(newTag)) {
    alert('该标签已存在')
    return
  }
  article.meta.tag.push(newTag)
  alert(`已为文章"${article.meta.title}"添加标签: ${newTag}`)
  selectedNewTag.value = ''
  showTagInput.value = null
}

function removeTagFromArticle(article: Article, tag: string) {
  article.meta.tag = article.meta.tag.filter(t => t !== tag)
  alert(`已从文章"${article.meta.title}"移除标签: ${tag}`)
}
</script>

<template>
  <div class="article-manager">
    <div class="manager-header">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="搜索文章标题或描述..."
          class="search-input"
        />
        <select v-model="filterStatus" class="filter-select">
          <option value="all">全部</option>
          <option value="recommend">精选文章</option>
          <option value="top">置顶文章</option>
        </select>
        <select v-model="sortBy" class="filter-select">
          <option value="date">按时间排序</option>
          <option value="title">按标题排序</option>
        </select>
      </div>
      
    </div>

    <div class="article-table-wrapper">
      <table class="article-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>标签</th>
            <th>日期</th>
            <th>精选</th>
            <th>置顶</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in paginatedArticles" :key="article.route">
            <td class="title-cell">{{ article.meta.title }}</td>
            <td class="tags-cell">
              <div class="tags-container">
                <span
                  v-for="tag in (article.meta.tag || [])"
                  :key="tag"
                  class="tag-badge"
                  @click="removeTagFromArticle(article, tag)"
                >
                  {{ tag }}
                  <span class="tag-remove">×</span>
                </span>
                <span v-if="!article.meta.tag || article.meta.tag.length === 0" class="no-tag">-</span>
                <button class="add-tag-btn" @click="toggleTagInput(article.route)">+ 标签</button>
              </div>
              <div v-if="showTagInput === article.route" class="tag-input-row">
                <select
                  v-model="selectedNewTag"
                  class="tag-select"
                >
                  <option value="">选择已有标签</option>
                  <option
                    v-for="tag in allAvailableTags"
                    :key="tag"
                    :value="tag"
                  >
                    {{ tag }}
                  </option>
                </select>
                <button class="confirm-btn" @click="addTagToArticle(article)">确定</button>
              </div>
            </td>
            <td class="date-cell">{{ article.meta.date ? new Date(article.meta.date).toLocaleDateString() : '-' }}</td>
            <td class="status-cell">
              <button
                :class="{ active: article.meta.recommend }"
                class="toggle-btn recommend-btn"
                @click="toggleRecommend(article)"
                :title="article.meta.recommend ? '已精选，点击取消' : '未精选，点击设置'"
              >
                是否
              </button>
            </td>
            <td class="status-cell">
              <button
                :class="{ active: article.meta.top }"
                class="toggle-btn top-btn"
                @click="toggleTop(article)"
                :title="article.meta.top ? '已置顶，点击取消' : '未置顶，点击设置'"
              >
                是否
              </button>
            </td>
            <td class="actions-cell">
              <button class="action-btn edit-btn" @click="openEditModal(article)">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredArticles.length > 0" class="pagination">
      <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">上一页</button>
      <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">下一页</button>
      <span class="total-info">共 {{ filteredArticles.length }} 篇文章</span>
    </div>

    <div v-if="filteredArticles.length === 0" class="empty-state">
      <p>暂无文章数据</p>
    </div>
  </div>

  <ArticleModal
    v-if="showModal"
    :article="editingArticle"
    @save="handleSave"
    @close="showModal = false"
  />
</template>

<style scoped>
.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  width: 280px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4080ff;
  box-shadow: 0 0 0 3px rgba(64, 128, 255, 0.1);
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #4080ff;
}

.add-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #4080ff 0%, #609fff 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(64, 128, 255, 0.3);
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 128, 255, 0.4);
}

.article-table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(64, 128, 255, 0.1);
  width: 100%;
  overflow-x: auto;
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  table-layout: fixed;
}

.article-table th {
  padding: 12px 8px;
  text-align: left;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.article-table td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.article-table tbody tr:hover td {
  background-color: #fafbfc;
}

.article-table th:nth-child(1),
.article-table td:nth-child(1) {
  width: 35%;
}

.article-table th:nth-child(2),
.article-table td:nth-child(2) {
  width: 22%;
}

.article-table th:nth-child(3),
.article-table td:nth-child(3) {
  width: 12%;
}

.article-table th:nth-child(4),
.article-table td:nth-child(4) {
  width: 10%;
}

.article-table th:nth-child(5),
.article-table td:nth-child(5) {
  width: 10%;
}

.article-table th:nth-child(6),
.article-table td:nth-child(6) {
  width: 11%;
}

.title-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: #1f2937;
}

.tags-cell {
  white-space: normal;
}

.date-cell {
  text-align: center;
}

.status-cell {
  text-align: center;
}

.actions-cell {
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
}

.tags-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.tag-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.tag-badge:hover {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
  transform: translateY(-1px);
}

.tag-remove {
  font-size: 14px;
  font-weight: bold;
  opacity: 0.7;
}

.tag-badge:hover .tag-remove {
  opacity: 1;
}

.no-tag {
  color: #9ca3af;
  font-size: 13px;
}

.add-tag-btn {
  padding: 4px 12px;
  background: white;
  color: #4080ff;
  border: 1.5px dashed #93c5fd;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-tag-btn:hover {
  background: #eff6ff;
  border-color: #4080ff;
}

.tag-input-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.tag-input {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  width: 140px;
  transition: border-color 0.2s;
}

.tag-input:focus {
  outline: none;
  border-color: #4080ff;
}

.tag-select {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  width: 140px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.tag-select:focus {
  outline: none;
  border-color: #4080ff;
}

.confirm-btn {
  padding: 6px 16px;
  background: linear-gradient(135deg, #4080ff 0%, #609fff 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 128, 255, 0.3);
}

.center-cell {
  text-align: center;
}

.toggle-btn {
  padding: 6px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;
}

.toggle-btn:hover {
  border-color: #93c5fd;
  color: #4080ff;
}

.toggle-btn.active {
  color: white;
  border-color: transparent;
}

.recommend-btn.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
}

.top-btn.active {
  background: linear-gradient(135deg, #ffa940 0%, #ffb86c 100%);
}

.actions-cell {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.edit-btn {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
}

.edit-btn:hover {
  box-shadow: 0 4px 10px rgba(103, 194, 58, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.3);
}

.delete-btn:hover {
  box-shadow: 0 4px 10px rgba(245, 108, 108, 0.4);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding: 20px 0;
}

.page-btn {
  padding: 8px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #4080ff;
  color: #4080ff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.total-info {
  font-size: 13px;
  color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #9ca3af;
}

.empty-state p {
  font-size: 16px;
}
</style>