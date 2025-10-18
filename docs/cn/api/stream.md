<script setup>
import Stream from '../../components/stream.vue'
</script>

# Stream

Stream 继承[Observable](/cn/api/observable)，除了 Observable 的属性和方法外，以下方法为新增

<Stream />

## next

- 类型

  ```typescript
  next(payload: any, finishFlag?: boolean): void;
  ```

- 详情

  - 当前流推送数据，payload 为数据，当为 Promise.reject(xxx) 或者 Promise.reject(xxx) 时，后续 then 表现和 promise 的 then 一致；
  - 第二个参数代表当前流是否结束当设置为 true 后续 set、next 将不再执行，并且在流执行完每个节点后会触发节点的 afterComplete 回调函数，然后自动调用节点的 unsubscribe 方法

- 示例
  ```typescript
  import { $ } from 'pipeljs'
  const promise$ = $('1')
  promise$.then((value) => {
    console.log(value)
  })
  promise$.next('2') // 输出 2
  ```

## set

- 类型
  ```typescript
    set(setter: (value: T) => void, finishFlag?: boolean): void;
  ```
- 详情

  当前流推送数据数据，与 next 的区别是 set 接收一个 setter（可以是同步或者是异步），推送一个新的 immutable 数据；第二个参数代表当前流是否结束，当设置为 true 后续 set、next 将不再执行

- 示例

  ```typescript
  import { $ } from 'pipeljs'
  const promise$ = $({ a: 1, b: { c: 2 } })

  // 保留旧数据
  const oldValue = promise$.value

  // 设置新数据
  promise$.set((value) => {
    value.a = 2
  })

  // 获取新数据
  const newValue = promise$.value

  oldValue === newValue // ❌
  oldValue.b === newValue.b // ✅
  ```

## complete

- 类型

  ```typescript
  complete: () => void
  ```

- 详情

  调用 complete 方法后流将结束，后续的 next、set 将不再执行，并且会触发所有节点的 afterComplete 回调函数，然后自动调用节点的 unsubscribe 方法

- 示例

  ```typescript
  import { $, console } from 'pipeljs'
  const promise$ = $()
  promise$.afterComplete(() => {
    console.log('complete')
  })
  promise$.complete() // 输出 complete
  ```

## pause

- 类型

  ```typescript
  pause: () => void
  ```

- 详情

  暂停当前流，执行 pause 方法后，所有订阅的节点都不会执行

- 示例

  ```typescript
  import { $, console } from 'pipeljs'

  const promise$ = $('1')
  promise$.then((value) => {
    console.log(value)
  })

  promise$.next('2') // 输出 2
  promise$.pause()
  promise$.next('3') // 不输出 3
  ```

## restart

- 类型

  ```typescript
  restart: () => void
  ```

- 详情

  重启当前流，执行 restart 方法后，所有订阅的节点开始接受流的推送并执行

- 示例

  ```typescript
  import { $, console } from 'pipeljs'

  const promise$ = $('1')
  promise$.then((value) => {
    console.log(value)
  })

  promise$.pause()
  promise$.next('2') // 不输出 2
  promise$.restart()
  promise$.next('3') // 输出 3
  ```
