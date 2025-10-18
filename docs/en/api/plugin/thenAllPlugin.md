# thenAllPlugin

thenAllPlugin 是一个在流链的所有节点完成后执行插件的工具函数。

## 类型定义

```typescript
thenAllPlugin: <T>(
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
  }) => Promise<any>
}
```

## 参数

- `plugins` (必需): 要执行的插件数组
- `resolvePrefix` (可选): 成功时的控制台前缀，默认为 `'resolve'`
- `rejectPrefix` (可选): 失败时的控制台前缀，默认为 `'reject'`
- `ignoreUndefined` (可选): 是否忽略 `undefined` 值的输出，默认为 `true`

## 详细说明

- 在流链的所有节点完成后执行指定的插件数组
- 等待当前节点的结果（包括 Promise）完全解析后再执行插件
- 按照插件数组的顺序依次执行每个插件
- 插件执行的条件与其他插件相同：
  - 根节点 (`root=true`)
  - 有成功处理器的节点 (`onfulfilled`)
  - 有错误处理器的节点 (`onrejected`) 且状态为 `REJECTED`
- 返回原始的 `result`，不修改数据流

## 示例

### 场景 1：流完成后的清理工作

```typescript
import { $ } from 'pipeljs'
import { thenAllPlugin } from 'pipeljs'

const cleanupPlugin = () => ({
  executeAll: ({ result }: any) => {
    console.log('清理资源，最终结果:', result)
    // 执行清理逻辑
    return result
  },
})

const logPlugin = () => ({
  executeAll: ({ result }: any) => {
    console.log('记录日志:', result)
    return result
  },
})

const plugins = [cleanupPlugin(), logPlugin()]
const stream$ = $().use(thenAllPlugin(plugins))

stream$.then((value) => value * 2).then((value) => value + 10)

stream$.next(5)
// 等待所有操作完成后输出:
// 清理资源，最终结果: 20
// 记录日志: 20
```

### 场景 2：异步操作完成后的处理

```typescript
import { $ } from 'pipeljs'
import { thenAllPlugin } from 'pipeljs'

const notificationPlugin = () => ({
  executeAll: ({ result }: any) => {
    console.log('发送通知: 操作完成，结果为', result)
    // 模拟发送通知
    return result
  },
})

const cachePlugin = () => ({
  executeAll: ({ result }: any) => {
    console.log('缓存结果:', result)
    // 模拟缓存操作
    return result
  },
})

const plugins = [notificationPlugin(), cachePlugin()]
const stream$ = $().use(thenAllPlugin(plugins))

stream$
  .then(async (value) => {
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return value * 3
  })
  .then((value) => value + 5)

stream$.next(10)
// 1秒后输出:
// 发送通知: 操作完成，结果为 35
// 缓存结果: 35
```

### 场景 3：错误处理和恢复

```typescript
import { $ } from 'pipeljs'
import { thenAllPlugin } from 'pipeljs'

const errorReportPlugin = () => ({
  executeAll: ({ result, status }: any) => {
    if (status === 'REJECTED') {
      console.log('错误报告:', result.message)
      // 发送错误报告
    } else {
      console.log('操作成功:', result)
    }
    return result
  },
})

const recoveryPlugin = () => ({
  executeAll: ({ result, status }: any) => {
    if (status === 'REJECTED') {
      console.log('尝试恢复操作')
      // 执行恢复逻辑
    }
    return result
  },
})

const plugins = [errorReportPlugin(), recoveryPlugin()]
const stream$ = $().use(thenAllPlugin(plugins))

stream$.then((value) => {
  if (value < 0) {
    throw new Error('负数错误')
  }
  return value * 2
})

stream$.next(5)
// 输出: 操作成功: 10

stream$.next(-3)
// 输出: 错误报告: 负数错误
// 输出: 尝试恢复操作
```

### 场景 4：性能统计和监控

```typescript
import { $ } from 'pipeljs'
import { thenAllPlugin } from 'pipeljs'

const performancePlugin = () => {
  const startTime = Date.now()

  return {
    executeAll: ({ result }: any) => {
      const endTime = Date.now()
      const duration = endTime - startTime
      console.log(`总执行时间: ${duration}ms`)
      console.log(`最终结果: ${result}`)
      return result
    },
  }
}

const memoryPlugin = () => ({
  executeAll: ({ result }: any) => {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage()
      console.log('最终内存使用:', Math.round(memory.heapUsed / 1024 / 1024), 'MB')
    }
    return result
  },
})

const plugins = [performancePlugin(), memoryPlugin()]
const stream$ = $().use(thenAllPlugin(plugins))

stream$
  .then(async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return value * 2
  })
  .then(async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return value + 10
  })

stream$.next(15)
// 约800ms后输出性能和内存统计
```

