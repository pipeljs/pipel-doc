# promiseAllNoAwait

Combines the input [stream](/en/api/stream#stream) or [Observable](/en/api/observable) similar to `Promise.all`, but does not wait for `pending` Promises during reset.

![image](/promiseAllNoAwait.drawio.svg)

## Type

```typescript
type promiseAllNoAwait: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>;
```

## Details

- The new stream only emits its first value after all input streams have emitted their first value.
- Only when all input streams emit new data will the new stream emit new data.
- When all input streams [complete](/en/guide/base#complete), the new stream also completes.
- When all input streams [unsubscribe](/en/guide/base.html#unsubscribe), the new stream also unsubscribes.
- If any input stream is rejected, the output stream will emit a rejected Promise containing the corresponding value.
- Main difference from `promiseAll`: does not wait for `pending` Promises.

## Examples

### Basic usage

```typescript
import { $, promiseAllNoAwait } from 'pipeljs'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const promiseAll$ = promiseAllNoAwait(stream1$, stream2$, stream3$)

promiseAll$.then((value) => console.log(value))
console.log(promiseAll$.value)
// Output: undefined

stream1$.next(2)
stream2$.next('world')
stream3$.next(false)
// Output: [2, "world", false]

stream1$.next(3)
stream1$.next(4)
stream3$.next(true)
stream2$.next('new')
// Output: [4, "new", true]
```

### Comparison with promiseAll

```typescript
import { $, promiseAll, promiseAllNoAwait } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()

// Standard version
const awaitResult$ = promiseAll(stream1$, stream2$)
awaitResult$.then((values) => console.log('Await version:', values))

// No-await version
const noAwaitResult$ = promiseAllNoAwait(stream1$, stream2$)
noAwaitResult$.then((values) => console.log('No-await version:', values))

// Set stream to pending state
stream1$.next(new Promise((resolve) => setTimeout(() => resolve('delay1'), 100)))
stream2$.next(new Promise((resolve) => setTimeout(() => resolve('delay2'), 50)))

// After 60ms, stream2's Promise is resolved, but stream1 is still pending
setTimeout(() => {
  // Send new immediate values
  stream1$.next('immediate1')
  stream2$.next('immediate2')

  // promiseAllNoAwait will process new values immediately, not waiting for previous pending Promises
  // Output: No-await version: ['immediate1', 'immediate2']

  // promiseAll will wait for all pending Promises to resolve
  // Needs to wait until 100ms to output
}, 60)
```

### Error Handling Example

```typescript
import { $, promiseAllNoAwait } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()

const promiseAll$ = promiseAllNoAwait(stream1$, stream2$)
promiseAll$.then(
  (values) => console.log('success:', values),
  (errors) => console.log('error:', errors)
)

// Mix success and failure values
stream1$.next('success')
stream2$.next(Promise.reject('failure'))
// Promise operations are async
await sleep(1)
// prints: error: ['success', 'failure']

// New values after reset
stream1$.next('success2')
stream2$.next('success2')
// prints: success: ['success2', 'success2']
```

### High Performance Scenario Example

```typescript
import { $, promiseAllNoAwait } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()
const stream3$ = $()

const result$ = promiseAllNoAwait(stream1$, stream2$, stream3$)
result$.then((values) => console.log('high-performance processing:', values))

// Simulate high-frequency data streams
let counter = 0
const interval = setInterval(() => {
  // Mix sync and async data
  stream1$.next(`sync-${counter}`)
  stream2$.next(
    new Promise((resolve) => setTimeout(() => resolve(`async-${counter}`), Math.random() * 100))
  )
  stream3$.next(`immediate-${counter}`)

  counter++
  if (counter >= 5) {
    clearInterval(interval)
  }
}, 20)

// promiseAllNoAwait will process new data faster, not blocked by slow async operations
```

### Status Reset Behavior Comparison

```typescript
import { $, promiseAll, promiseAllNoAwait } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()

const await$ = promiseAll(stream1$, stream2$)
const noAwait$ = promiseAllNoAwait(stream1$, stream2$)

await$.then((values) => console.log('await version:', values))
noAwait$.then((values) => console.log('no-await version:', values))

// First: send slow async Promise
stream1$.next(new Promise((resolve) => setTimeout(() => resolve('slow1'), 200)))
stream2$.next('fast1')

// After 50ms: send new data
setTimeout(() => {
  stream1$.next('new-fast1')
  stream2$.next('new-fast2')

  // noAwait version will immediately emit new data
  // await version will wait for the first slow Promise to complete
}, 50)

// Results:
// no-await version: ['new-fast1', 'new-fast2'] (at 50ms)
// await version: ['new-fast1', 'new-fast2'] (at 200ms)
```

### Real-world Application Scenario

```typescript
import { $, promiseAllNoAwait } from 'pipeljs'

// Real-time data monitoring scenario
const cpuUsage$ = $() // CPU usage
const memoryUsage$ = $() // Memory usage
const networkSpeed$ = $() // Network speed

const systemStats$ = promiseAllNoAwait(cpuUsage$, memoryUsage$, networkSpeed$)
systemStats$.then(([cpu, memory, network]) => {
  console.log(`System Status - CPU: ${cpu}%, Memory: ${memory}%, Network: ${network}Mbps`)
})

// Simulate different frequency data updates
setInterval(() => cpuUsage$.next(Math.random() * 100), 100) // every 100ms
setInterval(() => memoryUsage$.next(Math.random() * 100), 150) // every 150ms
setInterval(() => networkSpeed$.next(Math.random() * 1000), 200) // every 200ms

// promiseAllNoAwait ensures that even if some data sources have delays,
// it won't block the overall update frequency
```

## Usage Guidelines

### When to Use promiseAllNoAwait

- **High-frequency data streams**: When you need to handle high-frequency data updates
- **Performance-sensitive applications**: When response speed is more important than data consistency
- **Real-time monitoring systems**: When you need the latest data state, even if some data sources have delays
- **Frequent async operations**: When input streams frequently contain async Promises

### When to Use Standard promiseAll

- **Data consistency is important**: When you need to ensure all data is from the same time point
- **Batch processing scenarios**: When you need to wait for all async operations to complete before processing
- **State synchronization requirements**: When you need strict state synchronization
