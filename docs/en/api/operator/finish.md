# finish

Waits for all input [Stream](/en/api/stream#stream) or [Observable](/en/api/observable) to complete, then combines their final values into an array and emits it.

![image](/finish.drawio.svg)

## Type

```typescript
type finish = <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>>
```

## Parameters

- ...args$: Multiple Stream or Observable instances

## Return Value

Returns a new Stream, which emits an array containing the final values of all input streams after all have completed.

## Details

- Only emits data when all input streams have completed
- Collects the final value (value at completion) of each input stream
- Emits data and completes immediately after emission, only emits once
- If any input stream completes with an error, the result stream will also complete with an error
- If all input streams are already completed at the start, the output stream will emit in the next microtask

## Example

```typescript
import { $, finish } from 'pipel'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const finish$ = finish(stream1$, stream2$, stream3$)
finish$.then((value) => console.log('All streams finished:', value))

console.log(finish$.value) // Output: undefined

// Intermediate values do not trigger finish
stream1$.next(2)
stream2$.next('world')
stream3$.next(false)

// Only emits when all streams are completed
stream1$.next(3, true) // Complete stream1$, final value 3
stream2$.next('final', true) // Complete stream2$, final value 'final'
stream3$.next(true, true) // Complete stream3$, final value true

// Output: All streams finished: [3, 'final', true]
```
