# skip

Skip operator, skips a specified number of data emissions and starts receiving data from the N+1th emission.

<div style="display: flex; justify-content: center">
  <img src="/skip.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type skip = <T>(skipTime: number) => (observable$: Observable<T>) => Observable<T>
```

## Parameters

- skipTime: Number of data emissions to skip

## Details

- If skipTime is 0, all data will be emitted, none will be skipped
- If skipTime is greater than the actual number of emissions, all data will be skipped and none will be emitted downstream
- After the skip count is reached, all subsequent data will be emitted normally

## Example

```typescript
import { $, skip } from 'pipeljs'

const stream$ = $()

// Use skip operator, skip the first 2 emissions
const skipped$ = stream$.pipe(skip(2))

skipped$.then((value) => {
  console.log('Value received after skip:', value)
})

// Emit data
stream$.next(2) // Skipped, no output
stream$.next(3) // Skipped, no output
stream$.next(4) // Output: Value received after skip: 4
stream$.next(5) // Output: Value received after skip: 5
```
