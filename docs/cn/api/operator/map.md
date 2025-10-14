# map

数据转换操作符，使用投影函数对源流中的每个值进行转换，并将转换后的值推送到下游。

<div style="display: flex; justify-content: center">
  <img src="/map.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type map = <T, R>(
  project: (value: T) => R | PromiseLike<R>
) => (observable$: Observable<T>) => Observable<R>
```

## 参数说明

- project: 投影函数，接收源流的值并返回转换后的值，支持同步和异步返回值

## 详情

- 每次源流发出值时，都会执行投影函数进行转换
- 支持同步和异步（Promise）转换

## 示例

### 同步转换

```typescript
import { $, map } from 'pipeljs'

const stream$ = $()
const mapped$ = stream$.pipe(map((value: number) => value * 2))

mapped$.then((value) => {
  console.log('mapped:', value)
})

stream$.next(1) // 输出: mapped: 2
stream$.next(2) // 输出: mapped: 4
```

### 异步转换

```typescript
import { $, map } from 'pipeljs'

const stream$ = $()
const mapped$ = stream$.pipe(map((value: string) => Promise.resolve(`${value}-async`)))

mapped$.then((value) => {
  console.log('async-mapped:', value)
})

stream$.next('a') // 输出: async-mapped: a-async
```

### 错误处理

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

stream$.next('error') // 输出: rejected: map-error
stream$.next('ok') // 输出: resolved: ok
```
