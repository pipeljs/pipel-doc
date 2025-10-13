# set

Immutable modification operator that adopts immutable approach to modify data.

<div style="display: flex; justify-content: center">
  <img src="/set.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type set = <T>(setter: (value: T) => void) => (observable$: Observable<T>) => Observable<T>
```

## Parameters

- setter: Modifier function that receives a value parameter, directly modifies this parameter to change the value

## Details

- Uses the `limu` library's `produce` function to ensure original data is never modified
- Supports plain objects, arrays, `Map`, `Set`, and other object types
- For primitive types (string, number, boolean, etc.), returns the original value unchanged

## Examples

### Object Modification

```typescript
import { $, set } from 'pipel'

const stream$ = $()
const modifiedStream$ = stream$.pipe(
  set((draft) => {
    draft.age = 26
  })
)

const initialData = { name: 'Alice', age: 25 }
stream$.next(initialData)

console.log(modifiedStream$.value) // { name: 'Alice', age: 26 }
console.log(initialData.age) // 25 (original data unchanged)
```

### Array Modification

```typescript
import { $, set } from 'pipel'

const stream$ = $()
const modifiedStream$ = stream$.pipe(
  set((draft) => {
    draft.items.push(4)
    draft.metadata.count = draft.items.length
  })
)

const initialData = { items: [1, 2, 3], metadata: { count: 3 } }
stream$.next(initialData)

console.log(modifiedStream$.value.items) // [1, 2, 3, 4]
console.log(modifiedStream$.value.metadata.count) // 4
console.log(initialData.items) // [1, 2, 3] (original array unchanged)
```
