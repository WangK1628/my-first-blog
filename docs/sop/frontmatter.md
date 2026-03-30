---
description: 介绍文章与页面独立配置项 frontmatter
title: 📝 frontmatter 配置
readingTime: false
tag:
  - 配置
recommend: 1
---

# frontmatter 配置
该主题的配置分为两大块，分别是首页独立配置 `home` 和单篇文章独立配置 `Article`，且主题继承默认主题配置，原主题配置依然生效，同时支持官方内置的 markdown 能力。

## 主题相关 frontmatter 汇总
```ts
const frontmatter = ['layout', 'blog', 'title', 'description', 'descriptionHTML', 'cover', 'hiddenCover', 'hidden', 'author', 'readingTime', 'comment', 'date', 'tag', 'tags', 'categories', 'sticky', 'top', 'recommend', 'publish', 'buttonAfterArticle']

---
layout: home
blog:
  name: '@Kevin/theme'
  motto: 隔壁小王👑不头秃的博客主题
  inspiring: 基于 Vitepress 定制的主题🎨
  pageSize: 2
---