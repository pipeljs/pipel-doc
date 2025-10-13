# concat

Concatenates the input [stream](/en/api/stream#stream) or [observable](/en/api/observable) in sequence and returns a new stream.

![image](/concat.drawio.svg)

## Type

```typescript
type concat: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>[number]>;
```

## Parameters

- ...args$: Multiple [Stream](/en/api/stream#stream) or [Observable](/en/api/observable) instances

## Details

- Only after the current input stream [completes](/en/guide/base#complete) will the next input stream's data be emitted to the new stream.
- When all input streams [unsubscribe](/en/guide/base.html#unsubscribe), the new stream also unsubscribes.
- At any time, only one input stream's data will be emitted; data from other streams will be ignored until their turn.
- After all input streams [complete](/en/guide/base#complete), the new stream also completes.
- If no input parameters are provided, an empty stream is created but will not emit any data.

## Examples

```typescript
import { $, concat } from 'pipel'

const stream1$ = $()
const stream2$ = $()
const stream3$ = $()

const concat$ = concat(stream1$, stream2$, stream3$)
concat$.then((value) => console.log('Output:', value))

// The first stream emits data
stream1$.next('a')
// Output: a

stream1$.next('b')
// Output: b

// The second stream emits data, but will not be output (the first stream is not finished)
stream2$.next('c') // This data will be ignored

// The first stream completes
stream1$.next('final1', true)
// Output: final1

// Now the second stream can emit data
stream2$.next('d', true)
// Output: d

// The third stream starts emitting data
stream3$.next('e', true)
// Output: e
```
