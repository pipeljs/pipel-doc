# executeAllPlugin

executeAllPlugin 是一个在流链的所有节点上执行插件的工具函数。

## 类型定义

```typescript
executeAllPlugin: <T>(
  plugins: Plugin<T>[],
  resolvePrefix?: string,
  rejectPrefix?: string,
  ignoreUndefined?: boolean
) => {
  executeAll: ({
    result,
    status,
    onfulfilled,
    onrejected,
    root,
  }: {
    result: Promise<any> | any
    status: PromiseStatus | null
    onfulfilled?: OnFulfilled
    onrejected?: OnRejected
    root: boolean
  }) => any
}
```

## 参数

- `plugins` (必需): 要执行的插件数组
- `resolvePrefix` (可选): 成功时的控制台前缀，默认为 `'resolve'`
- `rejectPrefix` (可选): 失败时的控制台前缀，默认为 `'reject'`
- `ignoreUndefined` (可选): 是否忽略 `undefined` 值的输出，默认为 `true`

## 详细说明

- 在流链的所有节点上执行指定的插件数组
- 按照插件数组的顺序依次执行每个插件
- 每个插件都会在所有符合条件的节点上执行
- 插件执行的条件与单个插件相同：
  - 根节点 (`root=true`)
  - 有成功处理器的节点 (`onfulfilled`)
  - 有错误处理器的节点 (`onrejected`) 且状态为 `REJECTED`
- 返回原始的 `result`，不修改数据流

## 示例

### 场景 1：执行多个调试插件

```typescript
import { $ } from 'pipel'
import { executeAllPlugin, debugAll, consoleAll } from 'pipel'

const plugins = [debugAll(), consoleAll()]
const stream$ = $().use(executeAllPlugin(plugins))

stream$.then((value) => value + 1)

stream$.next(1)
// 输出来自 debugAll 和 consoleAll 的调试信息
```

### 场景 2：自定义插件组合

```typescript
import { $ } from 'pipel'
import { executeAllPlugin } from 'pipel'

// 自定义插件
const loggerPlugin = (prefix: string) => ({
  executeAll: ({ result }: any) => {
    console.log(`${prefix}:`, result)
    return result
  },
})

const timerPlugin = () => ({
  executeAll: ({ result }: any) => {
    console.log('时间戳:', Date.now())
    return result
  },
})

const plugins = [loggerPlugin('数据'), timerPlugin()]
const stream$ = $().use(executeAllPlugin(plugins))

stream$.next('测试数据')
// 输出: 数据: 测试数据
// 输出: 时间戳: [当前时间戳]
```

### 场景 3：条件执行插件

```typescript
import { $ } from 'pipel'
import { executeAllPlugin } from 'pipel'

const conditionalPlugin = (condition: boolean) => ({
  executeAll: ({ result }: any) => {
    if (condition) {
      console.log('条件满足:', result)
    }
    return result
  },
})

const plugins = [conditionalPlugin(true), conditionalPlugin(false)]

const stream$ = $().use(executeAllPlugin(plugins))

stream$.next('测试')
// 只输出: 条件满足: 测试
```

### 场景 4：插件链式处理

```typescript
import { $ } from 'pipel'
import { executeAllPlugin } from 'pipel'

const transformPlugin = (transform: (value: any) => any) => ({
  executeAll: ({ result }: any) => {
    const transformed = transform(result)
    console.log('转换:', result, '->', transformed)
    return result // 注意：不修改原始结果
  },
})

const plugins = [
  transformPlugin((x) => x * 2),
  transformPlugin((x) => x + 10),
  transformPlugin((x) => `值: ${x}`),
]

const stream$ = $().use(executeAllPlugin(plugins))

stream$.next(5)
// 输出: 转换: 5 -> 10
// 输出: 转换: 5 -> 15
// 输出: 转换: 5 -> 值: 5
```

### 场景 5：错误处理插件

```typescript
import { $ } from 'pipel'
import { executeAllPlugin } from 'pipel'

const errorHandlerPlugin = () => ({
  executeAll: ({ result, status }: any) => {
    if (status === 'REJECTED') {
      console.log('捕获错误:', result)
    } else {
      console.log('正常值:', result)
    }
    return result
  },
})

const plugins = [errorHandlerPlugin()]
const stream$ = $().use(executeAllPlugin(plugins))

stream$.next(42)
// 输出: 正常值: 42

stream$.next(Promise.reject(new Error('测试错误')))
// 输出: 捕获错误: Error: 测试错误
```

### 场景 6：性能监控插件

```typescript
import { $ } from 'pipel'
import { executeAllPlugin } from 'pipel'

const performancePlugin = () => {
  const startTime = Date.now()

  return {
    executeAll: ({ result }: any) => {
      const elapsed = Date.now() - startTime
      console.log(`执行时间: ${elapsed}ms, 结果:`, result)
      return result
    },
  }
}

const memoryPlugin = () => ({
  executeAll: ({ result }: any) => {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage()
      console.log('内存使用:', Math.round(memory.heapUsed / 1024 / 1024), 'MB')
    }
    return result
  },
})

const plugins = [performancePlugin(), memoryPlugin()]
const stream$ = $().use(executeAllPlugin(plugins))

stream$.then((value) => {
  // 模拟一些处理时间
  return new Promise((resolve) => setTimeout(() => resolve(value * 2), 100))
})

stream$.next(10)
// 输出性能和内存信息
```

### 场景 7：移除插件组合

```typescript
import { $ } from 'pipel'
import { executeAllPlugin, debugAll, consoleAll } from 'pipel'

const plugins = [debugAll(), consoleAll()]
const pluginCombination = executeAllPlugin(plugins)
const stream$ = $().use(pluginCombination)

stream$.next(1)
// 输出调试信息

stream$.remove(pluginCombination)
stream$.next(2)
// 无调试输出
```

### 场景 8：动态插件管理

```typescript
import { $ } from 'pipel'
import { executeAllPlugin } from 'pipel'

class PluginManager {
  private plugins: any[] = []

  addPlugin(plugin: any) {
    this.plugins.push(plugin)
    return this
  }

  getExecutor() {
    return executeAllPlugin(this.plugins)
  }

  clear() {
    this.plugins = []
    return this
  }
}

const manager = new PluginManager()
  .addPlugin({ executeAll: ({ result }: any) => (console.log('插件1:', result), result) })
  .addPlugin({ executeAll: ({ result }: any) => (console.log('插件2:', result), result) })

const stream$ = $().use(manager.getExecutor())

stream$.next('测试')
// 输出: 插件1: 测试
// 输出: 插件2: 测试
```
