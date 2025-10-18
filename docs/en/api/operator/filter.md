# filter

Filter operator, filters data based on a condition function, only emitting data that satisfies the condition.

<div style="display: flex; justify-content: center">
  <img src="/filter.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type filter = <T>(condition: (value: T) => boolean) => (observable$: Observable<T>) => Observable<T>
```

## Parameters

- condition: Condition function, receives each emitted data; returns `true` to emit the data downstream, returns `false` to filter it out.

## Details

- Accepts a condition function parameter, which receives the data value and returns a boolean
- Only emits data that meets the condition, and the emitted value is the complete original data

## Examples

```typescript
import { $, filter } from 'pipeljs'

const stream$ = $()

// Only allow numbers greater than 2 to pass
const filtered$ = stream$.pipe(filter((value) => value > 2))

filtered$.then((value) => {
  console.log('Filtered value:', value)
})

stream$.next(1) // No output
stream$.next(2) // No output
stream$.next(3) // Output: Filtered value: 3
stream$.next(4) // Output: Filtered value: 4
```

```typescript
import { $, filter } from 'pipeljs'

const stream$ = $()
const string$ = stream$.pipe(filter((value) => typeof value === 'string'))

string$.then((value) => console.log('String:', value))

stream$.next(1) // No output
stream$.next('hello') // Output: String: hello
```

```typescript
import { $, filter } from 'pipeljs'

const stream$ = $()
const hasId$ = stream$.pipe(
  filter((value) => typeof value === 'object' && value !== null && 'id' in value)
)

hasId$.then((value) => console.log('Has id:', value))

stream$.next({ name: 'test' }) // No output
stream$.next({ id: 1, name: 'test' }) // Output: Has id: { id: 1, name: 'test' }
```
