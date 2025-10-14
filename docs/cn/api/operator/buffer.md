# buffer

缓冲操作符，将源流的数据收集到缓冲区中，当触发器流发出值时一次性输出所有缓冲的数据。

<div style="display: flex; justify-content: center">
  <img src="/buffer.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type buffer = <T>(
  trigger$: Stream | Observable,
  shouldAwait?: boolean
) => (observable$: Observable<T>) => Observable<T[]>
```

## 参数说明

- trigger$: 触发器流，当该流发出值时，buffer 操作符会发出所有缓冲的数据
- shouldAwait: 是否等待流的 `pending` 状态结束，默认为 `true`，当 trigger$ 触发时，如果源流处于 `pending` 状态，会等待解析完成后再发出

## 详情

- 持续收集源流发出的已解析值到内部缓冲区，忽略被拒绝的值
- 只有当触发器流处于 `resolve` 状态并推流时，才会推流缓冲区中的所有数据
- 每次发出数据后会清空缓冲区，准备收集下一批数据
- 当 shouldAwait 为 `true` 时，如果源流处于 pending 状态，会等待解析完成后再发出

## 使用场景

### 场景 1：基础数据缓冲

```typescript
import { $, buffer } from 'pipeljs'

const source$ = $()
const trigger$ = $()

const buffered$ = source$.pipe(buffer(trigger$))

buffered$.then((values) => {
  console.log('缓冲的数据:', values)
})

// 推送数据到源流，但不会立即发出
source$.next(1)
source$.next(2)
source$.next(3)

// 只有触发器激活时才发出缓冲的数据
trigger$.next('trigger') // 输出: 缓冲的数据: [1, 2, 3]

// 继续推送数据
source$.next(4)
source$.next(5)

// 再次触发输出
trigger$.next('trigger') // 输出: 缓冲的数据: [4, 5]
```

### 场景 2：空缓冲区处理

```typescript
import { $, buffer } from 'pipeljs'

const source$ = $()
const trigger$ = $()

const buffered$ = source$.pipe(buffer(trigger$))

buffered$.then((values) => {
  console.log('缓冲的数据:', values)
})

// 在没有数据时触发
trigger$.next('trigger') // 输出: 缓冲的数据: []
```

### 场景 3：批量数据处理

```typescript
import { $, buffer } from 'pipeljs'

const dataStream$ = $()
const batchTrigger$ = $()

const batchedData$ = dataStream$.pipe(buffer(batchTrigger$))

batchedData$.then((batch) => {
  console.log(`处理 ${batch.length} 条数据:`, batch)
  // 批量处理数据
})

// 快速产生数据
for (let i = 1; i <= 100; i++) {
  dataStream$.next(i)
}

// 批量处理
batchTrigger$.next('process') // 输出: 处理 100 条数据: [1, 2, 3, ..., 100]
```

### 场景 4：异步值的等待处理

```typescript
import { $, buffer } from 'pipeljs'

const source$ = $()
const trigger$ = $()

// shouldAwait 为 true（默认）
const buffered$ = source$.pipe(buffer(trigger$, true))

buffered$.then((values) => {
  console.log('缓冲的数据:', values)
})

// 发送立即值和异步值
source$.next(1)
source$.next(2)

const slowPromise = new Promise((resolve) => {
  setTimeout(() => resolve('异步结果'), 1000)
})
source$.next(slowPromise)

// 立即触发，但会等待异步值解析
trigger$.next('trigger')
// 1秒后输出: 缓冲的数据: [1, 2, '异步结果']
```

### 场景 5：不等待异步值

```typescript
import { $, buffer } from 'pipeljs'

const source$ = $()
const trigger$ = $()

// shouldAwait 为 false
const buffered$ = source$.pipe(buffer(trigger$, false))

buffered$.then((values) => {
  console.log('缓冲的数据:', values)
})

source$.next(1)
source$.next(2)

const slowPromise = new Promise((resolve) => {
  setTimeout(() => resolve('异步结果'), 1000)
})
source$.next(slowPromise)

// 立即触发，不等待异步值解析
trigger$.next('trigger') // 输出: 缓冲的数据: [1, 2, Promise] 或 [1, 2]
```
