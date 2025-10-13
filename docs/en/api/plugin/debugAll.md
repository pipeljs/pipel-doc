# debugAll

debugAll 是一个在流链的所有节点上输出执行结果的调试插件，用于调试和监控数据流，只能在 `Stream` 节点上使用。

## 类型定义

```typescript
debugAll: (resolvePrefix?: string, rejectPrefix?: string, ignoreUndefined?: boolean) => {
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

- `resolvePrefix` (可选): 成功时的控制台前缀，默认为 `'resolve'`
- `rejectPrefix` (可选): 失败时的控制台前缀，默认为 `'reject'`
- `ignoreUndefined` (可选): 是否忽略 `undefined` 值的输出，默认为 `true`

## 详细说明

- 在流链的所有节点上执行，而不是单个节点
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
import { $ } from 'pipel'
import { debugAll } from 'pipel'

const stream$ = $().use(debugAll())

stream$.next(1)
// 输出: resolve 1

const promise = Promise.resolve(2)
stream$.next(promise)
// 输出: resolve 2
```

### 场景 2：流链调试输出

```typescript
import { $ } from 'pipel'
import { debugAll } from 'pipel'

const promise$ = $().use(debugAll())

promise$.then((value) => value + 1).then((value) => value + 1)

promise$.next(1)
// 输出:
// resolve 1
// resolve 2
// resolve 3
```

### 场景 3：自定义前缀调试输出

```typescript
import { $ } from 'pipel'
import { debugAll } from 'pipel'

// 自定义前缀
const promise$ = $().use(debugAll('success', 'failure'))

promise$.then((value) => value + 1)

promise$.next(1)
// 输出:
// success 1
// success 2

const rejectedPromise = Promise.reject(new Error('error'))
promise$.next(rejectedPromise)
// 输出: failure Error: error
```

### 场景 4：与操作符结合的调试输出

```typescript
import { $ } from 'pipel'
import { debugAll, debounce } from 'pipel'

const promise$ = $()
  .use(debugAll())
  .pipe(debounce(100))
  .then((value) => value + 1)

promise$.next(1)
promise$.next(2)
promise$.next(3)
promise$.next(4)
promise$.next(5)
// 输出:
// resolve 1
// resolve 2
// resolve 3
// resolve 4
// resolve 5
// 100ms 后: resolve 6
```

### 场景 5：`undefined` 值处理

```typescript
import { $ } from 'pipel'
import { debugAll } from 'pipel'

// 默认忽略 undefined 值
const stream1$ = $().use(debugAll())
stream1$.next(undefined) // 无输出
stream1$.next(null) // 输出: resolve null
stream1$.next(0) // 输出: resolve 0
stream1$.next('') // 输出: resolve ""
stream1$.next(false) // 输出: resolve false

// 不忽略 undefined 值
const stream2$ = $().use(debugAll('resolve', 'reject', false))
stream2$.next(undefined) // 输出: resolve undefined
```

### 场景 6：边界情况处理

```typescript
import { $ } from 'pipel'
import { debugAll } from 'pipel'

const stream$ = $().use(debugAll())

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
import { $ } from 'pipel'
import { debugAll } from 'pipel'

const plugin = debugAll()
const stream$ = $().use(plugin)

stream$.then((value) => value + 1)
stream$.next(1)
// 输出: resolve 1, resolve 2

stream$.remove(plugin)
stream$.next(2)
// 无输出
```
