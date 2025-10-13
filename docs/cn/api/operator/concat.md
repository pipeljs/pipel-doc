# concat

将输入的[ stream ](/cn/api/stream#stream)或者[ observable ](/cn/api/observable)按照顺序结合，返回一个新的流

![image](/concat.drawio.svg)

## 类型

```typescript
type concat: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>[number]>;
```

## 参数

- args$: 多个 [Stream](/cn/api/stream#stream) 或 [Observable](/cn/api/observable) 实例

## 详情

- 当前输入的流[结束](/cn/guide/base#结束)后，下一个输入的流推送的数据才会推送到新的流
- 当所有输入的流[取消订阅](/cn/guide/base.html#取消订阅)后，新的流也会取消订阅
- 同一时间只有一个输入流的数据会被发出，其他流的数据会被忽略直到轮到它们
- 所有输入的流[结束](/cn/guide/base#结束)后，新的流也会结束
- 如果没有输入参数，将创建一个空流但不会发出任何数据

## 示例

```typescript
import { $, concat } from 'pipel'

const stream1$ = $()
const stream2$ = $()
const stream3$ = $()

const concat$ = concat(stream1$, stream2$, stream3$)
concat$.then((value) => console.log('输出:', value))

// 第一个流发出数据
stream1$.next('a')
// 输出: a

stream1$.next('b')
// 输出: b

// 第二个流发出数据，但不会被输出（第一个流未完成）
stream2$.next('c') // 这个数据会被忽略

// 第一个流完成
stream1$.next('final1', true)
// 输出: final1

// 现在第二个流可以发出数据了
stream2$.next('d', true)
// 输出: d

// 第三个流开始发出数据
stream3$.next('e', true)
// 输出: e
```
