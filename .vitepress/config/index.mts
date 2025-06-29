import { defineConfig } from 'vitepress'
import nav from './nav'
import sidebar from './sidebar'
import fence from "../markdown/fence";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ArcletProject",
  description: "Document for ArcletProject",
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ["meta", { "name": "theme-color", "content": "#2564c2" }]
  ],
  srcDir: './',
  srcExclude: ["./old/**", "./README.md"],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: nav,
    sidebar: sidebar,
    editLink: {
      pattern: 'https://github.com/ArcletProject/Documents/edit/refactor/:path',
      text: '在 GitHub 编辑此页'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ArcletProject' }
    ],

    footer: {
      message: 'MIT License',
      copyright: 'Copyright © 2025 ArcletProject'
    },
    lastUpdated: {
      text: '上次更新',
    },
    outline: {
      label: '目录',
      level: [2, 3]
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    darkModeSwitchLabel: '黑暗模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到黑暗模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部 ▲',
    externalLinkIcon: true
  },
  markdown: {
    theme: {
      light: 'min-light',
      dark: 'one-dark-pro'
    },
    image: {
      lazyLoading: true
    },
    lineNumbers: true,
    config: (md) => {
      md.use(fence);
    }
  }
})
