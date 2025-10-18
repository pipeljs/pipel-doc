<script setup>
import Stream from '../../components/stream.vue'
import Observable from '../../components/observable.vue'
</script>

# Observable

<Observable />

Observable 实例的 then、thenOnce、thenImmediate、pipe 方法返回的还是 Observable 实例

## value

- 类型
  ```typescript
  value: T | undefined
  ```
- 详情

  当前节点的数据

## status

- 类型
  ```typescript
  enum PromiseStatus {
    PENDING = 'pending',
    RESOLVED = 'resolved',
    REJECTED = 'rejected',
  }
  status: PromiseStatus | null
  ```
- 详情

  当前节点的状态，一般处于 pending、fulfilled、rejected 状态，当流没有经过该节点或者该节点已经[取消订阅](/cn/guide/base.html#取消订阅)，则状态为 null

## then

- 类型

  ```typescript
  type OnFulfilled<T> = Parameters<Promise<T>['then']>[0]
  type OnRejected<T> = Parameters<Promise<T>['catch']>[0]

  then<T>(
    onFulfilled: OnFulfilled<T>,
    onRejected?: OnRejected<unknown>,
  ): Observable
  ```

- 详情

  then 订阅者，用法和 promise 保持一致，返回订阅节点的[ Observable ](#observable)实例

- 示例

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $('1')
  const observable$ = promise$.then((value) => Number(value)) // 自动推导 observable.value 的类型为 number
  ```

## thenSet

- 类型
  ```typescript
    $then(setter: (value: T) => void | Promise<void>): Observable<T extends PromiseLike<infer V> ? V : T, E> & E;
  ```
- 详情

  thenSet 订阅者，不同于 then 订阅者，thenSet 订阅者只能对数据进行 immutable 操作而且无法处理上一个节点的 reject 错误，返回订阅节点的[ Observable ](#observable)实例。

- 示例

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $<{ a: number; b: { c: number } }>()
  const observable$ = promise$.$then((value) => {
    value.a = value.a + 1
  })

  promise$.next({ a: 1, b: { c: 1 } })
  // observable$.value === { a: 2, b: { c: 1 } }
  promise$.value.b === observable$.value.b // true
  ```

## thenOnce

- 类型

  ```typescript
  type OnFulfilled<T> = Parameters<Promise<T>['then']>[0]
  type OnRejected<T> = Parameters<Promise<T>['catch']>[0]

  thenOnce<T>(
    onFulfilled: OnFulfilled<T>,
    onRejected?: OnRejected<unknown>,
  ): Observable
  ```

- 详情

  thenOnce 相比 then 方法差异点在于一旦订阅节点执行后，订阅节点会自动[取消订阅](/cn/guide/base.html#取消订阅)。

- 示例

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $('1')
  const observable$ = promise$.thenOnce((value) => console.log(value))
  promise$.next('2') // 输出 2
  promise$.next('3') // 不会输出 3
  ```

## thenOnceSet

- 类型
  ```typescript
    $thenOnce(setter: (value: T) => void | Promise<void>): Observable<T extends PromiseLike<infer V>? V : T, E> & E;
  ```
  thenOnceSet 相比 thenSet 方法差异点在于一旦订阅节点执行后，订阅节点会自动取消订阅。

## thenImmediate

- 类型

  ```typescript
  type OnFulfilled<T> = Parameters<Promise<T>['then']>[0]
  type OnRejected<T> = Parameters<Promise<T>['catch']>[0]

  thenImmediate<T>(
    onFulfilled: OnFulfilled<T>,
    onRejected?: OnRejected<unknown>,
  ): Observable
  ```

- 详情

  thenImmediate 相比 then 方法差异点在于

  - 如果父节点是 Stream 实例并且有初始值，则采用 thenImmediate 会立即触发订阅子节点的 execute
  - 父订阅节点如果是 Observable 并且 execute 过，则采用 thenImmediate 会立即触发订阅子节点的 execute

- 示例

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $('1')
  const observable$ = promise$.thenImmediate((value) => console.log(value)) // 输出 1
  ```

## thenImmediateSet

- 类型
  ```typescript
    $thenImmediate(setter: (value: T) => void | Promise<void>): Observable<T extends PromiseLike<infer V>? V : T, E> & E;
  ```
  thenImmediateSet 相比 thenSet 方法差异点在于父订阅节点如果 execute 过，则采用 thenImmediateSet 会立即触发订阅子节点的 execute。

## catch

- 类型

  ```typescript
  type OnRejected<T> = Parameters<Promise<T>['catch']>[0]

  catch(onRejected: OnRejected<unknown>): Observable
  ```

- 详情

  对订阅节点进行 catch，用法和 promise 保持一致，返回订阅节点的[ Observable ](#observable)实例。

- 示例

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $()
  observable$ = promise$.catch((error) => {
    console.log(error)
  })
  promise$.next(Promise.reject('error')) // 输出 error
  ```

## finally

- 类型

  ```typescript
  type OnFinally<T> = Parameters<Promise<T>['finally']>[0]

  finally(onFinally: OnFinally<unknown>): Observable
  ```

- 详情

  对订阅节点进行 finally，用法和 promise 保持一致，返回订阅节点的[ Observable ](#observable)实例

- 示例
  ```typescript
  import { $ } from 'pipeljs'
  const promise$ = $()
  observable$ = promise$.finally(() => {
    console.log('finally')
  })
  promise$.next(1) // 输出 finally
  ```

## pipe

- 类型

  ```typescript
  pipe(operator: Operator): Observable
  ```

- 详情

  对订阅节点进行 pipe，pipe 方法可以链式调用多个操作符，返回一个[ Observable ](#observable)实例

- 示例

  ```typescript
  import { $, delay } from 'pipeljs'
  const promise$ = $()
  promise$.pipe(delay(1000)).then((value) => {
    console.log(value)
  })
  ```

## use

- 类型

  `plugin`类型

  ```typescript
  type thenPlugin = (unsubscribe: () => void) => void
  type executePlugin = <T>(params: {
    result: Promise<T> | T
    set: (setter: (value: T) => Promise<void> | void) => Promise<T> | T
    root: boolean
    onfulfilled?: OnFulfilled
    onrejected?: OnRejected
    unsubscribe: () => void
  }) => Promise<any> | any

  type plugin: {
    then?: thenPlugin | thenPlugin[]
    thenAll?: thenPlugin | thenPlugin[]
    execute?: executePlugin | executePlugin[]
    executeAll?: executePlugin | executePlugin[]
  }
  ```

  `use`类型

  ```typescript
  use<P extends Plugin>(plugin: P): Stream<T, I, E & ChainReturn<P, T, E>> & E & ChainReturn<P, T, E>;
  ```

- 详情

  调用 use 可以使用四种插件: then 插件、execute 插件、thenAll 插件、executeAll 插件：

  - then 插件在[then](/cn/api/observable#then)方法被调用时执行。它们将当前节点的 unsubscribe 函数作为参数，可以实现统一的[取消订阅](/cn/guide/base.html#取消订阅)功能。
  - execute 插件在[execute](/cn/api/observable#then)方法被调用时执行。它们将当前节点的执行结果、可以生成 immutable 数据的 set 函数、当前节点的 unsubscribe 函数作为参数，返回的 promise 将被传递给下一个 execute 插件，最终返回的 promise 数据将传递给下一个的 then 节点。
  - thenAll 插件在根流及其所有子节点的 then 操作时触发，只能用于根流，子节点不能使用。
  - executeAll 插件在根流及其所有子节点的 execute 操作时触发，只能用于根流，子节点不能使用。

- 示例

  ```typescript
  import { $, delay } from 'pipeljs'

  const promise$ = $('1').use(delay)
  promise$.delay(1000).then((value) => {
    console.log(value)
  })

  promise$.next('2') // 1s后输出 2
  ```

## remove

- 类型

  ```typescript
    interface PluginParams {
        then?: thenPlugin | thenPlugin[];
        thenAll?: thenPlugin | thenPlugin[];
        execute?: executePlugin | executePlugin[];
        executeAll?: executePlugin | executePlugin[];
    }
    remove(plugin: PluginParams | PluginParams[]): void;
  ```

- 详情

  移除指定的 plugin，plugin 可以是 then、execute、thenAll、executeAll 插件

- 示例
  ```typescript
  import { $, console } from 'pipeljs'
  const promise$ = $('1').use(console)
  promise$.next('2') // 输出 2
  promise$.remove(console)
  promise$.next('3') // 不输出 3
  ```

## execute

- 类型

  ```typescript
  execute: () => void
  ```

- 详情

  主动执行当前节点，数据采用上一次流过该节点的数据，如果节点从来没有执行过，则不会执行。
  :::warning
  执行当前节点，当前节点 then 之后的节点也会执行，相当于在当前节点推流当前节点的老数据
  :::

- 示例

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $(1)
  const observable$ = promise$.then((value) => value + 1)
  observable$.then((value) => console.log(value + 1))

  observable$.execute() // 不输出
  promise$.next(1) //  输出 3
  observable$.execute() // 输出 3
  ```

## unsubscribe

- 类型

  ```typescript
  unsubscribe(): void
  ```

- 详情

  取消节点的订阅，不同于 promise 的无法取消，stream 的订阅可以随时取消
  ::: warning 警告
  取消当前节点订阅，当前节点的 then 之后的节点也会全部[取消订阅](/cn/guide/base.html#取消订阅)
  :::

- 示例

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $(1)
  const observable$ = promise$.then((value) => value + 1)
  observable$.then((value) => console.log(value + 1))

  promise$.next(2) // 输出 2

  observable$.unsubscribe()

  promise$.next(3) // 不输出
  ```

## afterUnsubscribe

- 类型

  ```typescript
  afterUnsubscribe(callback: () => void): void
  ```

- 详情

  设置取消节点订阅的回调函数

- 示例

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $(1)

  const observable$ = promise$.then((value) => value + 1)
  observable$.afterUnsubscribe(() => {
    console.log('unsubscribe')
  })

  observable$.unsubscribe() // 输出 unsubscribe
  ```

## offUnsubscribe

- 类型

  ```typescript
  offUnsubscribe(callback: () => void): void
  ```

- 详情

  取消通过 afterUnsubscribe 设置的回调函数

## afterComplete

- 类型

  ```typescript
    afterComplete(callback: (value: T, status: PromiseStatus) => void): void;
  ```

- 详情

  流结束后触发的回调函数，会早于订阅节点自动[取消订阅](/cn/guide/base.html#取消订阅)触发

- 示例

  ```typescript
  import { $ } from 'pipeljs'
  const promise$ = $(1)
  const observable$ = promise$.then((value) => console.log(value))

  observable$.afterComplete(() => console.log('complete'))
  observable$.afterUnsubscribe(() => console.log('unsubscribe'))

  promise$.next(2, true) // 输出 2 complete unsubscribe
  ```

## offComplete

- 类型

  ```typescript
  offComplete(callback: (value: T, status: PromiseStatus) => void): void
  ```

- 详情

  取消通过 afterComplete 设置的回调函数

## afterSetValue

- 类型

  ```typescript
  afterSetValue(callback: (value: T) => void)
  ```

- 详情
  当 observable 节点修改节点值后触发的回调函数

- 示例

  ```typescript
  import { $ } from 'pipeljs'
  const promise$ = $(1)
  promise$.afterSetValue((value) => console.log(value))
  promise$.next(2) // 输出 2
  ```

## offAfterSetValue

- 类型

  ```typescript
  offAfterSetValue(callback: (value: T) => void): void
  ```

- 详情

  取消通过 afterSetValue 设置的回调函数
