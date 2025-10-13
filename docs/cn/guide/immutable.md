# 不可变数据

pipel 支持不可变数据，底层采用[limu](https://tnfe.github.io/limu/)实现。

## Stream

Stream 流的[set](/cn/api/stream.html#set)方法可以 immutable 的修改节点的数据。

```typescript
import { $ } from 'pipel'
const promise$ = $({ a: 1, b: { c: 2 } })
const oldValue = promise$.value

promise$.set((state) => (state.a = 3))
const newValue = promise$.value

console.log(oldValue === newValue) // false
console.log(oldValue.b === newValue.b) // true
```

## Observable

Observable 流可以通过 [set](/cn/api/operator/set) 操作符修改流经当前节点的数据。

```typescript
import { $, set } from 'pipel'
const promise$ = $({ a: 1, b: { c: 2 } })
const observer1$ = promise$.pipe(set((state) => (state.a = 3)))
const observer2$ = observer1$.pipe(set((state) => (state.a = 4)))

console.log(promise$.value === observer1$.value) // false
console.log(observer1$.value === observer2$.value) // false

console.log(promise$.value.b === observer1$.value.b) // true
console.log(observer1$.value.b === observer2$.value.b) // true
```
