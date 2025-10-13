# get

Property extraction operator that uses a getter function to extract specific values from a source stream, only emitting new values when the extracted value changes.

<div style="display: flex; justify-content: center">
  <img src="/get.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type get = <T, F>(
  getter: (value: T | undefined) => F
) => (observable$: Observable<T>) => Observable<F>
```

## Parameters

- getter: Extraction function that receives the source stream's value and returns the part to be extracted
  - Parameter: value: T | undefined - Current value of the source stream
  - Return value: F - Extracted value

## Details

- Executes the getter function immediately upon creation to get the initial value
- Only emits new values when the getter's return value changes
- Uses strict equality (`===`) to compare whether the extracted value has changed

## Examples

```typescript
import { $, get } from 'pipel'

const source$ = $({ a: 1, b: { c: 2 } })
const b$ = source$.pipe(get((value) => value?.b))

b$.then((value) => {
  console.log('b changed:', value)
})

console.log(b$.value) // { c: 2 }

// Modifying unrelated properties won't trigger
source$.set((value) => {
  value.a = 3
}) // No output

// Modifying related properties will trigger
source$.set((value) => {
  value.b.c = 3
}) // Output: b changed: { c: 3 }
```

```typescript
import { $, get } from 'pipel'

const source$ = $({
  data: {
    users: [
      { name: 'Alice', settings: { theme: 'dark' } },
      { name: 'Bob', settings: { theme: 'light' } },
    ],
  },
})

const firstUserTheme$ = source$
  .pipe(get((value) => value?.data?.users))
  .pipe(get((users) => users?.[0]))
  .pipe(get((user) => user?.settings?.theme))

firstUserTheme$.then((theme) => {
  console.log('theme:', theme)
})

console.log(firstUserTheme$.value) // 'dark'

source$.set((value) => {
  value.data.users[0].settings.theme = 'light'
})
// Output: theme: light
```
