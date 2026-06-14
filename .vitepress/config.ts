import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Portal Docs",
  description: "Battlefield 6 Portal Docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction' },
      { text: 'API Reference', link: '/api-reference' }
    ],

    sidebar: [
      { text: 'Introduction', link: '/introduction' },
      { text: 'SDK Download', link: '/sdk' },
      {
        text: 'Spatial Editing',
        collapsed: false,
        items: [
          { text: 'Map Creation', link: '/map-creation' }
        ]
      },
      {
        text: 'Scripting',
        collapsed: false,
        items: [
          { text: 'Scripting', link: '/scripting' },
          { text: 'Block Code', link: '/block-code' },
          { text: 'TypeScript', link: '/typescript' },
          { text: 'Optimization', link: '/optimization' }
        ]
      },
      {
        text: 'Reference',
        collapsed: false,
        items: [
          { text: 'API Reference', link: '/api-reference' }
        ]
      }
    ],

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
