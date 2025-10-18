# delay

延迟操作符，将输入流的数据延迟指定时间后推送给订阅节点。

<div style="display: flex; justify-content: center">
  <img src="/delay.drawio.svg" alt="image" >
</div>

## 类型

```typescript
type delay = <T>(delayTime: number) => (observable$: Observable<T>) => Observable<T>
```

## 详情

- 接收一个延迟时间参数（毫秒），将数据延迟指定时间后推送给订阅节点

## 示例

```typescript
import { $, delay } from 'pipeljs'

const stream$ = $(1)

// 使用 delay 操作符，延迟 1000ms
const delayed$ = stream$.pipe(delay(1000))

delayed$.then((value) => {
  console.log('延迟后的值:', value)
})

stream$.next(2)
stream$.next(3)

// 输出：
// 延迟 1000ms 后输出: 延迟后的值: 2
// 延迟 1000ms 后输出: 延迟后的值: 3
```
