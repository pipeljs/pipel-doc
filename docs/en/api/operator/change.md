# change

Change detection operator, only triggers subsequent operations when the result of the `differ` function differs from the previous one.

<div style="display: flex; justify-content: center">
  <img src="/change.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
change: <T>(differ: (value: T | undefined) => any) =>
  (observable$: Observable<T>) =>
    Observable<T>
```

## Parameters

- differ: Function to extract the value for comparison from the source data
  - Parameter: value: T | undefined - The current data in the stream
  - Return value: any - The value used for comparison

## Details

- The first emission always triggers (since there is no previous value to compare)
- Only triggers when the result of `differ` is different from the previous one
- The emitted value is the original complete data, not the part returned by `differ`
- Uses strict equality (`===`) to detect changes in the result of the `differ` function

## Examples

```typescript
import { $ } from 'pipel'

const promise$ = $<{ user: { name: string; age: number } }>()
promise$.pipe(change((value) => value?.user.name)).then(() => console.log('Username changed'))

promise$.next({ user: { name: 'Alice', age: 25 } }) // Output: Username changed
promise$.next({ user: { name: 'Bob', age: 25 } }) // Output: Username changed
promise$.next({ user: { name: 'Bob', age: 30 } }) // No output
promise$.next({ user: { name: 'Alice', age: 30 } }) // Output: Username changed
```

```typescript
import { $ } from 'pipel'

const promise$ = $<{ items: number[] }>()
promise$
  .pipe(change((value) => value?.items?.length))
  .then(() => console.log('Array length changed'))

promise$.next({ items: [1, 2] }) // Output: Array length changed
promise$.next({ items: [1, 2, 3] }) // Output: Array length changed
promise$.next({ items: [1, 2, 3] }) // No output
promise$.next({ items: [1] }) // Output: Array length changed
```
