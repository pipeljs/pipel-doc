# skipFilter

Skip filter operator, determines whether to skip data emissions based on a filter function.

<div style="display: flex; justify-content: center">
  <img src="/skipFilter.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type skipFilter = (filter: (time: number) => boolean) => (observable$: Observable) => Observable
```

## Parameters

- filter: Filter function that receives the current emission count and returns a boolean
  - Parameter: time - Emission count starting from 1
  - Return: true to emit data, false to skip

## Details

- Takes a filter function parameter that receives the current emission count and returns a boolean
- Emits data when filter function returns `true`, skips when `false`
- Uses internal counter to track emission count, starting from 1
- Works with all data types, including successful and failed states of `Promise`

## Examples

### Scenario 1: Skip odd-numbered emissions

```typescript
import { $, skipFilter } from 'pipeljs'

const stream$ = $()

// Use skipFilter operator, only accept even-numbered emissions
const filtered$ = stream$.pipe(skipFilter((time) => time % 2 === 0))

filtered$.then((value) => {
  console.log('Filtered value:', value)
})

// Emit data
stream$.next('first') // 1st time, skipped, no output
stream$.next('second') // 2nd time, output: Filtered value: second
stream$.next('third') // 3rd time, skipped, no output
stream$.next('fourth') // 4th time, output: Filtered value: fourth
```

### Scenario 2: Skip first N emissions

```typescript
import { $, skipFilter } from 'pipeljs'

const stream$ = $()

// Skip first 3 emissions
const filtered$ = stream$.pipe(skipFilter((time) => time > 3))

filtered$.then((value) => {
  console.log('After skipping first 3:', value)
})

stream$.next('first') // 1st time, skipped
stream$.next('second') // 2nd time, skipped
stream$.next('third') // 3rd time, skipped
stream$.next('fourth') // 4th time, output: After skipping first 3: fourth
stream$.next('fifth') // 5th time, output: After skipping first 3: fifth
```

### Scenario 3: Emit every Nth time

```typescript
import { $, skipFilter } from 'pipeljs'

const stream$ = $()

// Emit every 3rd time (3rd, 6th, 9th...)
const filtered$ = stream$.pipe(skipFilter((time) => time % 3 === 0))

filtered$.then((value) => {
  console.log('Every 3rd emission:', value)
})

for (let i = 1; i <= 10; i++) {
  stream$.next(`value${i}`)
}
// Output:
// Every 3rd emission: value3
// Every 3rd emission: value6
// Every 3rd emission: value9
```

## Relationship with Other APIs

- **vs `skip` operator**: `skip` skips a fixed number of initial emissions, while `skipFilter` can skip based on complex conditions
- **vs `filter` operator**: `filter` filters based on data values, while `skipFilter` filters based on emission count
