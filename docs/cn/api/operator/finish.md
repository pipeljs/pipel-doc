# finish

等待所有输入的 [Stream](/cn/api/stream#stream) 或 [Observable](/cn/api/observable) 结束后，将它们的最终值组合成数组并发出。

![image](/finish.drawio.svg)

## 类型

```typescript
type finish = <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>
```

## 参数说明

- args$: 多个 Stream 或 Observable 实例

## 返回值

返回一个新的 Stream，该流会在所有输入流都结束后发出包含所有最终值的数组。

## 详情

- 只有当所有输入流都结束时，才会发出数据
- 收集每个输入流的最终值（结束时的值）
- 发出数据后立即结束，只发出一次数据
- 如果任一输入流以错误状态结束，结果流也会以错误状态结束
- 如果一开始所有输入流都是结束状态，那么输出流将在下次微任务中推流

## 示例

```typescript
import { $, finish } from 'pipel'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const finish$ = finish(stream1$, stream2$, stream3$)
finish$.then((value) => console.log('所有流完成:', value))

console.log(finish$.value) // 输出: undefined

// 流的中间值不会触发 finish
stream1$.next(2)
stream2$.next('world')
stream3$.next(false)

// 只有当所有流都结束时才会发出数据
stream1$.next(3, true) // 结束 stream1$，最终值为 3
stream2$.next('final', true) // 结束 stream2$，最终值为 'final'
stream3$.next(true, true) // 结束 stream3$，最终值为 true

// 输出: 所有流完成: [3, 'final', true]
```
