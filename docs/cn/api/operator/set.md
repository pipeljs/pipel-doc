# set

不可变修改操作符，采用 immutable 方式修改数据。

<div style="display: flex; justify-content: center">
  <img src="/set.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type set = <T>(setter: (value: T) => void) => (observable$: Observable<T>) => Observable<T>
```

## 参数说明

- setter: 修改器函数，接收一个 `value` 参数，直接修改该参数来改变值

## 详情

- 支持普通对象、数组、Map、Set 等对象类型
- 对于原始类型（字符串、数字、布尔值等），直接返回原值

## 示例

### 对象修改

```typescript
import { $, set } from 'pipeljs'

const stream$ = $()
const modifiedStream$ = stream$.pipe(
  set((draft) => {
    draft.age = 26
  })
)

const initialData = { name: 'Alice', age: 25 }
stream$.next(initialData)

console.log(modifiedStream$.value) // { name: 'Alice', age: 26 }
console.log(initialData.age) // 25 (原始数据未改变)
```

### 数组修改

```typescript
import { $, set } from 'pipeljs'

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
console.log(initialData.items) // [1, 2, 3] (原始数组未改变)
```
