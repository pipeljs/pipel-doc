# debugAll

调试插件，在流链的所有节点上触发调试器断点，用于深度调试和流程跟踪，只能在 `Stream` 节点上使用。

:::warning 注意
浏览器可能会过滤 `node_modules` 中的 `debugger` 语句，导致调试器断点不生效。需要手动在浏览器开发者工具->setting->ignore list 中添加开启 `node_modules` 的调试
:::

## 类型定义

```typescript
debugAll: (condition?: (value: any) => boolean, conditionError?: (value: any) => boolean) => {
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

## 参数说明

- `condition` (可选): 控制成功值调试的条件函数，返回 `true` 时触发调试器
- `conditionError` (可选): 控制错误值调试的条件函数，返回 `true` 时触发调试器

## 详情

- 在流链的所有节点上执行，而不仅仅是单个节点
- 只在以下情况触发调试器：
  - 根节点（`root=true`）
  - 有成功处理函数（`onfulfilled`）的节点
  - 有错误处理函数（`onrejected`）且状态为 `REJECTED` 的节点
- 对于 `Promise` 类型的结果，会等待 `Promise` 解析后再触发调试器
- 支持通过 `condition` 和 `conditionError` 函数精确控制调试时机
- 返回原始的 `result`，不会修改数据流

## 示例

### 场景 1：基础调试

```typescript
import { $ } from 'pipeljs'
import { debugAll } from 'pipeljs'

const stream$ = $().use(debugAll())

stream$.then((value) => value + 1)

stream$.next(1)
// 在浏览器开发者工具中会在每个节点触发调试器断点

const promise = Promise.resolve(2)
stream$.next(promise)
// 等待 Promise 解析后触发调试器
```

### 场景 2：流链调试

```typescript
import { $ } from 'pipeljs'
import { debugAll } from 'pipeljs'

const promise$ = $().use(debugAll())

promise$.then((value) => value + 1).then((value) => value + 1)

promise$.next(1)
// 会在每个节点触发调试器断点，方便逐步跟踪数据流转：
// 1. 根节点：1
// 2. 第一个 then 节点：2
// 3. 第二个 then 节点：3
```

### 场景 3：条件调试

```typescript
import { $ } from 'pipeljs'
import { debugAll } from 'pipeljs'

// 只对字符串类型触发调试器
const conditionFn = (value) => typeof value === 'string'
const stream$ = $().use(debugAll(conditionFn))

stream$.then((value) => value.toString())

stream$.next('hello') // 触发调试器
stream$.next(42) // 不触发调试器（但仍会处理数据）
```

### 场景 4：移除插件

```typescript
import { $ } from 'pipeljs'
import { debugAll } from 'pipeljs'

const plugin = debugAll()
const stream$ = $().use(plugin)

stream$.then((value) => value + 1)
stream$.next(1)
// 触发调试器

stream$.remove(plugin)
stream$.next(2)
// 不再触发调试器
```
