# thenPlugin

thenPlugin 是一个在流中特定节点完成后执行插件的工具函数。

## 类型定义

```typescript
thenPlugin: <T>(
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
  }) => Promise<any>
}
```

## 参数

- `plugins` (必需): 要执行的插件数组
- `resolvePrefix` (可选): 成功时的控制台前缀，默认为 `'resolve'`
- `rejectPrefix` (可选): 失败时的控制台前缀，默认为 `'reject'`
- `ignoreUndefined` (可选): 是否忽略 `undefined` 值的输出，默认为 `true`

## 详细说明

- 只在当前节点完成后执行指定的插件数组，不会在整个流链上执行
- 等待当前节点的结果（包括 Promise）完全解析后再执行插件
- 按照插件数组的顺序依次执行每个插件
- 插件执行的条件：
  - 根节点 (`root=true`)
  - 有成功处理器的节点 (`onfulfilled`)
  - 有错误处理器的节点 (`onrejected`) 且状态为 `REJECTED`
- 返回原始的 `result`，不修改数据流

## 示例

### 场景 1：节点完成后的处理

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

const completionPlugin = () => ({
  execute: ({ result }: any) => {
    console.log('节点完成，结果:', result)
    return result
  },
})

const timestampPlugin = () => ({
  execute: ({ result }: any) => {
    console.log('完成时间:', new Date().toISOString())
    return result
  },
})

const plugins = [completionPlugin(), timestampPlugin()]

const stream$ = $()
  .then(async (value) => {
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 500))
    return value * 2
  })
  .use(thenPlugin(plugins)) // 只在这个节点完成后执行
  .then((value) => value + 10)

stream$.next(5)
// 500ms后输出:
// 节点完成，结果: 10
// 完成时间: 2023-...
```

### 场景 2：特定节点的后处理

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

const validationPlugin = () => ({
  execute: ({ result }: any) => {
    if (result > 0) {
      console.log('验证通过:', result)
    } else {
      console.log('验证失败:', result)
    }
    return result
  },
})

const cachePlugin = () => ({
  execute: ({ result }: any) => {
    console.log('缓存结果:', result)
    // 模拟缓存操作
    return result
  },
})

const plugins = [validationPlugin(), cachePlugin()]

const stream$ = $()
  .then((value) => value * 3)
  .use(thenPlugin(plugins)) // 只在乘法操作完成后执行
  .then((value) => value - 5)

stream$.next(4)
// 输出:
// 验证通过: 12
// 缓存结果: 12
// 最终结果: 7

stream$.next(-2)
// 输出:
// 验证失败: -6
// 缓存结果: -6
// 最终结果: -11
```

### 场景 3：异步操作完成后的处理

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

const notificationPlugin = () => ({
  execute: ({ result }: any) => {
    console.log('发送通知: 异步操作完成，结果为', result)
    return result
  },
})

const metricsPlugin = () => ({
  execute: ({ result }: any) => {
    console.log('记录指标: 处理了数据', result)
    return result
  },
})

const plugins = [notificationPlugin(), metricsPlugin()]

const stream$ = $()
  .then((value) => value + 1)
  .then(async (value) => {
    // 模拟数据库操作
    await new Promise((resolve) => setTimeout(resolve, 800))
    return value * 2
  })
  .use(thenPlugin(plugins)) // 数据库操作完成后执行
  .then((value) => value + 100)

stream$.next(10)
// 800ms后输出:
// 发送通知: 异步操作完成，结果为 22
// 记录指标: 处理了数据 22
// 最终结果: 122
```

### 场景 4：错误处理和恢复

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

const errorHandlerPlugin = () => ({
  execute: ({ result, status }: any) => {
    if (status === 'REJECTED') {
      console.log('节点错误处理:', result.message)
      // 执行错误恢复逻辑
    } else {
      console.log('节点成功完成:', result)
    }
    return result
  },
})

const auditPlugin = () => ({
  execute: ({ result, status }: any) => {
    console.log('审计记录:', {
      status,
      result: status === 'REJECTED' ? result.message : result,
      timestamp: Date.now(),
    })
    return result
  },
})

const plugins = [errorHandlerPlugin(), auditPlugin()]

const stream$ = $()
  .then((value) => {
    if (value < 0) {
      throw new Error('负数不允许')
    }
    return value * 2
  })
  .use(thenPlugin(plugins))
  .then((value) => value + 1)

stream$.next(5)
// 输出:
// 节点成功完成: 10
// 审计记录: { status: null, result: 10, timestamp: ... }

stream$.next(-3)
// 输出:
// 节点错误处理: 负数不允许
// 审计记录: { status: 'REJECTED', result: '负数不允许', timestamp: ... }
```

### 场景 5：性能监控

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

