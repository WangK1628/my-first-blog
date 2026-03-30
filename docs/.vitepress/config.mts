import { defineConfig } from 'vitepress'
import { getThemeConfig } from '@sugarat/theme/node'

// 1. 定义主题配置（包含看板娘和弹窗）
const blogTheme = getThemeConfig({
  popover: {
    title: '📢 广而周知 📢',
    duration: -1,
    mobileMinify: false,
    body: [
      {
        type: 'title',
        content: '小标题',
        style: 'color:red'
      },
      { type: 'text', content: '👇公众号👇---👇 微信 👇' },
      {
        type: 'image',
        src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210~fmt.webp'
      }
    ],
    footer: [
      {
        type: 'text',
        content: 'footer 与 body 结构一致'
      },
      {
        type: 'button',
        link: 'https://sugarat.top',
        content: '作者博客',
        props: {
          round: true
        }
      }
    ]
  },
  // 注意：
     oml2d: {
    mobileDisplay: true,
    models: [
      {
        path: 'https://registry.npmmirror.com/oml2d-models/latest/files/models/Senko_Normals/senko.model3.json'
      }
    ]
  },
	taskCheckbox: {
    // refer https://github.com/linsir/markdown-it-task-checkbox for options
	
  },
mermaid: true

})

// 2. 导出 VitePress 配置
export default defineConfig({
  extends: blogTheme,
  lang: 'zh-cn',
  title: '@sugarat/theme',
  description: '隔壁小王👑不头秃的博客主题，基于 vitepress 实现',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    outline: {
      level: [2, 3],
      label: '目录'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '关于作者', link: 'https://github.com/WangK1628' }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/WangK1628'
      }
    ]
  },
markdown: {
    math: true
  }
})
