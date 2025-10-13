# throttle

节流操作符，限制数据推送的频率，确保在指定时间间隔内控制数据流的发射频率。

<div style="display: flex; justify-content: center">
  <img src="/throttle.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type throttle = (throttleTime: number) => (observable$: Observable) => Observable
```

## 参数说明

- throttleTime: 节流时间间隔，单位为毫秒

## 详情

- 采用"前沿节流"策略：第一次数据推送会立即通过
- 在节流时间间隔内的后续推送会被延迟
- 节流期间内的最后一次推送会在时间间隔结束后发出
- 如果推送之间的间隔大于节流时间，每次推送都会立即通过

## 示例

```typescript
import { $, throttle } from 'pipel'

const stream$ = $()

// 使用 throttle 操作符，节流时间 100ms
const throttled$ = stream$.pipe(throttle(100))

throttled$.then((value) => {
  console.log('节流后的值:', value)
})

// 第一次推送立即通过
stream$.next(1) // 立即输出: 节流后的值: 1

// 快速连续推送数据
setTimeout(() => stream$.next(2), 30) // 被节流
setTimeout(() => stream$.next(3), 60) // 被节流，但会在100ms后发出
setTimeout(() => stream$.next(4), 90) // 被节流

// 输出:
// 立即: 节流后的值: 1
// 100ms后: 节流后的值: 4
```
