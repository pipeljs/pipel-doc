# 使用插件

## 插件类型

pipel 支持四种类型插件：then、thenAll、execute、executeAll

### then 插件

在创建订阅节点时触发，接收取消订阅函数和当前观察者实例作为参数

```typescript
import { $ } from 'pipeljs'

// 自定义then插件, 1s后取消节点订阅
const thenPlugin = {
  then: (unsubscribe) => {
    setTimeout(unsubscribe, 1000)
  },
}

const promise$ = $(1).use(thenPlugin)

promise$.then((data) => {
  console.log(data)
})

promise$.next(2) // 输出2
sleep(1000)
promise$.next(3) // 不输出
```

### thenAll 插件

流所有的节点创建订阅时触发，只能用于 Stream 流， Observable 流节点使用会抛出错误

```typescript
import { $ } from 'pipeljs'

// 自定义thenAll插件, 为流所有的节点的then操作添加统一处理
const thenAllPlugin = {
  thenAll: (unsubscribe) => {
    console.log('thenAll插件被触发')
    // 可以在这里添加统一的逻辑，比如统一的取消订阅处理
  },
}

const promise$ = $(1).use(thenAllPlugin)

// 第一个then节点
promise$.then((data) => {
  console.log('第一个then:', data)
  return data + 1
})

// 第二个then节点（子节点）
promise$.then((data) => {
  console.log('第二个then:', data)
  return data * 2
})

// 第三个then节点（子节点）
promise$.then((data) => {
  console.log('第三个then:', data)
})

promise$.next(2)
// 输出:
// thenAll插件被触发
// thenAll插件被触发
// thenAll插件被触发
// 第一个then: 2
// 第二个then: 3
// 第三个then: 6
```

### execute 插件

在节点执行时触发，可以修改执行结果，如果节点有多个 execute 插件，会按照插件的顺序依次执行, 前一个插件的结果会作为下一个插件的输入并将最后的结果作为当前节点的返回值。

```typescript
import { $ } from 'pipeljs'

// 自定义execute插件, 执行节点时修改结果
const executePlugin = {
  execute: ({ result, root }) => {
    console.log(`执行节点 - 是否Stream节点: ${root}, 结果: ${result}`)
    return result + 1
  },
}

const promise$ = $().use(executePlugin)

promise$.then((data) => console.log(data))

promise$.next(1)
// 输出: 执行节点 - 是否Stream节点: true, 结果: 1
// 输出: 2
```

### executeAll 插件

在节点执行时触发，可以修改执行结果，只能用于 Stream 流， Observable 流节点使用会抛出错误。

如果节点有多个 executeAll 插件，会按照插件的顺序依次执行, 前一个插件的结果会作为下一个插件的输入并将最后的结果作为当前节点的返回值。

```typescript
import { $ } from 'pipeljs'

// 自定义executeAll插件, 为根流及其所有子节点的execute操作添加统一处理
const executeAllPlugin = {
  executeAll: ({ result, root, onfulfilled, onrejected }) => {
    // 跳过传递节点（没有处理函数的节点）
    if (!root && !onfulfilled && !onrejected) {
      return result
    }
    console.log('executeAll插件被触发，结果:', result, '是否Stream节点:', root)
    return result
  },
}

const promise$ = $().use(executeAllPlugin)

promise$
  .then((data) => data + 1)
  .then() // onfulfilled = undefined, onrejected = undefined
  .then((data) => data * 2)

promise$.next(1)
// 输出:
// executeAll插件被触发，结果: 1 是否Stream节点: true
// executeAll插件被触发，结果: 2 是否Stream节点: false
// executeAll插件被触发，结果: 4 是否Stream节点: false
```

## 插件使用注意

- thenAll 和 executeAll 插件只能用于 Stream 流，Observable 流节点使用会抛出错误
- then 和 execute 插件可以用于任何节点
- 插件可以通过 use 方法添加，通过 remove 方法移除
