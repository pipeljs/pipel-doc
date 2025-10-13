# promiseAllNoAwait

将输入的[ stream ](/cn/api/stream#stream)或者[ Observable ](/cn/api/observable)进行组合，类似于 `Promise.all` 的行为，但在状态重置期间不等待待定的 `Promise`

![image](/promiseAllNoAwait.drawio.svg)

## 类型

```typescript
type promiseAllNoAwait: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>;
```

## 详情

- 所有输入的流都发出第一个数据后，新的流才会发出第一个数据
- 当且仅当所有的输入流都推流新数据时，新的流才会发出新数据
- 所有输入的流[ 结束 ](/cn/guide/base#结束)后，新的流也会结束
- 所有输入的流[取消订阅](/cn/guide/base.html#取消订阅)后，新的流也会取消订阅
- 如果任何输入流被拒绝，输出流将发出一个包含相应值的被拒绝的 `Promise`
- **与 `promiseAll` 的主要区别**：不等待`pending`状态的 `Promise`

## 示例

### 基本使用

```typescript
import { $, promiseAllNoAwait } from 'pipel'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const promiseAll$ = promiseAllNoAwait(stream1$, stream2$, stream3$)

promiseAll$.then((value) => console.log(value))
console.log(promiseAll$.value)
// 输出： undefined

stream1$.next(2)
stream2$.next('world')
stream3$.next(false)
// 输出：[2, "world", false]

stream1$.next(3)
stream1$.next(4)
stream3$.next(true)
stream2$.next('new')
// 输出：[4, "new", true]
```

### 与 promiseAll 的对比

```typescript
import { $, promiseAll, promiseAllNoAwait } from 'pipel'

const stream1$ = $()
const stream2$ = $()

// 标准版本
const awaitResult$ = promiseAll(stream1$, stream2$)
awaitResult$.then((values) => console.log('等待版本:', values))

// 无等待版本
const noAwaitResult$ = promiseAllNoAwait(stream1$, stream2$)
noAwaitResult$.then((values) => console.log('无等待版本:', values))

// 设置流为待定状态
stream1$.next(new Promise((resolve) => setTimeout(() => resolve('延迟1'), 100)))
stream2$.next(new Promise((resolve) => setTimeout(() => resolve('延迟2'), 50)))

// 60ms 后，stream2 的 Promise 已解决，但 stream1 仍在待定
setTimeout(() => {
  // 发送新的立即值
  stream1$.next('立即1')
  stream2$.next('立即2')

  // promiseAllNoAwait 会立即处理新值，不等待之前的待定 Promise
  // 输出: 无等待版本: ['立即1', '立即2']

  // promiseAll 会等待所有待定的 Promise 解决
  // 需要等到 100ms 后才输出
}, 60)
```
