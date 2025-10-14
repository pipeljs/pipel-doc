# debounce

Debounce operator. Delays data emission until no new data is emitted within the specified time.

<div style="display: flex; justify-content: center">
  <img src="/debounce.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type debounce = (debounceTime: number) => (observable$: Observable) => Observable
```

## Parameters

- `debounceTime` (`number`): Debounce time interval in milliseconds

## Details

- All emissions are not executed immediately, including the first emission.
- Only emits the last value when no new emissions occur within the debounce time.

## Examples

### Scenario 1: Basic debouncing

```typescript
import { $, debounce } from 'pipeljs'

const stream$ = $()

// Use debounce operator, debounce time 100ms
const debounced$ = stream$.pipe(debounce(100))

debounced$.then((value) => {
  console.log('Debounced value:', value)
})

// Rapid consecutive emissions
stream$.next(1)
setTimeout(() => stream$.next(2), 30)
setTimeout(() => stream$.next(3), 60)
setTimeout(() => stream$.next(4), 90)

// Only the last emission will be emitted after debounce time
// After 190ms output: Debounced value: 4
```
