# get

属性提取操作符，使用 getter 函数从源流中提取特定的值，只有当提取的值发生变化时才会发出新值。

<div style="display: flex; justify-content: center">
  <img src="/get.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type get = <T, F>(
  getter: (value: T | undefined) => F
) => (observable$: Observable<T>) => Observable<F>
```

## 参数说明

- getter: 提取函数，接收源流的值并返回需要提取的部分
  - 参数：value: T | undefined - 源流的当前值
  - 返回值：F - 提取的值

## 详情

- 创建时会立即执行 getter 函数获取初始值
- 只有当 getter 返回的值发生变化时才会发出新值
- 使用严格相等（`===`）比较提取的值是否发生变化

## 使用场景

```typescript
import { $, get } from 'pipeljs'

const source$ = $({ a: 1, b: { c: 2 } })
const b$ = source$.pipe(get((value) => value?.b))

b$.then((value) => {
  console.log('b changed:', value)
})

console.log(b$.value) // { c: 2 }

// 修改不相关的属性，不会触发
source$.set((value) => {
  value.a = 3
}) // 不输出

// 修改相关属性，会触发
source$.set((value) => {
  value.b.c = 3
}) // 输出: b changed: { c: 3 }
```

```typescript
import { $, get } from 'pipeljs'

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
// 输出: theme: light
```
