# skipFilter

跳过过滤操作符，根据过滤函数决定是否跳过数据推送。

<div style="display: flex; justify-content: center">
  <img src="/skipFilter.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
type skipFilter = (filter: (time: number) => boolean) => (observable$: Observable) => Observable
```

## 参数说明

- filter: 过滤函数，接收当前推送次数并返回布尔值
  - 参数：time - 从 1 开始的推送次数
  - 返回值：true 时推送数据，false 时跳过

## 详情

- 接收一个过滤函数参数，该函数接收当前推送次数并返回布尔值
- 过滤函数返回 `true` 时推送数据，返回 `false` 时跳过
- 使用内部计数器跟踪推送次数，从 1 开始递增
- 对所有类型的数据都有效，包括 Promise 的成功和失败状态

## 示例

### 场景 1：跳过奇数次推送

```typescript
import { $, skipFilter } from 'pipel'

const stream$ = $()

// 使用 skipFilter 操作符，只接收偶数次推送
const filtered$ = stream$.pipe(skipFilter((time) => time % 2 === 0))

filtered$.then((value) => {
  console.log('过滤后接收的值:', value)
})

// 推送数据
stream$.next('first') // 第1次，跳过，不输出
stream$.next('second') // 第2次，输出: 过滤后接收的值: second
stream$.next('third') // 第3次，跳过，不输出
stream$.next('fourth') // 第4次，输出: 过滤后接收的值: fourth
```

### 场景 2：跳过前 N 次推送

```typescript
import { $, skipFilter } from 'pipel'

const stream$ = $()

// 跳过前3次推送
const filtered$ = stream$.pipe(skipFilter((time) => time > 3))

filtered$.then((value) => {
  console.log('跳过前3次后:', value)
})

stream$.next('first') // 第1次，跳过
stream$.next('second') // 第2次，跳过
stream$.next('third') // 第3次，跳过
stream$.next('fourth') // 第4次，输出: 跳过前3次后: fourth
stream$.next('fifth') // 第5次，输出: 跳过前3次后: fifth
```

### 场景 3：每 N 次推送一次

```typescript
import { $, skipFilter } from 'pipel'

const stream$ = $()

// 每3次推送一次（第3、6、9次...）
const filtered$ = stream$.pipe(skipFilter((time) => time % 3 === 0))

filtered$.then((value) => {
  console.log('每3次推送:', value)
})

for (let i = 1; i <= 10; i++) {
  stream$.next(`value${i}`)
}
// 输出:
// 每3次推送: value3
// 每3次推送: value6
// 每3次推送: value9
```

## 与其他 API 的关系

- **与 `skip` 操作符的区别**：`skip` 跳过固定数量的前 N 次推送，`skipFilter` 可以根据复杂条件决定是否跳过
- **与 `filter` 操作符的区别**：`filter` 基于数据值进行过滤，`skipFilter` 基于推送次数进行过滤
