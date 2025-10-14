# debounce

防抖操作符，延迟推送数据，直到指定时间内没有新的数据推送时才执行。

<div style="display: flex; justify-content: center">
  <img src="/debounce.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type debounce = (debounceTime: number) => (observable$: Observable) => Observable
```

## 参数说明

- debounceTime: 防抖时间间隔，单位为毫秒

## 详情

- 所有推送都不会立即执行，包括第一次推送
- 只有在防抖时间内没有新的推送时，才会发出最后一次的值

## 示例

```typescript
import { $, debounce } from 'pipeljs'

const stream$ = $()

// 使用 debounce 操作符，防抖时间 100ms
const debounced$ = stream$.pipe(debounce(100))

debounced$.then((value) => {
  console.log('防抖后的值:', value)
})

// 快速连续推送数据
stream$.next(1)
setTimeout(() => stream$.next(2), 30)
setTimeout(() => stream$.next(3), 60)
setTimeout(() => stream$.next(4), 90)

// 只有最后一次推送会在防抖时间后发出
// 190ms后输出: 防抖后的值: 4
```
