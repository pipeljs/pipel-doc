export default {
  label: 'English(AI)',
  lang: 'en',
  title: 'pipel',
  description: 'A Promise-based asynchronous flow control library',
  themeConfig: {
    outline: 'deep',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/en/guide/introduce' },
      { text: 'API', link: '/en/api/stream' },
      { text: 'changelog', link: 'https://github.com/pipeljs/pipel/blob/master/CHANGELOG.md' },
      { text: 'pipel-vue', link: 'https://pipeljs.github.io/pipel-vue/index.html' },
    ],
    sidebar: {
      '/en/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/en/guide/introduce' },
            { text: 'Basic Concepts', link: '/en/guide/base' },
            { text: 'Quick Start', link: '/en/guide/quick' },
            { text: 'Application Scenarios', link: '/en/guide/scene' },
            { text: 'Boundary', link: '/en/guide/boundary' },
            { text: 'Using Plugins', link: '/en/guide/plugin' },
            { text: 'Immutable Data', link: '/en/guide/immutable' },
            { text: 'TypeScript Support', link: '/en/guide/type' },
          ],
        },
        {
          text: 'API',
          items: [
            {
              text: 'Streams',
              items: [
                { text: '$', link: '/en/api/$' },
                { text: 'Stream', link: '/en/api/stream' },
                { text: 'Observable', link: '/en/api/observable' },
              ],
            },
            {
              text: 'Operators',
              items: [
                {
                  text: 'Creation Operators',
                  items: [
                    { text: 'fork', link: '/en/api/operator/fork' },
                    { text: 'finish', link: '/en/api/operator/finish' },
                    { text: 'combine', link: '/en/api/operator/combine' },
                    { text: 'concat', link: '/en/api/operator/concat' },
                    { text: 'merge', link: '/en/api/operator/merge' },
                    { text: 'partition', link: '/en/api/operator/partition' },
                    { text: 'promiseAll', link: '/en/api/operator/promiseAll' },
                    { text: 'promiseAllNoAwait', link: '/en/api/operator/promiseAllNoAwait' },
                    { text: 'promiseRace', link: '/en/api/operator/promiseRace' },
                  ],
                },
                {
                  text: 'Filtering Operators',
                  items: [
                    { text: 'get', link: '/en/api/operator/get' },
                    { text: 'change', link: '/en/api/operator/change' },
                    { text: 'filter', link: '/en/api/operator/filter' },
                    { text: 'skip', link: '/en/api/operator/skip' },
                    { text: 'skipUntil', link: '/en/api/operator/skipUntil' },
                    { text: 'skipFilter', link: '/en/api/operator/skipFilter' },
                    { text: 'throttle', link: '/en/api/operator/throttle' },
                    { text: 'debounce', link: '/en/api/operator/debounce' },
                  ],
                },
                {
                  text: 'Transformation Operators',
                  items: [
                    { text: 'map', link: '/en/api/operator/map' },
                    { text: 'set', link: '/en/api/operator/set' },
                    { text: 'audit', link: '/en/api/operator/audit' },
                    { text: 'buffer', link: '/en/api/operator/buffer' },
                  ],
                },
                {
                  text: 'Utility Operators',
                  items: [{ text: 'delay', link: '/en/api/operator/delay' }],
                },
              ],
            },
            {
              text: 'Plugins',
              link: '/en/api/plugin/plugin',
              items: [
                {
                  text: 'execute plugin',
                  link: '/en/api/plugin/executePlugin',
                  items: [
                    { text: 'consoleNode', link: '/en/api/plugin/consoleNode' },
                    { text: 'debugNode', link: '/en/api/plugin/debugNode' },
                    { text: 'delayExec', link: '/en/api/plugin/delayExec' },
                  ],
                },
                {
                  text: 'executeAll plugin',
                  link: '/en/api/plugin/executeAllPlugin',
                  items: [
                    { text: 'consoleAll', link: '/en/api/plugin/consoleAll' },
                    { text: 'debugAll', link: '/en/api/plugin/debugAll' },
                  ],
                },
                {
                  text: 'then plugin',
                  link: '/en/api/plugin/thenPlugin',
                },
                {
                  text: 'thenAll plugin',
                  link: '/en/api/plugin/thenAllPlugin',
                },
              ],
            },
          ],
        },
      ],
    },
  },
}
