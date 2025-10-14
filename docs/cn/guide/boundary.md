# 边界说明

pipel 从底层实现了类似 Promise 的使用体验，但是 promise 是推送数据一次性的而 pipel 的流是可以多次推送数据，所以 pipel 的边界场景远比 promise 复杂，下面是一些边界场景的说明：

## 同步和异步

pipel 的流是同步的，而 promise 是异步的

```typescript
import { $ } from 'pipeljs'
const promise$ = $()

promise$.then((value) => {
  console.log(value)
})

promise$.next(1)
promise$.next(2)
promise$.next(3)
console.log('start')

// 输出
// 1
// 2
// 3
// start
```

```typescript
Promise.resolve(1).then((value) => {
  console.log(value)
})

console.log('start')

// 输出
// start
// 1
```

仅当 pipel 推送异步数据时，流才会变成异步的

```typescript
import { $ } from 'pipeljs'
const promise$ = $()

promise$.then((value) => {
  console.log(value)
})

promise$.next(Promise.resolve(1))
promise$.next(Promise.resolve(2))
promise$.next(Promise.resolve(3))
console.log('start')

// 输出
// start
// 1
// 2
// 3
```

这样设计的原因是：当前 pipel 的主要使用场景是前端逻辑的响应式编程，如果数据处理的每个节点都是异步的，会触发页面频繁的渲染。

## 竞态异步

因为 pipel 可以链式的进行订阅，而订阅的节点可能是异步节点，异步节点返回的时间是不确定的。

当异步节点还没有执行完成时，此时如果流推送了新的数据，那么原来异步节点返回的数据既不会设置为节点的值，也不会传递给下游节点，而是采用新的数据重新继续异步操作

如图所示，当流推送了新的数据时，原来异步节点返回的数据会直接丢弃，而采用新的数据重新继续异步操作:

<div style="display: flex; justify-content: center">
  <img src="/raceCase.drawio.svg" alt="image" >
</div>

## 错误处理

如果节点执行过程中抛出了错误，这个错误会传递给后面定义了 onRejected 处理的订阅节点进行处理，和 promise 的错误处理方式一致。

pipel 对于中间没有定义 onRejected 处理的订阅节点，会直接跳过但是会将订阅节点的 status 状态设置为 `rejected`。

<div style="display: flex; justify-content: center">
  <img src="/errorCase.drawio.svg" alt="image" >
</div>

## 取消订阅

- 节点[取消订阅](/cn/guide/base.html#取消订阅)，当节点处于 pending 状态时，当节点执行完成后，不会触发下游节点的执行。
- 节点[取消订阅](/cn/guide/base.html#取消订阅)，其所有的子节点也会取消订阅，此时如果其子节点处于 pending 状态时,当子节点执行完成后。
  - 不会触发子节点下游节点的执行
  - 当所有子节点 pending 状态都结束时，会清理父节点防止内存泄漏。
