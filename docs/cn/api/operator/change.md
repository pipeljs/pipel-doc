# change

变更检测操作符，只有当 differ 函数的结果与上一次不同时才会触发后续操作。

<div style="display: flex; justify-content: center">
  <img src="/change.drawio.svg" alt="image" >
</div>

## 类型定义

```typescript
change: <T>(differ: (value: T | undefined) => any) =>
  (observable$: Observable<T>) =>
    Observable<T>
```

## 参数说明

- differ: 从源数据中提取用于比较的值的函数
  - 参数: value: T | undefined - 当前推流的数据
  - 返回值: any - 用于比较的值

## 详情

- 第一次推流时总是会触发（因为没有上一次的值进行比较）
- 只有当 differ 结果不同时才会推送数据
- 推送的是原始的完整数据，而不是 differ 的那部分数据
- 使用严格相等比较 (`===`) 来检测 differ 函数结果的变化

## 示例

```typescript
import { $ } from 'pipel'

const promise$ = $<{ user: { name: string; age: number } }>()
promise$.pipe(change((value) => value?.user.name)).then(() => console.log('用户名变更'))

promise$.next({ user: { name: 'Alice', age: 25 } }) // 输出: 用户名变更
promise$.next({ user: { name: 'Bob', age: 25 } }) // 输出: 用户名变更
promise$.next({ user: { name: 'Bob', age: 30 } }) // 不输出
promise$.next({ user: { name: 'Alice', age: 30 } }) // 输出: 用户名变更
```

```typescript
import { $ } from 'pipel'

const promise$ = $<{ items: number[] }>()
promise$.pipe(change((value) => value?.items?.length)).then(() => console.log('数组长度变更'))

promise$.next({ items: [1, 2] }) // 输出: 数组长度变更
promise$.next({ items: [1, 2, 3] }) // 输出: 数组长度变更
promise$.next({ items: [1, 2, 3] }) // 不输出
promise$.next({ items: [1] }) // 输出: 数组长度变更
```
