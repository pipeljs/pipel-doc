# audit

基于触发器的数据审计操作符，只在触发器激活时发出源流的最新已解析值。

<div style="display: flex; justify-content: center">
  <img src="/audit.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type audit = <T>(
  trigger$: Stream | Observable,
  shouldAwait?: boolean
) => (observable$: Observable<T>) => Observable<T>
```

## 参数说明

- trigger$: 触发器流，当该流发出值时，audit 操作符会发出源流的最新已解析值
- shouldAwait: 是否等待流的 `pending` 状态结束，默认为 `true`，当 trigger$ 触发时，如果源流处于 `pending` 状态，会等待解析完成后再发出

## 详情

- 只有当触发器流处于 resolve 状态并推流时，才会发出源流的当前值
- 只发出源流已解析的值，忽略被拒绝的值
- 如果源流快速发出多个值，只发出最新的已解析值
- 当 shouldAwait 为 `true` 时，如果源流处于 `pending` 状态，会等待解析完成后再发出
- 当 trigger$ 流结束的时候，audit 操作符生产出的流也会结束

## 使用场景

### 场景 1：基础触发发出

```typescript
import { $, audit } from 'pipeljs'

const source$ = $()
const trigger$ = $()

const audited$ = source$.pipe(audit(trigger$))

audited$.then((value) => {
  console.log('audited:', value)
})

// 设置源流的值，但不会立即发出
source$.next(1)
source$.next(2)
source$.next(3)

// 只有触发器激活时才发出最新值
trigger$.next('trigger') // 输出: audited: 3
```

### 场景 2：处理快速变化的数据

```typescript
import { $, audit } from 'pipeljs'

const searchInput$ = $()
const searchTrigger$ = $()

const searchResults$ = searchInput$.pipe(audit(searchTrigger$))

searchResults$.then((keyword) => {
  console.log('搜索关键词:', keyword)
})

// 用户快速输入
searchInput$.next('a')
searchInput$.next('ap')
searchInput$.next('app')
searchInput$.next('apple')

// 只在触发时发出最新的搜索词
searchTrigger$.next('search') // 输出: 搜索关键词: apple
```

### 场景 3：异步值的等待处理

```typescript
import { $, audit } from 'pipeljs'

const source$ = $()
const trigger$ = $()

// shouldAwait 为 true（默认）
const audited$ = source$.pipe(audit(trigger$, true))

audited$.then((value) => {
  console.log('audited:', value)
})

// 发送一个需要时间解析的 Promise
const slowPromise = new Promise((resolve) => {
  setTimeout(() => resolve('异步结果'), 1000)
})
source$.next(slowPromise)

// 立即触发，但会等待 Promise 解析
trigger$.next('trigger')
// 1秒后输出: audited: 异步结果
```

### 场景 4：不等待异步值

```typescript
import { $, audit } from 'pipeljs'

const source$ = $()
const trigger$ = $()

// shouldAwait 为 false
const audited$ = source$.pipe(audit(trigger$, false))

audited$.then((value) => {
  console.log('audited:', value)
})

const slowPromise = new Promise((resolve) => {
  setTimeout(() => resolve('异步结果'), 1000)
})
source$.next(slowPromise)

// 立即触发，不等待 Promise 解析
trigger$.next('trigger') // 输出: audited: undefined
```
