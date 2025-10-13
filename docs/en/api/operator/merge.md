# merge

Merges the input [stream](/en/api/stream#stream) or [Observable](/en/api/observable) and returns a new stream.

![image](/merge.drawio.svg)

## Type

```typescript
type merge: <T extends (Stream | Observable)[]>(...args$: T) => Stream<StreamTupleValues<T>[number]>;
```

## Details

- The merge operation is based on time order; as long as any stream emits data, it will be pushed to the new stream.
- When all input streams [unsubscribe](/en/guide/base.html#unsubscribe), the new stream also unsubscribes.
- When all input streams [complete](/en/guide/base#complete), the new stream also completes.
- If no input parameters are provided, an empty stream is created but will not emit any data.

## Example

```typescript
import { $, merge } from 'pipel'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const merged$ = merge(stream1$, stream2$, stream3$)

merged$.then((value) => console.log(value))
console.log(merged$.value)
// Output: undefined

stream1$.next(2)
// Output: 2
stream2$.next('world')
// Output: world
stream3$.next(false)
// Output: false
stream1$.next(3)
// Output: 3
```

## Example

```typescript
import { $, merge } from 'pipel'

const stream1$ = $(1)
const stream2$ = $('hello')
const stream3$ = $(true)

const merged$ = merge(stream1$, stream2$, stream3$)

merged$.then((value) => console.log(value))
console.log(merged$.value)
// Output: undefined

stream1$.next(2)
// Output: 2
stream2$.next('world')
// Output: world
stream3$.next(false)
// Output: false
stream1$.next(3)
// Output: 3
```
