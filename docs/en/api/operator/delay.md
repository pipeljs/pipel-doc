# delay

Delay operator, delays the emission of data from the input stream by the specified time before pushing it to the subscriber node.

<div style="display: flex; justify-content: center">
  <img src="/delay.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type delay = <T>(delayTime: number) => (observable$: Observable<T>) => Observable<T>
```

## Details

- Accepts a delay time parameter (milliseconds), delays data by the specified time before pushing to subscriber nodes

## Example

```typescript
import { $, delay } from 'pipel'

const stream$ = $(1)

// Use delay operator, delay 1000ms
const delayed$ = stream$.pipe(delay(1000))

delayed$.then((value) => {
  console.log('Delayed value:', value)
})

stream$.next(2)
stream$.next(3)

// Output:
// After 1000ms: Delayed value: 2
// After 1000ms: Delayed value: 3
```
