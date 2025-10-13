export default {
  label: '简体中文',
  lang: 'cn',
  title: 'pipel',
  description: '类 Promise 的异步流程控制库',
  themeConfig: {
    outline: 'deep',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '指南', link: '/cn/guide/introduce' },
      { text: 'API', link: '/cn/api/stream' },
      { text: 'changelog', link: 'https://github.com/pipeljs/pipel/blob/master/CHANGELOG.md' },
      { text: 'pipel-vue', link: 'https://pipeljs.github.io/pipel-vue/index.html' },
    ],
    sidebar: {
      '/cn/': [
        {
          text: '指南',
          items: [
            { text: '简介', link: '/cn/guide/introduce' },
            { text: '基本概念', link: '/cn/guide/base' },
            { text: '快速开始', link: '/cn/guide/quick' },
            { text: '适用场景', link: '/cn/guide/scene' },
            { text: '边界说明', link: '/cn/guide/boundary' },
            { text: '使用插件', link: '/cn/guide/plugin' },
            { text: '不可变数据', link: '/cn/guide/immutable' },
            { text: 'typescript支持', link: '/cn/guide/type' },
          ],
        },
        {
          text: 'API',
          items: [
            {
              text: '流',
              items: [
                { text: '$', link: '/cn/api/$' },
                { text: 'Stream', link: '/cn/api/stream' },
                { text: 'Observable', link: '/cn/api/observable' },
              ],
            },
            {
              text: '操作符',
              items: [
                {
                  text: '创建操作符',
                  items: [
                    { text: 'fork', link: '/cn/api/operator/fork' },
                    { text: 'finish', link: '/cn/api/operator/finish' },
                    { text: 'combine', link: '/cn/api/operator/combine' },
                    { text: 'concat', link: '/cn/api/operator/concat' },
                    { text: 'merge', link: '/cn/api/operator/merge' },
                    { text: 'partition', link: '/cn/api/operator/partition' },
                    { text: 'promiseAll', link: '/cn/api/operator/promiseAll' },
                    { text: 'promiseAllNoAwait', link: '/cn/api/operator/promiseAllNoAwait' },
                    { text: 'promiseRace', link: '/cn/api/operator/promiseRace' },
                  ],
                },
                {
                  text: '过滤操作符',
                  items: [
                    { text: 'get', link: '/cn/api/operator/get' },
                    { text: 'change', link: '/cn/api/operator/change' },
                    { text: 'filter', link: '/cn/api/operator/filter' },
                    { text: 'skip', link: '/cn/api/operator/skip' },
                    { text: 'skipUntil', link: '/cn/api/operator/skipUntil' },
                    { text: 'skipFilter', link: '/cn/api/operator/skipFilter' },
                    { text: 'throttle', link: '/cn/api/operator/throttle' },
                    { text: 'debounce', link: '/cn/api/operator/debounce' },
                  ],
                },
                {
                  text: '转换操作符',
                  items: [
                    { text: 'map', link: '/cn/api/operator/map' },
                    { text: 'set', link: '/cn/api/operator/set' },
                    { text: 'audit', link: '/cn/api/operator/audit' },
                    { text: 'buffer', link: '/cn/api/operator/buffer' },
                  ],
                },
                {
                  text: '工具操作符',
                  items: [{ text: 'delay', link: '/cn/api/operator/delay' }],
                },
              ],
            },
            {
              text: '插件',
              link: '/cn/api/plugin/plugin',
              items: [
                {
                  text: 'execute插件',
                  link: '/cn/api/plugin/executePlugin',
                  items: [
                    { text: 'consoleNode', link: '/cn/api/plugin/consoleNode' },
                    { text: 'debugNode', link: '/cn/api/plugin/debugNode' },
                    { text: 'delayExec', link: '/cn/api/plugin/delayExec' },
                  ],
                },
                {
                  text: 'executeAll插件',
                  link: '/cn/api/plugin/executeAllPlugin',
                  items: [
                    { text: 'consoleAll', link: '/cn/api/plugin/consoleAll' },
                    { text: 'debugAll', link: '/cn/api/plugin/debugAll' },
                  ],
                },
                {
                  text: 'then插件',
                  link: '/cn/api/plugin/thenPlugin',
                },
                {
                  text: 'thenAll插件',
                  link: '/cn/api/plugin/thenAllPlugin',
                },
              ],
            },
          ],
        },
      ],
    },
  },
}
