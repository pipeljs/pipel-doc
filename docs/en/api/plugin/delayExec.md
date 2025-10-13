# delayExec

delayExec 是一个延迟执行插件，用于延迟流中操作的执行时间。

## 类型定义

```typescript
delayExec: (delay: number) => {
  execute: ({
    result,
    status,
    onfulfilled,
    onrejected,
    root,
  }: {
    result: Promise<any> | any
    status: PromiseStatus | null
    onfulfilled?: OnFulfilled
    onrejected?: OnRejected
    root: boolean
  }) => Promise<any>
}
```

## 参数

- `delay` (必需): 延迟时间，单位为毫秒

## 详细说明

- 延迟指定时间后再执行后续操作
- 对于同步值，会将其包装为 Promise 并延迟执行
- 对于 Promise 值，会等待 Promise 解析后再延迟执行
- 返回一个 Promise，在延迟时间后解析为原始结果
- 不修改数据流的值，只影响执行时机

## 示例

### 场景 1：基本延迟执行

```typescript
import { $ } from 'pipel'
import { delayExec } from 'pipel'

const stream$ = $().use(delayExec(1000)) // 延迟 1 秒

stream$.then((value) => {
  console.log('执行时间:', Date.now())
  return value
})

console.log('开始时间:', Date.now())
stream$.next(1)
// 1 秒后输出: 执行时间: [时间戳]
```

### 场景 2：流链中的延迟执行

```typescript
import { $ } from 'pipel'
import { delayExec } from 'pipel'

const promise$ = $()

promise$
  .then((value) => {
    console.log('第一步:', value)
    return value + 1
  })
  .use(delayExec(500)) // 延迟 500ms
  .then((value) => {
    console.log('第二步:', value)
    return value + 1
  })

promise$.next(1)
// 立即输出: 第一步: 1
// 500ms 后输出: 第二步: 2
```

### 场景 3：多个延迟执行

```typescript
import { $ } from 'pipel'
import { delayExec } from 'pipel'

const promise$ = $()
  .use(delayExec(200))
  .then((value) => value + 1)
  .use(delayExec(300))
  .then((value) => value + 1)

console.log('开始:', Date.now())
promise$.next(1).then((result) => {
  console.log('结束:', Date.now(), '结果:', result)
})
// 500ms 后输出: 结束: [时间戳] 结果: 3
```

### 场景 4：与 Promise 结合

```typescript
import { $ } from 'pipel'
import { delayExec } from 'pipel'

const stream$ = $().use(delayExec(1000))

// 传入 Promise
const promise = Promise.resolve(42)
stream$.next(promise).then((result) => {
  console.log('Promise 结果:', result)
})
// 1 秒后输出: Promise 结果: 42

// 传入同步值
stream$.next(100).then((result) => {
  console.log('同步值结果:', result)
})
// 1 秒后输出: 同步值结果: 100
```

### 场景 5：错误处理

```typescript
import { $ } from 'pipel'
import { delayExec } from 'pipel'

const stream$ = $()
  .use(delayExec(500))
  .then(
    (value) => {
      console.log('成功:', value)
      return value
    },
    (error) => {
      console.log('错误:', error.message)
      throw error
    }
  )

// 传入被拒绝的 Promise
const rejectedPromise = Promise.reject(new Error('测试错误'))
stream$.next(rejectedPromise)
// 500ms 后输出: 错误: 测试错误
```

### 场景 6：动态延迟时间

```typescript
import { $ } from 'pipel'
import { delayExec } from 'pipel'

function createDelayedStream(delay: number) {
  return $().use(delayExec(delay))
}

const fastStream = createDelayedStream(100)
const slowStream = createDelayedStream(1000)

console.log('开始时间:', Date.now())

fastStream.next('快速').then((result) => {
  console.log('快速完成:', Date.now(), result)
})

slowStream.next('慢速').then((result) => {
  console.log('慢速完成:', Date.now(), result)
})
// 100ms 后输出: 快速完成: [时间戳] 快速
// 1000ms 后输出: 慢速完成: [时间戳] 慢速
```

### 场景 7：移除插件

```typescript
import { $ } from 'pipel'
import { delayExec } from 'pipel'

const plugin = delayExec(1000)
const stream$ = $().use(plugin)

stream$.then((value) => {
  console.log('延迟执行:', value)
  return value
})

stream$.next(1)
// 1 秒后输出: 延迟执行: 1

stream$.remove(plugin)
stream$.next(2)
// 立即执行，无延迟
```

### 场景 8：性能测试

```typescript
import { $ } from 'pipel'
import { delayExec } from 'pipel'

async function performanceTest() {
  const delays = [100, 200, 300, 500, 1000]
  
  for (const delay of delays) {
    const start = Date.now()
    const stream$ = $().use(delayExec(delay))
    
    await stream$.next(`延迟 ${delay}ms`)
    const end = Date.now()
    
    console.log(`预期延迟: ${delay}ms, 实际延迟: ${end - start}ms`)
  }
}

performanceTest()