const performancePlugin = (operationName: string) => {
  const startTime = Date.now()

  return {
    execute: ({ result }: any) => {
      const endTime = Date.now()
      const duration = endTime - startTime
      console.log(`${operationName} 执行时间: ${duration}ms`)
      return result
    },
  }
}

const resourcePlugin = () => ({
  execute: ({ result }: any) => {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage()
      console.log('内存使用:', Math.round(memory.heapUsed / 1024 / 1024), 'MB')
    }
    return result
  },
})

const plugins = [performancePlugin('数据处理'), resourcePlugin()]

const stream$ = $()
  .then(async (value) => {
    // 模拟耗时操作
    await new Promise((resolve) => setTimeout(resolve, 200))
    return value.map((x: number) => x * x)
  })
  .use(thenPlugin(plugins))
  .then((value) => value.reduce((a: number, b: number) => a + b, 0))

stream$.next([1, 2, 3, 4, 5])
// 200ms后输出:
// 数据处理 执行时间: 200ms
// 内存使用: XX MB
```

### 场景 6：条件执行插件

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

const conditionalPlugin = (condition: (result: any) => boolean, message: string) => ({
  execute: ({ result }: any) => {
    if (condition(result)) {
      console.log(`${message}: ${result}`)
    }
    return result
  },
})

const plugins = [
  conditionalPlugin((x) => x > 50, '高值警告'),
  conditionalPlugin((x) => x < 10, '低值提醒'),
  conditionalPlugin((x) => x % 10 === 0, '整十数'),
]

const stream$ = $()
  .then((value) => value * 5)
  .use(thenPlugin(plugins))
  .then((value) => value / 2)

stream$.next(12)
// 输出: 高值警告: 60

stream$.next(1)
// 输出: 低值提醒: 5

stream$.next(4)
// 输出: 整十数: 20
```

### 场景 7：数据转换和格式化

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

const formatPlugin = () => ({
  execute: ({ result }: any) => {
    const formatted = JSON.stringify(result, null, 2)
    console.log('格式化数据:', formatted)
    return result
  },
})

const validationPlugin = () => ({
  execute: ({ result }: any) => {
    const isValid = typeof result === 'object' && result !== null
    console.log('数据验证:', isValid ? '通过' : '失败')
    return result
  },
})

const serializationPlugin = () => ({
  execute: ({ result }: any) => {
    const serialized = Buffer.from(JSON.stringify(result)).toString('base64')
    console.log('序列化长度:', serialized.length)
    return result
  },
})

const plugins = [formatPlugin(), validationPlugin(), serializationPlugin()]

const stream$ = $()
  .then((value) => ({
    id: value,
    name: `Item ${value}`,
    timestamp: Date.now(),
  }))
  .use(thenPlugin(plugins))
  .then((value) => ({ ...value, processed: true }))

stream$.next(42)
// 输出格式化、验证和序列化信息
```

### 场景 8：插件状态管理

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

class StatefulPlugin {
  private history: any[] = []
  private count = 0

  getPlugin() {
    return {
      execute: ({ result }: any) => {
        this.count++
        this.history.push(result)
        console.log(`第 ${this.count} 次处理:`, result)
        console.log('历史记录:', this.history.slice(-3)) // 显示最近3次
        return result
      },
    }
  }

  getStats() {
    return {
      totalCount: this.count,
      history: [...this.history],
    }
  }

  reset() {
    this.history = []
    this.count = 0
  }
}

const statefulPlugin = new StatefulPlugin()
const plugins = [statefulPlugin.getPlugin()]

const stream$ = $()
  .then((value) => value * 2)
  .use(thenPlugin(plugins))
  .then((value) => value + 1)

stream$.next(1) // 第1次处理: 2
stream$.next(2) // 第2次处理: 4
stream$.next(3) // 第3次处理: 6

console.log('统计信息:', statefulPlugin.getStats())
```

### 场景 9：移除插件

```typescript
import { $ } from 'pipeljs'
import { thenPlugin } from 'pipeljs'

const plugin1 = () => ({
  execute: ({ result }: any) => {
    console.log('插件1执行:', result)
    return result
  },
})

const plugin2 = () => ({
  execute: ({ result }: any) => {
    console.log('插件2执行:', result)
    return result
  },
})

const plugins = [plugin1(), plugin2()]
const pluginCombination = thenPlugin(plugins)

const stream$ = $()
  .then((value) => value * 3)
  .use(pluginCombination)
  .then((value) => value + 5)

stream$.next(2)
// 输出:
// 插件1执行: 6
// 插件2执行: 6

stream$.remove(pluginCombination)
stream$.next(4)
// 无插件输出，直接计算: 4 * 3 + 5 = 17
```
