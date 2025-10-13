# 基础概念

## 流

在 pipel 中一共有两种流，分别是[Stream](/cn/api/stream)流和[Observable](/cn/api/observable)流，所谓的流就是一个可以被订阅的数据源，对 Stream 流进行订阅后的[订阅节点](#订阅节点)就是 Observable 流。

Stream 和 Observable 的主要区别在于 Stream 流可以主动推流，而 Observable 流只能被动的推流或者重复上一次推流。

```typescript
import { $ } from 'pipel'

const promise$ = $()

const observable$ = promise$.then(xxx)

const observable1$ = observable$.then(xxx)

promise$.next(xxx) // 推送数据
```

## 推流

推流就是推送新的数据源给到订阅节点，推流分为主动推流和被动推流；主动推流指节点可以主动推送数据，被动推流指节点只能被动的接收数据处理后再将处理后的数据推流给订阅节点。

- [Stream](/cn/api/stream)可以使用 next 方法进行主动推流，所有订阅节点都能收到推送的数据

```typescript
import { Stream } from 'pipel'

const promise$ = new Stream()

promise$.then((data) => console.log(data))

promise$.next('hello') // 输出 hello
```

- 也可以使用 set 方法也可以进行数据的推送，和 next 方法的区别在于 set 方法推送的是基于上次数据的 immutable 数据。

```typescript
import { $ } from 'pipel'
const promise$ = $({ a: 1, b: { c: 2 } })
const oldValue = promise$.value

promise$.set((state) => (state.a = 3))
const newValue = promise$.value

console.log(oldValue === newValue) // false
console.log(oldValue.b === newValue.b) // true
```

## 执行

调用订阅节点的[observable](/cn/api/observable)的[execute](/cn/api/observable#execute)方法重新执行上一次订阅的数据流，并推流至其所有子订阅节点。

## 订阅节点

pipel 采用 promise 的形式进行数据流的推送，通过[then](/cn/api/observable#then)、[thenOnce](/cn/api/observable#thenonce)、[thenImmediate](/cn/api/observable#thenimmediate)等方法对流新增一个订阅节点，返回订阅节点[observable](/cn/api/observable)实例，整体使用和 promise 保持一致。

## 链式订阅

调用订阅节点的[observable](/cn/api/observable)的[then](/cn/api/observable#then)等方法进行链式订阅，类似 promise 的 then 链式方法。

## 部分订阅

调用[get](/cn/api/operator/get)指令进行部分订阅，只订阅 get 获取的那部分数据的变化。

## 条件订阅

只有节点满足条件才会进行推流，[change](/cn/api/operator/change)、[filter](/cn/api/operator/filter)指令可以进行条件订阅，只有满足条件节点才会进行推流，两者的区别在于：

- change 方法传入的是一个 getter 函数，分别传入上一次数据和当前数据并对返回值进行对比，如果有变化才会进行推流。
- filter 方法传入的是一个 condition 函数，传入的是当前数据，如果返回 true 才会进行推流。

## 取消订阅

调用订阅节点的[unsubscribe](/cn/api/observable#unsubscribe)方法取消订阅。

- 节点取消订阅会触发所有子节点取消订阅。
- 节点取消订阅会先触发节点的[afterComplete](/cn/api/observable#aftercomplete)回调，然后触发节点的[afterUnsubscribe](/cn/api/observable#afterunsubscribe)回调。

## 结束

只有[Stream](/cn/api/stream)流才可以结束，当流结束后：

- 流不再推送数据。
- 流不再接收新的订阅节点。
- 取消订阅所有下游订阅节点。

有两种方法可以结束流：

```typescript
import { Stream } from 'pipel'

const promise$ = new Stream()

// 结束流方法1：next方法传入true表示结束，最后一次推流
promise$.next(1, true)

// 结束流方法2：调用complete方法结束流
promise$.complete() // 结束流
```

当流节点结束流后，每个订阅节点在执行完最后一次数据推送后都会触发[afterComplete](/cn/api/observable#aftercomplete)回调，然后自动取消订阅所有的订阅者，触发所有子节点的[afterUnsubscribe](/cn/api/observable#afterunsubscribe)。