### 场景 5：数据验证和保存

```typescript
import { $ } from 'pipeljs'
import { thenAllPlugin } from 'pipeljs'

const validationPlugin = () => ({
  executeAll: ({ result }: any) => {
    if (typeof result === 'number' && result > 0) {
      console.log('数据验证通过:', result)
    } else {
      console.log('数据验证失败:', result)
    }
    return result
  },
})

const savePlugin = () => ({
  executeAll: ({ result }: any) => {
    console.log('保存数据到数据库:', result)
    // 模拟保存操作
    return result
  },
})

const auditPlugin = () => ({
  executeAll: ({ result }: any) => {
    console.log('审计日志: 数据处理完成', {
      timestamp: new Date().toISOString(),
      result,
    })
    return result
  },
})

const plugins = [validationPlugin(), savePlugin(), auditPlugin()]
const stream$ = $().use(thenAllPlugin(plugins))

stream$.then((value) => value * 2).then((value) => Math.round(value))

stream$.next(3.7)
// 输出:
// 数据验证通过: 7
// 保存数据到数据库: 7
// 审计日志: 数据处理完成 { timestamp: '...', result: 7 }
```

### 场景 6：条件执行插件

```typescript
import { $ } from 'pipeljs'
import { thenAllPlugin } from 'pipeljs'

const conditionalPlugin = (condition: (result: any) => boolean, action: string) => ({
  executeAll: ({ result }: any) => {
    if (condition(result)) {
      console.log(`条件满足，执行 ${action}:`, result)
    } else {
      console.log(`条件不满足，跳过 ${action}:`, result)
    }
    return result
  },
})

const plugins = [
  conditionalPlugin((x) => x > 10, '高值处理'),
  conditionalPlugin((x) => x % 2 === 0, '偶数处理'),
  conditionalPlugin((x) => x < 5, '低值处理'),
]

const stream$ = $().use(thenAllPlugin(plugins))

stream$.next(12)
// 输出:
// 条件满足，执行 高值处理: 12
// 条件满足，执行 偶数处理: 12
// 条件不满足，跳过 低值处理: 12

stream$.next(3)
// 输出:
// 条件不满足，跳过 高值处理: 3
// 条件不满足，跳过 偶数处理: 3
// 条件满足，执行 低值处理: 3
```

### 场景 7：插件链式处理

```typescript
import { $ } from 'pipeljs'
import { thenAllPlugin } from 'pipeljs'

const formatPlugin = () => ({
  executeAll: ({ result }: any) => {
    const formatted = `结果: ${result}`
    console.log('格式化:', formatted)
    return result
  },
})

const encryptPlugin = () => ({
  executeAll: ({ result }: any) => {
    const encrypted = btoa(result.toString()) // 简单的base64编码
    console.log('加密:', encrypted)
    return result
  },
})

const compressPlugin = () => ({
  executeAll: ({ result }: any) => {
    console.log('压缩数据长度:', result.toString().length)
    return result
  },
})

const plugins = [formatPlugin(), encryptPlugin(), compressPlugin()]
const stream$ = $().use(thenAllPlugin(plugins))

stream$.next('Hello World')
// 输出:
// 格式化: 结果: Hello World
// 加密: SGVsbG8gV29ybGQ=
// 压缩数据长度: 11
```

### 场景 8：移除插件组合

```typescript
import { $ } from 'pipeljs'
import { thenAllPlugin } from 'pipeljs'

const plugin1 = () => ({
  executeAll: ({ result }: any) => {
    console.log('插件1执行:', result)
    return result
  },
})

const plugin2 = () => ({
  executeAll: ({ result }: any) => {
    console.log('插件2执行:', result)
    return result
  },
})

const plugins = [plugin1(), plugin2()]
const pluginCombination = thenAllPlugin(plugins)
const stream$ = $().use(pluginCombination)

stream$.then((value) => value * 2)

stream$.next(5)
// 输出:
// 插件1执行: 10
// 插件2执行: 10

stream$.remove(pluginCombination)
stream$.next(3)
// 无插件输出
```
