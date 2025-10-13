# executePlugin

executePlugin 是一个在流中特定节点执行插件的工具函数。

## 类型定义

```typescript
executePlugin: <T>(
  plugins: Plugin<T>[],
  resolvePrefix?: string,
  rejectPrefix?: string,
  ignoreUndefined?: boolean
) => {
  execute: ({
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

- 只在当前节点执行指定的插件数组，不会在整个流链上执行
- 按照插件数组的顺序依次执行每个插件
- 插件执行的条件：
  - 根节点 (`root=true`)
  - 有成功处理器的节点 (`onfulfilled`)
  - 有错误处理器的节点 (`onrejected`) 且状态为 `REJECTED`
- 返回原始的 `result`，不修改数据流

## 示例

### 场景 1：在特定节点执行多个插件

```typescript
import { $ } from 'pipel'
import { executePlugin, debugNode, consoleNode } from 'pipel'

const plugins = [debugNode(), consoleNode()]
const promise$ = $()

promise$
  .then((value) => value + 1)
  .use(executePlugin(plugins)) // 只在这个节点执行插件
  .then((value) => value + 1)

promise$.next(1)
// 只在中间节点输出调试信息: resolve 2
```

### 场景 2：自定义插件组合

```typescript
import { $ } from 'pipel'
import { executePlugin } from 'pipel'

// 自定义插件
const loggerPlugin = (prefix: string) => ({
  execute: ({ result }: any) => {
    console.log(`${prefix}:`, result)
    return result
  },
})

const validatorPlugin = (validator: (value: any) => boolean) => ({
  execute: ({ result }: any) => {
    if (validator(result)) {
      console.log('验证通过:', result)
    } else {
      console.log('验证失败:', result)
    }
    return result
  },
})

const plugins = [loggerPlugin('数据'), validatorPlugin((x) => x > 0)]

const stream$ = $()
  .then((value) => value * 2)
  .use(executePlugin(plugins)) // 只在这个节点执行

stream$.next(5)
// 输出: 数据: 10
// 输出: 验证通过: 10

stream$.next(-3)
// 输出: 数据: -6
// 输出: 验证失败: -6
```

### 场景 3：条件执行插件

```typescript
import { $ } from 'pipel'
import { executePlugin } from 'pipel'

const conditionalPlugin = (condition: (value: any) => boolean, message: string) => ({
  execute: ({ result }: any) => {
    if (condition(result)) {
      console.log(message, result)
    }
    return result
  },
})

const plugins = [
  conditionalPlugin((x) => x % 2 === 0, '偶数:'),
  conditionalPlugin((x) => x % 2 === 1, '奇数:'),
  conditionalPlugin((x) => x > 10, '大数:'),
]

const stream$ = $().use(executePlugin(plugins))

stream$.next(12)
// 输出: 偶数: 12
// 输出: 大数: 12

stream$.next(7)
// 输出: 奇数: 7
```

### 场景 4：数据转换插件

```typescript
import { $ } from 'pipel'
import { executePlugin } from 'pipel'

const transformPlugin = (name: string, transform: (value: any) => any) => ({
  execute: ({ result }: any) => {
    const transformed = transform(result)
    console.log(`${name}: ${result} -> ${transformed}`)
    return result // 注意：不修改原始结果
  },
})

const plugins = [
  transformPlugin('平方', (x) => x * x),
  transformPlugin('字符串', (x) => `值: ${x}`),
  transformPlugin('布尔', (x) => x > 5),
]

const stream$ = $().use(executePlugin(plugins))

stream$.next(3)
// 输出: 平方: 3 -> 9
// 输出: 字符串: 3 -> 值: 3
// 输出: 布尔: 3 -> false

stream$.next(8)
// 输出: 平方: 8 -> 64
// 输出: 字符串: 8 -> 值: 8
// 输出: 布尔: 8 -> true
```

### 场景 5：错误处理插件

```typescript
import { $ } from 'pipel'
import { executePlugin } from 'pipel'

const errorHandlerPlugin = () => ({
  execute: ({ result, status }: any) => {
    if (status === 'REJECTED') {
      console.log('节点错误:', result.message)
    } else {
      console.log('节点成功:', result)
    }
    return result
  },
})

const retryPlugin = (maxRetries: number) => {
  let retryCount = 0

  return {
    execute: ({ result, status }: any) => {
      if (status === 'REJECTED' && retryCount < maxRetries) {
        retryCount++
        console.log(`重试 ${retryCount}/${maxRetries}`)
      }
      return result
    },
  }
}

const plugins = [errorHandlerPlugin(), retryPlugin(3)]

const stream$ = $()
  .then((value) => {
    if (value < 0) {
      throw new Error('负数错误')
    }
    return value * 2
  })
  .use(executePlugin(plugins))

stream$.next(5)
// 输出: 节点成功: 10

stream$.next(-1)
// 输出: 节点错误: 负数错误
// 输出: 重试 1/3
```

### 场景 6：性能监控插件

```typescript
import { $ } from 'pipel'
import { executePlugin } from 'pipel'

const performancePlugin = (name: string) => {
  let startTime: number

  return {
    execute: ({ result }: any) => {
      if (!startTime) {
        startTime = Date.now()
        console.log(`${name} 开始执行`)
      } else {
        const elapsed = Date.now() - startTime
        console.log(`${name} 执行完成，耗时: ${elapsed}ms`)
      }
      return result
    },
  }
}

const memoryPlugin = () => ({
  execute: ({ result }: any) => {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage()
      console.log('内存使用:', Math.round(memory.heapUsed / 1024 / 1024), 'MB')
    }
    return result
  },
})

const plugins = [performancePlugin('节点A'), memoryPlugin()]

const stream$ = $()
  .then(async (value) => {
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 100))
    return value * 2
  })
  .use(executePlugin(plugins))

stream$.next(10)
// 输出性能和内存信息
```

### 场景 7：插件状态管理

```typescript
import { $ } from 'pipel'
import { executePlugin } from 'pipel'

class StatefulPlugin {
  private count = 0
  private values: any[] = []

  getPlugin() {
    return {
      execute: ({ result }: any) => {
        this.count++
        this.values.push(result)
        console.log(`第 ${this.count} 次执行, 值: ${result}`)
        console.log('历史值:', this.values)
        return result
      },
    }
  }

  reset() {
    this.count = 0
    this.values = []
  }

  getStats() {
    return {
      count: this.count,
      values: [...this.values],
    }
  }
}

const statefulPlugin = new StatefulPlugin()
const plugins = [statefulPlugin.getPlugin()]

const stream$ = $().use(executePlugin(plugins))

stream$.next(1)
stream$.next(2)
stream$.next(3)

console.log('统计信息:', statefulPlugin.getStats())
// 输出执行历史和统计信息
```

### 场景 8：移除插件组合

```typescript
import { $ } from 'pipel'
import { executePlugin, debugNode, consoleNode } from 'pipel'

const plugins = [debugNode(), consoleNode()]
const pluginCombination = executePlugin(plugins)

const stream$ = $()
  .then((value) => value + 1)
  .use(pluginCombination)
  .then((value) => value + 1)

stream$.next(1)
// 输出调试信息

stream$.remove(pluginCombination)
stream$.next(2)
// 无调试输出
```
