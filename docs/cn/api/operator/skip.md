# skip

跳过操作符，跳过指定次数的数据推送，从第 N+1 次开始接收数据。

<div style="display: flex; justify-content: center">
  <img src="/skip.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type skip = <T>(skipTime: number) => (observable$: Observable<T>) => Observable<T>
```

## 参数说明

- skipTime: 需要跳过的数据推送次数

## 详情

- 如果 skipTime 为 0，则所有数据都会被推送，不会跳过。
- 如果 skipTime 大于实际推送次数，则所有数据都被跳过，不会有数据推送到下游。
- 跳过次数达到后，后续所有数据都会正常推送。

## 示例

```typescript
import { $, skip } from 'pipel'

const stream$ = $()

// 使用 skip 操作符，跳过前 2 次推送
const skipped$ = stream$.pipe(skip(2))

skipped$.then((value) => {
  console.log('跳过后接收的值:', value)
})

// 推送数据
stream$.next(2) // 跳过，不输出
stream$.next(3) // 跳过，不输出
stream$.next(4) // 输出: 跳过后接收的值: 4
stream$.next(5) // 输出: 跳过后接收的值: 5
```
