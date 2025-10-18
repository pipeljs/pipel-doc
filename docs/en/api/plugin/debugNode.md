# debugNode

debugNode 是一个在流中特定节点输出执行结果的调试插件，用于调试和监控特定节点的数据流，只能在 `Stream` 节点上使用。

## 类型定义

```typescript
debugNode: (resolvePrefix?: string, rejectPrefix?: string, ignoreUndefined?: boolean) => {
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

- `resolvePrefix` (可选): 成功时的控制台前缀，默认为 `'resolve'`
- `rejectPrefix` (可选): 失败时的控制台前缀，默认为 `'reject'`
- `ignoreUndefined` (可选): 是否忽略 `undefined` 值的输出，默认为 `true`

## 详细说明

- 只在当前节点执行，不会在整个流链上执行
- 只在以下情况下输出：
  - 根节点 (`root=true`)
  - 有成功处理器的节点 (`onfulfilled`)
  - 有错误处理器的节点 (`onrejected`) 且状态为 `REJECTED`
- 对于 `Promise` 类型的结果，会等待 Promise 解析后再输出
- 默认忽略 `undefined` 值的输出 (`ignoreUndefined=true`)，可通过第三个参数控制
- 返回原始的 `result`，不修改数据流

## 示例

### 场景 1：基本调试输出

```typescript
import { $ } from 'pipeljs'
import { debugNode } from 'pipeljs'

const stream$ = $().use(debugNode())

stream$.next(1)
// 输出: resolve 1

const promise = Promise.resolve(2)
stream$.next(promise)
// 输出: resolve 2
```

### 场景 2：流链中特定节点调试

```typescript
import { $ } from 'pipeljs'
import { debugNode } from 'pipeljs'

const promise$ = $()

promise$
  .then((value) => value + 1)
  .use(debugNode()) // 只在这个节点输出
  .then((value) => value + 1)

promise$.next(1)
// 输出: resolve 2 (只输出中间节点的值)
```

### 场景 3：自定义前缀调试输出

```typescript
import { $ } from 'pipeljs'
import { debugNode } from 'pipeljs'

// 自定义前缀
const promise$ = $().use(debugNode('success', 'failure'))

promise$.then((value) => value + 1)

promise$.next(1)
// 输出: success 1

const rejectedPromise = Promise.reject(new Error('error'))
promise$.next(rejectedPromise)
// 输出: failure Error: error
```

### 场景 4：与操作符结合的调试输出

```typescript
import { $ } from 'pipeljs'
import { debugNode, debounce } from 'pipeljs'

const promise$ = $()
  .pipe(debounce(100))
  .use(debugNode()) // 只在防抖后输出
  .then((value) => value + 1)

promise$.next(1)
promise$.next(2)
promise$.next(3)
promise$.next(4)
promise$.next(5)
// 100ms 后输出: resolve 5
```

### 场景 5：`undefined` 值处理

```typescript
import { $ } from 'pipeljs'
import { debugNode } from 'pipeljs'

// 默认忽略 undefined 值
const stream1$ = $().use(debugNode())
stream1$.next(undefined) // 无输出
stream1$.next(null) // 输出: resolve null
stream1$.next(0) // 输出: resolve 0
stream1$.next('') // 输出: resolve ""
stream1$.next(false) // 输出: resolve false

// 不忽略 undefined 值
const stream2$ = $().use(debugNode('resolve', 'reject', false))
stream2$.next(undefined) // 输出: resolve undefined
```

### 场景 6：边界情况处理

```typescript
import { $ } from 'pipeljs'
import { debugNode } from 'pipeljs'

const stream$ = $().use(debugNode())

// 测试各种边界值
stream$.next(null) // 输出: resolve null
stream$.next(0) // 输出: resolve 0
stream$.next('') // 输出: resolve ""
stream$.next(false) // 输出: resolve false
stream$.next(undefined) // 无输出（默认忽略）

// Promise 边界情况
const resolveUndefined = Promise.resolve(undefined)
stream$.next(resolveUndefined) // 无输出（undefined 被忽略）

const rejectUndefined = Promise.reject(undefined)
stream$.next(rejectUndefined) // 无输出（undefined 被忽略）
```

### 场景 7：移除插件

```typescript
import { $ } from 'pipeljs'
import { debugNode } from 'pipeljs'

const plugin = debugNode()
const stream$ = $().use(plugin)

stream$.then((value) => value + 1)
stream$.next(1)
// 输出: resolve 1

stream$.remove(plugin)
stream$.next(2)
// 无输出
```
