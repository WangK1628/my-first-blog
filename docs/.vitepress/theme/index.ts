import BlogTheme from '@sugarat/theme'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Admin from './components/Admin.vue'

// 自定义样式重载
// import './style.css'

// 自定义主题色
// import './user-theme.css'

const theme: Theme = {
  ...BlogTheme,
  enhanceApp(ctx) {
    BlogTheme.enhanceApp?.(ctx)
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('Admin', Admin)
  }
}

export default theme
