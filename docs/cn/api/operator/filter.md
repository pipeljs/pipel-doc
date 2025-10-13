# filter

过滤操作符，根据条件函数过滤数据，只推送满足条件的数据。

<div style="display: flex; justify-content: center">
  <img src="/filter.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type filter = <T>(condition: (value: T) => boolean) => (observable$: Observable<T>) => Observable<T>
```

## 参数说明

- condition: 条件函数，接收每次推送的数据，返回 `true` 时数据会被推送到下游，返回 `false` 时数据会被过滤掉。

## 详情

- 接收一个条件函数参数，该函数接收数据值并返回布尔值
- 只会推送满足条件的数据，并且推送的是完整数据

## 示例

```typescript
import { $, filter } from 'pipel'

const stream$ = $()

// 只允许大于 2 的数字通过
const filtered$ = stream$.pipe(filter((value) => value > 2))

filtered$.then((value) => {
  console.log('过滤后的值:', value)
})

stream$.next(1) // 不输出
stream$.next(2) // 不输出
stream$.next(3) // 输出: 过滤后的值: 3
stream$.next(4) // 输出: 过滤后的值: 4
```

```typescript
import { $, filter } from 'pipel'

const stream$ = $()
const string$ = stream$.pipe(filter((value) => typeof value === 'string'))

string$.then((value) => console.log('字符串:', value))

stream$.next(1) // 不输出
stream$.next('hello') // 输出: 字符串: hello
```

```typescript
import { $, filter } from 'pipel'

const stream$ = $()
const hasId$ = stream$.pipe(
  filter((value) => typeof value === 'object' && value !== null && 'id' in value)
)

hasId$.then((value) => console.log('有 id:', value))

stream$.next({ name: 'test' }) // 不输出
stream$.next({ id: 1, name: 'test' }) // 输出: 有 id: { id: 1, name: 'test' }
```
