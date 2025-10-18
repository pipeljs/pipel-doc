# map

Data transformation operator that uses a projection function to transform each value from the source stream and push the transformed values downstream.

<div style="display: flex; justify-content: center">
  <img src="/map.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type map = <T, R>(
  project: (value: T) => R | PromiseLike<R>
) => (observable$: Observable<T>) => Observable<R>
```

## Parameters

- project: Projection function that receives values from the source stream and returns transformed values, supporting both synchronous and asynchronous return values

## Details

- Executes the projection function for every value emitted by the source stream
- Supports both synchronous and asynchronous (Promise) transformations

## Examples

### Synchronous Transformation

```typescript
import { $, map } from 'pipeljs'

const stream$ = $()
const mapped$ = stream$.pipe(map((value: number) => value * 2))

mapped$.then((value) => {
  console.log('mapped:', value)
})

stream$.next(1) // Output: mapped: 2
stream$.next(2) // Output: mapped: 4
```

### Asynchronous Transformation

```typescript
import { $, map } from 'pipeljs'

const stream$ = $()
const mapped$ = stream$.pipe(map((value: string) => Promise.resolve(`${value}-async`)))

mapped$.then((value) => {
  console.log('async-mapped:', value)
})

stream$.next('a') // Output: async-mapped: a-async
```

### Error Handling

```typescript
import { $, map } from 'pipeljs'

const stream$ = $()
const mapped$ = stream$.pipe(
  map((value: string) => {
    if (value === 'error') throw new Error('map-error')
    return value
  })
)

mapped$.then(
  (value) => console.log('resolved:', value),
  (err) => console.log('rejected:', err.message)
)

stream$.next('error') // Output: rejected: map-error
stream$.next('ok') // Output: resolved: ok
```
