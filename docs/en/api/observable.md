<script setup>
import Stream from '../../components/stream.vue'
import Observable from '../../components/observable.vue'
</script>

# Observable

<Observable />

Observable instance's then, thenOnce, thenImmediate, pipe methods return Observable instances

## value

- Type
  ```typescript
  value: T | undefined
  ```
- Details

  Current node's data

## status

- Type
  ```typescript
  enum PromiseStatus {
    PENDING = 'pending',
    RESOLVED = 'resolved',
    REJECTED = 'rejected',
  }
  status: PromiseStatus | null
  ```
- Details

  Current node's status, generally in pending, fulfilled, rejected states. When the stream hasn't passed through this node or the node has been [unsubscribed](/en/guide/base.html#unsubscribe), the status is null

## then

- Type

  ```typescript
  type OnFulfilled<T> = Parameters<Promise<T>['then']>[0]
  type OnRejected<T> = Parameters<Promise<T>['catch']>[0]

  then<T>(
    onFulfilled: OnFulfilled<T>,
    onRejected?: OnRejected<unknown>,
  ): Observable
  ```

- Details

  then subscriber, usage consistent with promise, returns the subscribed node's [Observable](#observable) instance

- Example

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $('1')
  const observable$ = promise$.then((value) => Number(value)) // Automatically infers observable.value type as number
  ```

## thenSet

- Type
  ```typescript
    $then(setter: (value: T) => void | Promise<void>): Observable<T extends PromiseLike<infer V> ? V : T, E> & E;
  ```
- Details

  thenSet subscriber, unlike then subscriber, thenSet subscriber can only perform immutable operations on data and cannot handle reject errors from previous node, returns the subscribed node's [Observable](#observable) instance.

- Example

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

- Type

  ```typescript
  type OnFulfilled<T> = Parameters<Promise<T>['then']>[0]
  type OnRejected<T> = Parameters<Promise<T>['catch']>[0]

  thenOnce<T>(
    onFulfilled: OnFulfilled<T>,
    onRejected?: OnRejected<unknown>,
  ): Observable
  ```

- Details

  thenOnce differs from then method in that once the subscribed node executes, it will automatically [unsubscribe](/en/guide/base.html#unsubscribe).

- Example

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $('1')
  const observable$ = promise$.thenOnce((value) => console.log(value))
  promise$.next('2') // Output 2
  promise$.next('3') // Won't output 3
  ```

## thenOnceSet

- Type
  ```typescript
    $thenOnce(setter: (value: T) => void | Promise<void>): Observable<T extends PromiseLike<infer V>? V : T, E> & E;
  ```
  thenOnceSet differs from thenSet method in that once the subscribed node executes, it will automatically unsubscribe.

## thenImmediate

- Type

  ```typescript
  type OnFulfilled<T> = Parameters<Promise<T>['then']>[0]
  type OnRejected<T> = Parameters<Promise<T>['catch']>[0]

  thenImmediate<T>(
    onFulfilled: OnFulfilled<T>,
    onRejected?: OnRejected<unknown>,
  ): Observable
  ```

- Details

  thenImmediate differs from then method in that:

  - If parent node is Stream instance and has initial value, using thenImmediate will immediately trigger subscribed child node's execute
  - If parent subscribed node is Observable and has executed, using thenImmediate will immediately trigger subscribed child node's execute

- Example

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $('1')
  const observable$ = promise$.thenImmediate((value) => console.log(value)) // Output 1
  ```

## thenImmediateSet

- Type
  ```typescript
    $thenImmediate(setter: (value: T) => void | Promise<void>): Observable<T extends PromiseLike<infer V>? V : T, E> & E;
  ```
  thenImmediateSet differs from thenSet method in that if parent subscribed node has executed, using thenImmediateSet will immediately trigger subscribed child node's execute.

## catch

- Type

  ```typescript
  type OnRejected<T> = Parameters<Promise<T>['catch']>[0]

  catch(onRejected: OnRejected<unknown>): Observable
  ```

- Details

  Catch for subscribed node, usage consistent with promise, returns the subscribed node's [Observable](#observable) instance.

- Example

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $()
  observable$ = promise$.catch((error) => {
    console.log(error)
  })
  promise$.next(Promise.reject('error')) // Output error
  ```

## finally

- Type

  ```typescript
  type OnFinally<T> = Parameters<Promise<T>['finally']>[0]

  finally(onFinally: OnFinally<unknown>): Observable
  ```

- Details

  Finally for subscribed node, usage consistent with promise, returns the subscribed node's [Observable](#observable) instance

- Example
  ```typescript
  import { $ } from 'pipeljs'
  const promise$ = $()
  observable$ = promise$.finally(() => {
    console.log('finally')
  })
  promise$.next(1) // Output finally
  ```

## pipe

- Type

  ```typescript
  pipe(operator: Operator): Observable
  ```

- Details

  Pipe for subscribed node, pipe method can chain multiple operators, returns an [Observable](#observable) instance

- Example

  ```typescript
  import { $, delay } from 'pipeljs'
  const promise$ = $()
  promise$.pipe(delay(1000)).then((value) => {
    console.log(value)
  })
  ```

## use

- Type

  `plugin` type

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

  `use` type

  ```typescript
  use<P extends Plugin>(plugin: P): Stream<T, I, E & ChainReturn<P, T, E>> & E & ChainReturn<P, T, E>;
  ```

- Details

  Calling use can use four types of plugins: then plugin, execute plugin, thenAll plugin, executeAll plugin:

  - then plugins execute when [then](/en/api/observable#then) method is called. They take the current node's unsubscribe function as parameter, can implement unified [unsubscribe](/en/guide/base.html#unsubscribe) functionality.
  - execute plugins execute when [execute](/en/api/observable#then) method is called. They take the current node's execution result, set function that can generate immutable data, current node's unsubscribe function as parameters, returned promise will be passed to next execute plugin, finally returned promise data will be passed to next then node.
  - thenAll plugins trigger on then operations of root stream and all its child nodes, can only be used on root stream, child nodes cannot use.
  - executeAll plugins trigger on execute operations of root stream and all its child nodes, can only be used on root stream, child nodes cannot use.

- Example

  ```typescript
  import { $, delay } from 'pipeljs'

  const promise$ = $('1').use(delay)
  promise$.delay(1000).then((value) => {
    console.log(value)
  })

  promise$.next('2') // Output 2 after 1s
  ```

## remove

- Type

  ```typescript
    interface PluginParams {
        then?: thenPlugin | thenPlugin[];
        thenAll?: thenPlugin | thenPlugin[];
        execute?: executePlugin | executePlugin[];
        executeAll?: executePlugin | executePlugin[];
    }
    remove(plugin: PluginParams | PluginParams[]): void;
  ```

- Details

  Remove specified plugin, plugin can be then, execute, thenAll, executeAll plugin

- Example
  ```typescript
  import { $, console } from 'pipeljs'
  const promise$ = $('1').use(console)
  promise$.next('2') // Output 2
  promise$.remove(console)
  promise$.next('3') // Won't output 3
  ```

## execute

- Type

  ```typescript
  execute: () => void
  ```

- Details

  Manually execute current node, data uses the last data that flowed through this node, if node has never executed, it won't execute.
  :::warning
  Execute current node, nodes after current node's then will also execute, equivalent to pushing old data of current node at current node
  :::

- Example

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $(1)
  const observable$ = promise$.then((value) => value + 1)
  observable$.then((value) => console.log(value + 1))

  observable$.execute() // No output
  promise$.next(1) //  Output 3
  observable$.execute() // Output 3
  ```

## unsubscribe

- Type

  ```typescript
  unsubscribe(): void
  ```

- Details

  Unsubscribe node, unlike promise's inability to cancel, stream's subscription can be cancelled anytime
  ::: warning Warning
  Unsubscribe current node, all nodes after current node's then will also be [unsubscribed](/en/guide/base.html#unsubscribe)
  :::

- Example

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $(1)
  const observable$ = promise$.then((value) => value + 1)
  observable$.then((value) => console.log(value + 1))

  promise$.next(2) // Output 2

  observable$.unsubscribe()

  promise$.next(3) // No output
  ```

## afterUnsubscribe

- Type

  ```typescript
  afterUnsubscribe(callback: () => void): void
  ```

- Details

  Set callback function for node unsubscription

- Example

  ```typescript
  import { $ } from 'pipeljs'

  const promise$ = $(1)

  const observable$ = promise$.then((value) => value + 1)
  observable$.afterUnsubscribe(() => {
    console.log('unsubscribe')
  })

  observable$.unsubscribe() // Output unsubscribe
  ```

## offUnsubscribe

- Type

  ```typescript
  offUnsubscribe(callback: () => void): void
  ```

- Details

  Cancel callback function set through afterUnsubscribe

## afterComplete

- Type

  ```typescript
    afterComplete(callback: (value: T, status: PromiseStatus) => void): void;
  ```

- Details

  Callback function triggered after stream ends, will trigger earlier than subscribed node's automatic [unsubscribe](/en/guide/base.html#unsubscribe)

- Example

  ```typescript
  import { $ } from 'pipeljs'
  const promise$ = $(1)
  const observable$ = promise$.then((value) => console.log(value))

  observable$.afterComplete(() => console.log('complete'))
  observable$.afterUnsubscribe(() => console.log('unsubscribe'))

  promise$.next(2, true) // Output 2 complete unsubscribe
  ```

## offComplete

- Type

  ```typescript
  offComplete(callback: (value: T, status: PromiseStatus) => void): void
  ```

- Details

  Cancel callback function set through afterComplete

## afterSetValue

- Type

  ```typescript
  afterSetValue(callback: (value: T) => void)
  ```

- Details
  Callback function triggered after observable node modifies node value

- Example

  ```typescript
  import { $ } from 'pipeljs'
  const promise$ = $(1)
  promise$.afterSetValue((value) => console.log(value))
  promise$.next(2) // Output 2
  ```

## offAfterSetValue

- Type

  ```typescript
  offAfterSetValue(callback: (value: T) => void): void
  ```

- Details

  Cancel callback function set through afterSetValue
