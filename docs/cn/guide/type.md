# typescript 类型支持

## 初始值类型自动推导

在使用[$](/cn/api/$)创建流时，pipel 会自动推导初始值的类型。

```typescript
import { $ } from 'pipel'
const promise$ = $({ a: '1', b: 2 })
promise$.value // {a: string, b: number}

const promise$ = $<{ a: string; b: number }>()
promise$.value // {a: string, b: number} | undefined
```

## 订阅节点类型自动推导

在使用[then](/cn/api/observable.html#then)订阅流时，pipel 会自动推导订阅节点的类型。

```typescript
import { $ } from 'pipel'
const promise$ = $({ a: '1', b: 2 })
// 自动推导then data参数的类型为{a: string, b: number}
const observable$ = promise$.then((data) => ({ c: state.a, d: state.b }))
// 自动推导data的类型为{c: string, d: number}
observable$.value
```

## 操作符类型自动推导

在使用操作符时，pipel 会自动推导操作符的类型。

```typescript
import { $, get } from 'pipel'
const promise$ = $({ a: '1', b: 2 })
// 自动推导pipe data参数的类型为{a: string, b: number}
const observable$ = promise$.pipe(get((state) => state.a))
// 自动推导data的类型为string
observable$.value
```
