# executePlugin

在节点处理数据时触发的插件，用于修改、监控或记录流经节点的数据。每个节点都可以使用 execute 插件，在数据处理过程中介入操作。

## 类型定义

```typescript
type executePlugin<T> = (params: {
  result: Promise<T> | T
  set: (setter: (state: T) => Promise<void> | void) => Promise<T> | T
  root: boolean
  status: PromiseStatus | null
  onfulfilled?: OnFulfilled
  onrejected?: OnRejected
  unsubscribe: () => void
}) => Promise<any> | any
```

## 参数说明

- `result`: 当前节点的处理结果，可以是同步值或 Promise
- `set`: 不可变状态更新函数，用于安全地修改对象状态
- `root`: 布尔值，表示当前节点是否为根节点
- `status`: 当前节点的状态（pending、resolved、rejected）
- `onfulfilled`: 当前节点的成功处理函数（可选）
- `onrejected`: 当前节点的错误处理函数（可选）
- `unsubscribe`: 取消订阅函数

## 返回值

返回处理后的结果，可以是同步值或 Promise，会替换原始结果。

## 详情

- **数据处理时触发**: 在节点执行数据处理时调用，可以修改或监控数据
- **单节点级别**: 每个节点独立使用，不影响其他节点
- **结果替换**: 返回的非 `undefined` 值会替换原始处理结果
- **链式处理**: 多个 execute 插件按顺序执行，后一个插件接收前一个插件的结果

## 执行机制

2. **执行顺序**: 先执行 `executeAll` 插件，再执行当前节点的 `execute` 插件
3. **错误处理**: 插件中的错误会被安全处理，不会中断整个流程

## 使用场景

### 场景 1：数据验证和转换

```typescript
import { $ } from 'pipel'

// 数据验证插件
const validationPlugin = {
  execute: ({ result, root }) => {
    // 跳过 Promise 类型的处理
    if (result instanceof Promise) return result

    // 根节点数据验证
    if (root && typeof result === 'string') {
      const trimmed = result.trim()
      if (trimmed.length === 0) {
        throw new Error('输入数据不能为空')
      }
      console.log(`根节点验证通过: "${result}" -> "${trimmed}"`)
      return trimmed
    }

    // 数字范围验证
    if (typeof result === 'number') {
      if (result < 0) {
        console.log(`数值验证失败: ${result} < 0`)
        return 0 // 修正为最小值
      }
      if (result > 100) {
        console.log(`数值验证警告: ${result} > 100`)
        return 100 // 修正为最大值
      }
    }

    return result
  },
}

const stream$ = $().use(validationPlugin)

const processor$ = stream$
  .then((data) => data.length) // 获取字符串长度
  .use(validationPlugin) // 子节点也使用验证
  .then((length) => {
    console.log('有效长度:', length)
    return length
  })

stream$.next('  hello world  ')
// 输出:
// 根节点验证通过: "  hello world  " -> "hello world"
// 有效长度: 11

stream$.next('') // 空字符串
// 输出: 错误: 输入数据不能为空
```

### 场景 2：性能监控和日志记录

```typescript
import { $ } from 'pipel'

// 性能监控插件
const performanceLoggerPlugin = {
  execute: ({ result, root, status }) => {
    const nodeType = root ? 'ROOT' : 'CHILD'
    const timestamp = new Date().toISOString()

    // 记录节点执行信息
    console.log(`[${timestamp}] ${nodeType} 节点执行:`, {
      status,
      dataType: typeof result,
      isPromise: result instanceof Promise,
      dataPreview:
        result instanceof Promise
          ? 'Promise'
          : typeof result === 'string'
          ? result.substring(0, 50)
          : result,
    })

    // 对于 Promise 类型，添加性能监控
    if (result instanceof Promise) {
      const startTime = Date.now()

      return result.then(
        (value) => {
          const duration = Date.now() - startTime
          console.log(`[${timestamp}] ${nodeType} Promise 执行完成，耗时: ${duration}ms`)
          return value
        },
        (error) => {
          const duration = Date.now() - startTime
          console.log(`[${timestamp}] ${nodeType} Promise 执行失败，耗时: ${duration}ms`)
          throw error
        }
      )
    }

    return result
  },
}

const stream$ = $().use(performanceLoggerPlugin)

const asyncProcessor$ = stream$
  .then(async (data) => {
    // 模拟异步处理
    await new Promise((resolve) => setTimeout(resolve, 100))
    return data.toUpperCase()
  })
  .use(performanceLoggerPlugin) // 子节点也监控
  .then(async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return `处理结果: ${data}`
  })

stream$.next('hello')
// 输出详细的性能日志
```
