# Immutable Data

pipel supports immutable data, implemented at the bottom layer using [limu](https://tnfe.github.io/limu/).

## Stream

The [set](/en/api/stream.html#set) method of a Stream can immutably modify the node's data.

```typescript
import { $ } from 'pipeljs'
const promise$ = $({ a: 1, b: { c: 2 } })
const oldValue = promise$.value

promise$.set((state) => (state.a = 3))
const newValue = promise$.value

console.log(oldValue === newValue) // false
console.log(oldValue.b === newValue.b) // true
```

## Observable

Observable streams can modify the data flowing through the current node using the [set](/en/api/operator/set) operator.

```typescript
import { $, set } from 'pipeljs'
const promise$ = $({ a: 1, b: { c: 2 } })
const observer1$ = promise$.pipe(set((state) => (state.a = 3)))
const observer2$ = observer1$.pipe(set((state) => (state.a = 4)))

console.log(promise$.value === observer1$.value) // false
console.log(observer1$.value === observer2$.value) // false

console.log(promise$.value.b === observer1$.value.b) // true
console.log(observer1$.value.b === observer2$.value.b) // true
```
