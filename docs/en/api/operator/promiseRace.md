# promiseRace

Performs a race among the input [stream](/en/api/stream#stream) or [Observable](/en/api/observable), returning a new stream, similar to `Promise.race`.

![image](/promiseRace.drawio.svg)

## Type

```typescript
type promiseRace: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>[number]>;
```

## Details

- Only the first stream to emit data becomes the "winner"; only data from this winning stream will be forwarded to the output stream
- Data from other streams will be ignored, even if they continue to emit data
- When the winning stream unsubscribes, the output stream also unsubscribes
- When the winning stream [completes](/en/guide/base#complete), the output stream also completes
- Supports error handling: if the winning stream emits a rejected `Promise`, the output stream will also emit the rejected `Promise`

## Examples

### Basic usage

```typescript
import { $, promiseRace } from 'pipeljs'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(false)

const promiseRace$ = promiseRace(stream1$, stream2$, stream3$)
promiseRace$.then((value) => console.log(value))

stream2$.next('world')
// Output: hello (initial value)
stream3$.next(true)
stream1$.next(3)
stream2$.next('code')
// Output: code (only subsequent data from stream2 will be forwarded)
```

### Winner example

```typescript
import { $, promiseRace } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()
const stream3$ = $()

const race$ = promiseRace(stream1$, stream2$, stream3$)
race$.then((value) => console.log('Winner:', value))

// The second stream emits data first
stream2$.next('Second wins')
// Output: Winner: Second wins

// Data from other streams will be ignored
stream1$.next('First too late')
stream3$.next('Third too late')
// No output

// Only subsequent emissions from the winning stream will be processed
stream2$.next('Second again')
// Output: Winner: Second again
```

### Error handling example

```typescript
import { $, promiseRace } from 'pipeljs'

const stream1$ = $()
const stream2$ = $()

const race$ = promiseRace(stream1$, stream2$)
race$.then(
  (value) => console.log('Success:', value),
  (error) => console.log('Error:', error)
)

// The first stream emits an error first
stream1$.next(Promise.reject('First error'))
// Output: Error: First error

// Data from the second stream will be ignored
stream2$.next('Second value')
// No output, since the first stream already won

// Subsequent errors from the winning stream will also be forwarded
stream1$.next(Promise.reject('First again'))
// Output: Error: First again
```
