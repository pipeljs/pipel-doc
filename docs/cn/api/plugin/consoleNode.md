# consoleNode

调试插件，在当前节点输出执行结果，用于单个节点的调试和监控。

## 类型定义

```typescript
consoleNode: (resolvePrefix?: string, rejectPrefix?: string) => {
  execute: ({ result }: { result: Promise<any> | any }) => any
}
```

## 参数说明

- `resolvePrefix` (可选): 成功时的控制台前缀，默认为 `'resolve'`
- `rejectPrefix` (可选): 失败时的控制台前缀，默认为 `'reject'`

## 详情

- 只在当前节点执行，不会传播到子节点
- 无论是否有处理函数，都会立即输出结果
- 对于 `Promise` 类型的结果，会等待 `Promise` 解析后再输出
- 返回原始的 `result`，不会修改数据流

## 示例

### 场景 1：基础调试输出

```typescript
import { $ } from 'pipeljs'

const stream$ = $().use(consoleNode())

stream$.next(1)
// 输出: resolve 1

const promise = Promise.resolve(2)
stream$.next(promise)
// 输出: resolve 2

stream$.next(3)
stream$.next(4)
// 输出: resolve 3
// 输出: resolve 4
```

### 场景 2：自定义前缀

```typescript
import { $ } from 'pipeljs'

const stream$ = $().use(consoleNode('custom'))

stream$.next('test')
// 输出: custom test

const promise = Promise.resolve('async-test')
stream$.next(promise)
// 输出: custom async-test
```

### 场景 3：自定义成功和失败前缀

```typescript
import { $ } from 'pipeljs'

const stream$ = $().use(consoleNode('success', 'failure'))

// 测试成功情况
stream$.next('test-value')
// 输出: success test-value

// 测试失败情况
const rejectedPromise = Promise.reject(new Error('custom error'))
stream$.next(rejectedPromise)
// 输出: failure Error: custom error
```

### 场景 4：与防抖操作符结合

```typescript
import { $, debounce } from 'pipeljs'

const promise$ = $()
  .pipe(debounce(100))
  .use(consoleNode())
  .then((value) => console.log(value))

promise$.next(1)
promise$.next(2)
promise$.next(3)
promise$.next(4)
promise$.next(5)

// 立即输出（每次 next 都会触发 consoleNode）:
// resolve 1
// resolve 2
// resolve 3
// resolve 4
// resolve 5

// 等待 100ms 后输出（防抖后的结果）:
// resolve 5
// 5
```

### 场景 5：插件移除

```typescript
import { $ } from 'pipeljs'

const plugin = consoleNode()
const stream$ = $().use(plugin)

stream$.next(1)
// 输出: resolve 1

stream$.remove(plugin)
stream$.next(2)
// 不再输出
```
