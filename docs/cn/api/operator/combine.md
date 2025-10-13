# combine

将输入的[ stream ](/cn/api/stream#stream)或者[ observable ](/cn/api/observable)进行结合，返回一个新的流

![image](/combine.drawio.svg)

## 类型

```typescript
type combine: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>;
```

## 参数

- args$: 多个 [Stream](/cn/api/stream#stream) 或 [Observable](/cn/api/observable) 实例

## 详情

- 所有输入的流都发出第一个数据后，新的流才会发出第一个数据
- 任一输入流发出新数据时，新的流会发出包含所有流最新值的数组
- 如果任一输入流发出错误值，新的流会发出包含错误值的拒绝状态数组
- 所有输入的流[取消订阅](/cn/guide/base.html#取消订阅)后，新的流也会取消订阅
- 所有输入的流[ 结束 ](/cn/guide/base#结束)后，新的流也会结束
- 如果一开始所有输入流都是结束状态，那么输出流将[结束](/cn/guide/base#结束)

## 示例

```typescript
import { $, combine } from 'pipel'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const combined$ = combine(stream1$, stream2$, stream3$)
combined$.then((value) => console.log(value))
console.log(combined$.value)
// 输出： undefined

stream1$.next(2)
stream2$.next('world')
stream3$.next(false)
// 输出：[2， "world", false]

stream1$.next(3)
// 输出：[3， "world", false]

stream3$.next(true)
// 输出：[3， "world", true]
```

```typescript
import { $, combine } from 'pipel'

const stream1$ = $()
const stream2$ = $()
const stream3$ = $()

const combined$ = combine(stream1$, stream2$, stream3$)
combined$.then(
  (value) => console.log('resolve', value),
  (value) => console.log('reject', value)
)

// 模拟API调用
stream1$.next(Promise.resolve('数据1'))
stream2$.next(Promise.reject('错误'))
stream3$.next(Promise.resolve('数据3'))
// 输出：reject ["数据1", "错误", "数据3"]
```
