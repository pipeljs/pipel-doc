# fork

从输入的 [Stream](/cn/api/stream#stream) 或 [Observable](/cn/api/observable) 中分流一条新的 [Stream](/cn/api/stream#stream) 流，新的流会订阅输入的流并发出相同的值。

![image](/fork.drawio.svg)

## 类型

```typescript
type fork: <T>(arg$: Stream<T> | Observable<T>, autoUnsubscribe?: boolean) => Stream<T>;
```

## 参数

- arg$: 输入的 [Stream](/cn/api/stream#stream) 或 [Observable](/cn/api/observable) 实例
- autoUnsubscribe: 可选参数，默认为 `true`。控制输入流取消订阅时是否自动取消分流的订阅
  - `true`: 输入流取消订阅时，分流也会自动取消订阅
  - `false`: 输入流取消订阅时，分流不会自动取消订阅

## 详情

- 分流操作创建一个新的流来订阅输入流，新的流会发出与输入流完全相同的值（包括成功值和错误值）
- 新的流也可以推送自己的值，但是不会影响输入流
- 当 autoUnsubscribe 为 `true` 时，输入流[取消订阅](/cn/guide/base#取消订阅)后，新的流也会异步取消订阅
- 当 autoUnsubscribe 为 `true` 时，输入流[结束](/cn/guide/base#结束)后，新的流也会结束

## 示例

```typescript
import { $, fork } from 'pipel'

const source$ = $('initial value')
const forked$ = fork(source$)

forked$.then((value) => {
  console.log('Forked value:', value)
})

console.log(forked$.value) // 输出: initial value

source$.next('new value')
// 输出: Forked value: new value

forked$.next('new forked value')
// 输出: Forked value: new forked value
```
