# Boundary Explanation

pipel implements a promise-like experience from the ground up, but while promise pushes data only once, pipel streams can push data multiple times, making pipel's boundary scenarios far more complex than promise. Below are explanations of some boundary scenarios:

## Synchrony and Asynchrony

pipel streams are synchronous, while promise is asynchronous.

```typescript
import { $ } from 'pipel'
const promise$ = $()

promise$.then((value) => {
  console.log(value)
})

promise$.next(1)
promise$.next(2)
promise$.next(3)
console.log('start')

// Output
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

// Output
// start
// 1
```

Only when pipel pushes asynchronous data does the stream become asynchronous:

```typescript
import { $ } from 'pipel'
const promise$ = $()

promise$.then((value) => {
  console.log(value)
})

promise$.next(Promise.resolve(1))
promise$.next(Promise.resolve(2))
promise$.next(Promise.resolve(3))
console.log('start')

// Output
// start
// 1
// 2
// 3
```

Design rationale: pipel's main use case is reactive programming in frontend logic. If every data processing node were asynchronous, it would trigger frequent page re-renders.

## Race Conditions with Async

Because pipel supports chained subscriptions and subscription nodes may be asynchronous, the return time of asynchronous nodes is uncertain.

When an asynchronous node has not finished executing and the stream pushes new data, the data returned by the original asynchronous node will neither be set as the node's value nor passed to downstream nodes. Instead, the new data will be used to restart the asynchronous operation.

As shown in the diagram, when the stream pushes new data, the data returned by the original asynchronous node is directly discarded, and the new data is used to restart the asynchronous operation:

<div style="display: flex; justify-content: center">
  <img src="/raceCase.drawio.svg" alt="image" >
</div>

## Error Handling

If a node throws an error during execution, this error will be passed to the next subscription node that defines an onRejected handler, consistent with promise error handling.

For intermediate nodes that don't define onRejected handling, pipel will skip them directly but set the subscription node's status to `rejected`.

<div style="display: flex; justify-content: center">
  <img src="/errorCase.drawio.svg" alt="image" >
</div>

## Unsubscribe

- When a node is [unsubscribed](/en/guide/base.html#unsubscribe) while it is in pending state, downstream nodes will not be triggered after the node completes execution.
- When a node is [unsubscribed](/en/guide/base.html#unsubscribe), all of its child nodes are also unsubscribed. If child nodes are in pending state at that time, after the child nodes complete execution:
  - Downstream nodes of the child nodes will not be triggered
  - When all child nodes finish their pending state, the parent node will be cleaned up to prevent memory leaks.
