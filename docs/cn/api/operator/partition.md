# partition

将输入的[ stream ](/cn/api/stream#stream)或者[ Observable ](/cn/api/observable)按照条件函数进行分区，返回两个流，第一个是满足条件的流，第二个是不满足条件的流

![image](/partition.drawio.svg)

## 类型

```typescript
export enum PromiseStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

type partition: <T>(
  stream$: Stream<T> | Observable<T>,
  predicate: (this: any, value: any, status: PromiseStatus, index: number) => boolean,
  thisArg?: any,
) => [Stream<T>, Stream<T>];
```

## 参数

- stream$: 输入的流或 Observable
- predicate: 条件函数，接收 `value`、`status`、`index` 三个参数
  - value: 当前值
  - status: Promise 状态
  - index: 从 1 开始的索引计数
- thisArg: 条件函数的 `this` 上下文

## 返回值

返回一个包含两个 Stream 的数组：`[满足条件的流, 不满足条件的流]`

## 详情

- 将输入的流按照条件函数进行区分，返回两个流：第一个是满足条件的流，第二个是不满足条件的流
- 输入的流[取消订阅](/cn/guide/base.html#取消订阅)后，两个返回的流也会取消订阅
- 输入的流[ 结束 ](/cn/guide/base#结束)后，对应返回的流也会结束
- 如果输入流已经完成，两个返回的流会立即完成
- 条件函数抛出错误时，该值会被分配到不满足条件的流中
- 索引从 1 开始计数，每次处理值后递增

## 示例

```typescript
import { $, partition } from 'pipel'

const stream$ = $()

const [selectedStream$, unselectedStream$] = partition(stream$, (value, status) => {
  // 选择成功状态的奇数，或失败状态的偶数
  if (status === 'resolved') {
    return value % 2 === 1
  } else {
    return value % 2 === 0
  }
})

selectedStream$.then(
  (value) => console.log('选中成功:', value),
  (value) => console.log('选中失败:', value)
)
unselectedStream$.then(
  (value) => console.log('未选中成功:', value),
  (value) => console.log('未选中失败:', value)
)

stream$.next('1') // resolved 奇数 -> 选中
// 输出: 选中成功: 1
stream$.next('2') // resolved 偶数 -> 未选中
// 输出: 未选中成功: 2
stream$.next(Promise.reject('3')) // rejected 奇数 -> 未选中
// 输出: 未选中失败: 3
stream$.next(Promise.reject('4')) // rejected 偶数 -> 选中
// 输出: 选中失败: 4
```
