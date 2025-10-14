# debugNode

调试插件，在当前节点根据条件触发调试器断点，用于精确的调试控制。

:::warning 注意
浏览器可能会过滤`node_modules`中的`debugger`语句，导致调试器断点不生效。需要手动在浏览器开发者工具->setting->ignore list 中添加开启`node_modules`的调试
:::

## 类型定义

```typescript
debugNode: (condition?: (value: any) => boolean, conditionError?: (value: any) => boolean) => {
  execute: ({ result }: { result: Promise<any> | any }) => any
}
```

## 参数说明

- `condition` (可选): 成功时的条件函数，返回 `true` 时触发调试器，返回 `false` 时不触发调试器，默认为 `undefined`（总是触发）
- `conditionError` (可选): 失败时的条件函数，返回 `true` 时触发调试器，返回 `false` 时不触发调试器，默认为 `undefined`（总是触发）

## 详情

- 只在当前节点执行，不会传播到子节点
- 支持自定义条件函数来控制调试器的触发
- 可以为成功和失败情况设置不同的条件
- 对于 `Promise` 类型的结果，会等待 `Promise` 解析后再检查条件
- 返回原始的 `result`，不会修改数据流
- 当条件函数返回 `true` 时触发调试器，返回 `false` 时不触发

## 示例

### 场景 1：基础使用（总是触发）

```typescript
import { $ } from 'pipeljs'

const promise$ = $().use(debugNode())

promise$.then((value) => value + 1).then((value) => value + 1)

promise$.next(1)
// 在浏览器开发者工具中会触发调试器断点
```

### 场景 2：条件调试（只在特定值时触发）

```typescript
import { $ } from 'pipeljs'

// 只在值大于 5 时触发调试器
const promise$ = $().use(debugNode((value) => value > 5))

promise$.then((value) => value + 1)

promise$.next(3) // 不会触发调试器（3 <= 5，条件返回 false）
promise$.next(6) // 会触发调试器（6 > 5，条件返回 true）
```

### 场景 3：错误条件调试

```typescript
import { $ } from 'pipeljs'

// 只在错误消息包含 'critical' 时触发调试器
const promise$ = $().use(debugNode(undefined, (error) => error.message.includes('critical')))

promise$.then((value) => value + 1)

const normalError = Promise.reject(new Error('normal error'))
promise$.next(normalError) // 不会触发调试器（不包含 'critical'，条件返回 false）

const criticalError = Promise.reject(new Error('critical error'))
promise$.next(criticalError) // 会触发调试器（包含 'critical'，条件返回 true）
```

### 场景 4：同时设置成功和失败条件

```typescript
import { $ } from 'pipeljs'

// 同时设置成功和失败的条件
const promise$ = $().use(
  debugNode(
    (value) => value > 10, // 成功时，值大于 10 才触发
    (error) => error.message.includes('fatal') // 失败时，错误包含 'fatal' 才触发
  )
)

promise$.then((value) => value + 1)

promise$.next(5) // 不会触发调试器（5 <= 10，条件返回 false）
promise$.next(15) // 会触发调试器（15 > 10，条件返回 true）

const fatalError = Promise.reject(new Error('fatal error'))
promise$.next(fatalError) // 会触发调试器（包含 'fatal'，条件返回 true）

const normalError = Promise.reject(new Error('normal error'))
promise$.next(normalError) // 不会触发调试器（不包含 'fatal'，条件返回 false）
```

### 场景 5：复杂条件判断

```typescript
import { $ } from 'pipeljs'

interface UserData {
  id: number
  name: string
  role: string
  active: boolean
}

// 只在管理员用户且未激活时触发调试器
const userStream$ = $<UserData>().use(debugNode((user) => user.role === 'admin' && !user.active))

userStream$.then((user) => {
  console.log('Processing user:', user.name)
  return { ...user, processed: true }
})

userStream$.next({ id: 1, name: 'John', role: 'user', active: true })
// 不触发调试器（不是管理员，条件返回 false）

userStream$.next({ id: 2, name: 'Admin', role: 'admin', active: true })
// 不触发调试器（管理员但已激活，条件返回 false）

userStream$.next({ id: 3, name: 'InactiveAdmin', role: 'admin', active: false })
// 触发调试器（管理员且未激活，条件返回 true）
```

### 场景 6：插件移除

```typescript
import { $ } from 'pipeljs'

const plugin = debugNode()
const stream$ = $().use(plugin)

let callCount = 0
stream$.then((value) => {
  callCount++
  return value
})

stream$.next(1)
// 触发调试器，callCount = 1

stream$.remove(plugin)
stream$.next(2)
// 不再触发调试器，callCount = 2
```
