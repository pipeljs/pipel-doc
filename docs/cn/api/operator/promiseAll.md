# promiseAll

将输入的[ stream ](/cn/api/stream#stream)或者[ Observable ](/cn/api/observable)进行组合，类似于 `Promise.all` 的行为，返回一个新的流

![image](/promiseAll.drawio.svg)

## 类型

```typescript
type promiseAll: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>;
type promiseAllNoAwait: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>;
```

## 详情

- 所有输入的流都发出第一个数据后，新的流才会发出第一个数据
- 当且仅当所有的输入流都推流新数据时，新的流才会发出新数据
- 所有输入的流[取消订阅](/cn/guide/base.html#取消订阅)后，新的流也会取消订阅
- 所有输入的流[ 结束 ](/cn/guide/base#结束)后，新的流也会结束
- 如果任何输入流被拒绝，输出流将发出一个包含相应值的被拒绝的 Promise
- 当输入流处于 `pending` 状态时，会等待`pending`状态的流后再发出新的数据

## 示例

### 基本使用

```typescript
import { $, promiseAll } from 'pipel'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const promiseAll$ = promiseAll(stream1$, stream2$, stream3$)

promiseAll$.then((value) => console.log(value))
console.log(promiseAll$.value)
// 输出： undefined

stream1$.next(2)
stream2$.next('world')
stream3$.next(false)
// 输出：[2， "world", false]

stream1$.next(3)
stream1$.next(4)
stream3$.next(true)
stream2$.next('new')
// 输出：[4， "new", true]
```

### 错误处理示例

```typescript
import { $, promiseAll } from 'pipel'

const stream1$ = $()
const stream2$ = $()

const promiseAll$ = promiseAll(stream1$, stream2$)
promiseAll$.then(
  (values) => console.log('成功:', values),
  (errors) => console.log('错误:', errors)
)

// 混合成功和失败的值
stream1$.next('success')
stream2$.next(Promise.reject('failure'))
// Promise操作是异步
await sleep(1)
// 输出: 错误: ['success', 'failure']

// 重置后的新值
stream1$.next('success2')
stream2$.next('success2')
// 输出: 成功: ['success2', 'success2']
```

### 异步等待示例

```typescript
import { $, promiseAll } from 'pipel'

const stream1$ = $()
const stream2$ = $()

const promiseAll$ = promiseAll(stream1$, stream2$)
promiseAll$.then((values) => console.log('异步结果:', values))

// 发送异步 Promise
stream1$.next(new Promise((resolve) => setTimeout(() => resolve('异步值1'), 100)))
stream2$.next('同步值')

// 100毫秒后输出: 异步结果: ['异步值1', '同步值']
```
