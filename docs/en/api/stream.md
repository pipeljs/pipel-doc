<script setup>
import Stream from '../../components/stream.vue'
</script>

# Stream

Stream inherits from [Observable](/en/api/observable). In addition to Observable's properties and methods, the following methods are newly added

<Stream />

## next

- Type

  ```typescript
  next(payload: any, finishFlag?: boolean): void;
  ```

- Details

  - Current stream pushes data, payload is the data. When it's Promise.reject(xxx) or Promise.reject(xxx), subsequent then behaves consistently with promise's then;
  - The second parameter indicates whether the current stream ends. When set to true, subsequent set and next will no longer execute, and after the stream executes each node, it will trigger the node's afterComplete callback function, then automatically call the node's unsubscribe method

- Example
  ```typescript
  import { $ } from 'pipel'
  const promise$ = $('1')
  promise$.then((value) => {
    console.log(value)
  })
  promise$.next('2') // Output 2
  ```

## set

- Type
  ```typescript
    set(setter: (value: T) => void, finishFlag?: boolean): void;
  ```
- Details

  Current stream pushes data. The difference from next is that set receives a setter (can be synchronous or asynchronous), pushing a new immutable data; the second parameter indicates whether the current stream ends. When set to true, subsequent set and next will no longer execute

- Example

  ```typescript
  import { $ } from 'pipel'
  const promise$ = $({ a: 1, b: { c: 2 } })

  // Keep old data
  const oldValue = promise$.value

  // Set new data
  promise$.set((value) => {
    value.a = 2
  })

  // Get new data
  const newValue = promise$.value

  oldValue === newValue // ❌
  oldValue.b === newValue.b // ✅
  ```

## complete

- Type

  ```typescript
  complete: () => void
  ```

- Details

  After calling the complete method, the stream will end. Subsequent next and set will no longer execute, and it will trigger all nodes' afterComplete callback functions, then automatically call the nodes' unsubscribe method

- Example

  ```typescript
  import { $, console } from 'pipel'
  const promise$ = $()
  promise$.afterComplete(() => {
    console.log('complete')
  })
  promise$.complete() // Output complete
  ```

## pause

- Type

  ```typescript
  pause: () => void
  ```

- Details

  Pause the current stream. After executing the pause method, all subscribed nodes will not execute

- Example

  ```typescript
  import { $, console } from 'pipel'

  const promise$ = $('1')
  promise$.then((value) => {
    console.log(value)
  })

  promise$.next('2') // Output 2
  promise$.pause()
  promise$.next('3') // Won't output 3
  ```

## restart

- Type

  ```typescript
  restart: () => void
  ```

- Details

  Restart the current stream. After executing the restart method, all subscribed nodes start accepting stream pushes and execute

- Example

  ```typescript
  import { $, console } from 'pipel'

  const promise$ = $('1')
  promise$.then((value) => {
    console.log(value)
  })

  promise$.pause()
  promise$.next('2') // Won't output 2
  promise$.restart()
  promise$.next('3') // Output 3
  ```
