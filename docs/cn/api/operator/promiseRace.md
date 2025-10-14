# promiseRace

输入的[ stream ](/cn/api/stream#stream)或者[ Observable ](/cn/api/observable)进行竞争，返回一个新的流，类似于 `Promise.race` 的行为

![image](/promiseRace.drawio.svg)

## 类型

```typescript
type promiseRace: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>[number]>;
```

## 详情

- 只有第一个发出数据的流会成为"获胜者"，后续只有这个获胜流的数据会被转发到输出流
- 其他流的数据会被忽略，即使它们继续发出数据
- 获胜流[取消订阅](/cn/guide/base.html#取消订阅)后，输出流也会取消订阅
- 获胜流[ 结束 ](/cn/guide/base#结束)后，输出流也会结束
- 支持错误处理：如果获胜流发出被拒绝的 `Promise`，输出流也会发出被拒绝的 `Promise`

## 示例

### 基本使用

```typescript
import { $, promiseRace } from 'pipeljs'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(false)

const promiseRace$ = promiseRace(stream1$, stream2$, stream3$)
promiseRace$.then((value) => console.log(value))

stream2$.next('world')
// 输出: hello (初始值)
stream3$.next(true)
stream1$.next(3)
stream2$.next('code')
// 输出: code (只有 stream2 的后续数据会被转发)
```

### 竞争获胜者示例

```typescript
import { $, promiseRace } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()
const stream3$ = $()

const race$ = promiseRace(stream1$, stream2$, stream3$)
race$.then((value) => console.log('获胜者:', value))

// 第二个流首先发出数据
stream2$.next('第二个获胜')
// 输出: 获胜者: 第二个获胜

// 其他流的数据会被忽略
stream1$.next('第一个太晚了')
stream3$.next('第三个太晚了')
// 不会有输出

// 只有获胜流的后续发送会被处理
stream2$.next('第二个再次发送')
// 输出: 获胜者: 第二个再次发送
```

### 错误处理示例

```typescript
import { $, promiseRace } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()

const race$ = promiseRace(stream1$, stream2$)
race$.then(
  (value) => console.log('成功:', value),
  (error) => console.log('错误:', error)
)

// 第一个流首先发出错误
stream1$.next(Promise.reject('第一个错误'))
// 输出: 错误: 第一个错误

// 第二个流的数据会被忽略
stream2$.next('第二个值')
// 不会有输出，因为第一个流已经获胜

// 第一个流的后续错误也会被转发
stream1$.next(Promise.reject('第一个再次错误'))
// 输出: 错误: 第一个再次错误
```
