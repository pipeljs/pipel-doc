# fork

Creates a new [Stream](/en/api/stream#stream) from the input [Stream](/en/api/stream#stream) or [Observable](/en/api/observable), which subscribes to the input stream and emits the same values.

![image](/fork.drawio.svg)

## Type Definition

```typescript
type fork: <T>(arg$: Stream<T> | Observable<T>, autoUnsubscribe?: boolean) => Stream<T>;
```

## Parameters

- arg$: Input [Stream](/en/api/stream#stream) or [Observable](/en/api/observable) instance
- autoUnsubscribe: Optional, defaults to `true`. Controls whether the forked stream automatically unsubscribes when the input stream unsubscribes
  - `true`: When the input stream unsubscribes, the forked stream also unsubscribes automatically
  - `false`: When the input stream unsubscribes, the forked stream does not automatically unsubscribe

## Details

- The fork operator creates a new stream that subscribes to the input stream
- The new stream emits exactly the same values as the input stream (including resolved and rejected values)
- When autoUnsubscribe is `true`, after the input stream [unsubscribes](/en/guide/base#unsubscribe), the new stream will also asynchronously unsubscribe
- When autoUnsubscribe is `true`, after the input stream [completes](/en/guide/base#complete), the new stream will also complete

## Example

```typescript
import { $, fork } from 'pipeljs'

const source$ = $('initial value')
const forked$ = fork(source$)

forked$.then((value) => {
  console.log('Forked value:', value)
})

console.log(forked$.value) // Output: initial value

source$.next('new value')
// Output: Forked value: new value

forked$.next('new forked value')
// Output: Forked value: new forked value
```
