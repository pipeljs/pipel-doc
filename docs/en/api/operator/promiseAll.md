# promiseAll

Combines the input [stream](/en/api/stream#stream) or [Observable](/en/api/observable) similar to `Promise.all`, and returns a new stream.

![image](/promiseAll.drawio.svg)

## Type

```typescript
type promiseAll: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>;
type promiseAllNoAwait: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>;
```

## Details

- The new stream only emits its first value after all input streams have emitted their first value.
- Only when all input streams emit new data will the new stream emit new data.
- When all input streams [unsubscribe](/en/guide/base.html#unsubscribe), the new stream also unsubscribes.
- When all input streams [complete](/en/guide/base#complete), the new stream also completes.
- If any input stream is rejected, the output stream will emit a rejected Promise containing the corresponding value.
- When an input stream is in `pending` state, it waits for the `pending` stream to resolve before emitting new data.

## Examples

### Basic usage

```typescript
import { $, promiseAll } from 'pipel'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const promiseAll$ = promiseAll(stream1$, stream2$, stream3$)

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

### Error handling example

```typescript
import { $, promiseAll } from 'pipel'

const stream1$ = $()
const stream2$ = $()

const promiseAll$ = promiseAll(stream1$, stream2$)
promiseAll$.then(
  (values) => console.log('Success:', values),
  (errors) => console.log('Error:', errors)
)

// Mix of success and failure values
stream1$.next('success')
stream2$.next(Promise.reject('failure'))
await sleep(1)
// Output: Error: ['success', 'failure']

// New values after reset
stream1$.next('success2')
stream2$.next('success2')
// Output: Success: ['success2', 'success2']
```

### Async await example

```typescript
import { $, promiseAll } from 'pipel'

const stream1$ = $()
const stream2$ = $()

const promiseAll$ = promiseAll(stream1$, stream2$)
promiseAll$.then((values) => console.log('Async result:', values))

// Send async Promise
stream1$.next(new Promise((resolve) => setTimeout(() => resolve('async1'), 100)))
stream2$.next('sync')

// After 100ms: Output: Async result: ['async1', 'sync']
```
