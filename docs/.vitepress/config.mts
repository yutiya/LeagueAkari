import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'League Akari',
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  description: '兴趣使然、功能全面的英雄联盟工具集',
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '开始使用', link: '/getting-started' },
      { text: '常见问题', link: '/faq' }
    ],

    sidebar: [
      {
        text: '总览',
        items: [
          { text: '开始使用', link: '/getting-started' },
          { text: '常见问题', link: '/faq' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Hanxven/LeagueAkari' }
    ],

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    outline: {
      label: '页面导航'
    },
    darkModeSwitchLabel: '外观',
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchTitle: '切换夜间模式',
    lightModeSwitchTitle: '切换日间模式'
  }
})
