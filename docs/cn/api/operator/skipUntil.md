# skipUntil

跳过操作符，跳过源流的数据推送，直到触发器流解析一次后才开始传递后续的数据。

<div style="display: flex; justify-content: center">
  <img src="/skipUntil.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type skipUntil = <T>(trigger$: Stream | Observable) => (observable$: Observable<T>) => Observable<T>
```

## 参数说明

- trigger$: 触发器流或观察者，当它解析时启用数据传递

## 详情

- 只有 trigger$ 的 resolve 状态才能启用数据传递，reject 状态会被忽略
- 一旦启用后，后续所有的源流数据都会正常传递
- 启用前已经解析的数据不会回溯传递
- 当下游取消订阅时，会自动清理触发器监听器

## 示例

### 基本用法

```typescript
import { $, skipUntil } from 'pipeljs'

const source$ = $()
const trigger$ = $()
const result$ = source$.pipe(skipUntil(trigger$))

result$.then((value) => {
  console.log('传递:', value)
})

// 在触发器启用前推送的数据会被跳过
source$.next(1) // 跳过，不输出
source$.next(2) // 跳过，不输出

// 启用触发器
trigger$.next('go')

// 后续数据正常传递
source$.next(3) // 输出: 传递: 3
source$.next(4) // 输出: 传递: 4
```
