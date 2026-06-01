<script setup lang="ts">
import { ref, watch, computed } from 'vue'

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

const props = defineProps({
  article: {
    type: Object as () => Article | null,
    default: null
  }
})

const emit = defineEmits(['save', 'close'])

const isEdit = computed(() => !!props.article)

const form = ref({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  tag: [] as string[],
  recommend: false,
  top: false,
  readingTime: true,
  comment: true
})

const tagInput = ref('')

watch(() => props.article, (newArticle) => {
  if (newArticle) {
    form.value = {
      title: newArticle.meta.title || '',
      description: newArticle.meta.description || '',
      date: newArticle.meta.date ? new Date(newArticle.meta.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      tag: Array.isArray(newArticle.meta.tag) ? [...newArticle.meta.tag] : (newArticle.meta.tag ? [newArticle.meta.tag] : []),
      recommend: !!newArticle.meta.recommend,
      top: !!newArticle.meta.top,
      readingTime: newArticle.meta.readingTime !== false,
      comment: newArticle.meta.comment !== false
    }
  } else {
    form.value = {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      tag: [],
      recommend: false,
      top: false,
      readingTime: true,
      comment: true
    }
  }
}, { immediate: true })

function addTag() {
  if (!tagInput.value.trim()) return

  if (!form.value.tag.includes(tagInput.value.trim())) {
    form.value.tag.push(tagInput.value.trim())
  }

  tagInput.value = ''
}

function removeTag(tag: string) {
  form.value.tag = form.value.tag.filter((t: string) => t !== tag)
}

function handleSubmit() {
  if (!form.value.title.trim()) {
    alert('请输入文章标题')
    return
  }

  emit('save', {
    route: props.article?.route || '',
    meta: { ...form.value }
  } as Article)
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ isEdit ? '编辑文章' : '新增文章' }}</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>文章标题</label>
          <input
            type="text"
            v-model="form.title"
            placeholder="请输入文章标题"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>文章描述</label>
          <textarea
            v-model="form.description"
            placeholder="请输入文章描述"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label>发布日期</label>
          <input
            type="date"
            v-model="form.date"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>标签</label>
          <div class="tag-input-group">
            <input
              type="text"
              v-model="tagInput"
              placeholder="输入标签后按回车添加"
              class="tag-input"
              @keyup.enter="addTag"
            />
            <button class="add-tag-btn" @click="addTag">添加</button>
          </div>
          <div class="tags-list">
            <span
              v-for="tag in form.tag"
              :key="tag"
              class="tag-item"
            >
              {{ tag }}
              <button class="remove-tag-btn" @click="removeTag(tag)">×</button>
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>文章设置</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.recommend" />
              <span>设为精选</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.top" />
              <span>设为置顶</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.readingTime" />
              <span>显示阅读时间</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.comment" />
              <span>开启评论</span>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-cancel" @click="handleClose">取消</button>
        <button class="btn btn-primary" @click="handleSubmit">保存</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  box-sizing: border-box;
}

.tag-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.tag-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.add-tag-btn {
  padding: 10px 20px;
  background: #4080ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #e8f0fe;
  color: #4080ff;
  border-radius: 4px;
  font-size: 13px;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: #4080ff;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-item input {
  width: 16px;
  height: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.3s;
}

.btn:hover {
  opacity: 0.8;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-primary {
  background: #4080ff;
  color: white;
}
</style>