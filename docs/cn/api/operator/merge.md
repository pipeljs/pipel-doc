# merge

将输入的[ stream ](/cn/api/stream#stream)或者[ Observable ](/cn/api/observable)进行合并，返回一个新的流

![image](/merge.drawio.svg)

## 类型

```typescript
type merge: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>[number]>;
```

## 详情

- 流的合并操作指的是按照时间顺序，只要有流推送数据，都会被推送到新的流
- 当所有输入的流[取消订阅](/cn/guide/base.html#取消订阅)后，新的流也会取消订阅
- 所有输入的流[ 结束 ](/cn/guide/base#结束)后，新的流也会结束
- 如果没有输入参数，将创建一个空流但不会发出任何数据

## 示例

```typescript
import { $, merge } from 'pipeljs'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const merged$ = merge(stream1$, stream2$, stream3$)

merged$.then((value) => console.log(value))
console.log(merged$.value)
// 输出： undefined

stream1$.next(2)
// 输出： 2
stream2$.next('world')
// 输出： world
stream3$.next(false)
// 输出： false
stream1$.next(3)
// 输出： 3
```
