# combine

Combines the input [stream](/en/api/stream#stream) or [observable](/en/api/observable) and returns a new stream.

![image](/combine.drawio.svg)

## Type

```typescript
type combine: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>;
```

## Parameters

- ...args$: Multiple [Stream](/en/api/stream#stream) or [Observable](/en/api/observable) instances

## Details

- The new stream only emits its first value after all input streams have emitted their first value.
- Whenever any input stream emits a new value, the new stream emits an array containing the latest values of all streams.
- If any input stream emits a rejected value, the new stream emits an array in a rejected state containing the error value.
- When all input streams [unsubscribe](/en/guide/base.html#unsubscribe), the new stream also unsubscribes.
- When all input streams [complete](/en/guide/base#complete), the new stream also completes.
- If all input streams are in a completed state at the beginning, the output stream will [complete](/en/guide/base#complete).

## Examples

```typescript
import { $, combine } from 'pipeljs'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const combined$ = combine(stream1$, stream2$, stream3$)
combined$.then((value) => console.log(value))
console.log(combined$.value)
// Output: undefined

stream1$.next(2)
stream2$.next('world')
stream3$.next(false)
// Output: [2, "world", false]

stream1$.next(3)
// Output: [3, "world", false]

stream3$.next(true)
// Output: [3, "world", true]
```

```typescript
import { $, combine } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()
const stream3$ = $()

const combined$ = combine(stream1$, stream2$, stream3$)
combined$.then(
  (value) => console.log('resolve', value),
  (value) => console.log('reject', value)
)

// Simulate API calls
stream1$.next(Promise.resolve('data1'))
stream2$.next(Promise.reject('error'))
stream3$.next(Promise.resolve('data3'))
// Output: reject ["data1", "error", "data3"]
```
