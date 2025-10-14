# thenPlugin

在创建子节点时触发的插件，主要用于节点生命周期管理、自动取消订阅和资源清理等操作。

## 类型定义

```typescript
type thenPluginFn<T> = (unsubscribe: () => void, observable: Observable<T>) => void
```

## 参数说明

- `unsubscribe`: 取消订阅函数，调用后会停止当前节点的数据处理
- `observable`: 新创建的子节点 Observable 实例

## 详情

- **节点创建时触发**: 在调用 `then`方法创建子节点时执行
- **生命周期管理**: 可以控制节点的生命周期，实现自动[取消订阅](/cn/guide/base.html#取消订阅)
- **资源清理**: 适合执行清理操作、定时器管理等
- **节点级别**: 每个节点都可以使用 `then` 插件，不限于根节点

## 执行机制

1. **触发时机**: 在 `#thenObserver` 方法中，创建新的子节点后立即执行
2. **执行顺序**: 如果是根节点，先执行 `thenAll` 插件，再执行当前节点的 `then` 插件
3. **参数传递**: 传递 `unsubscribe` 函数和新创建的 `observable` 实例

## 使用场景

### 场景 1：定时自动取消订阅

```typescript
import { $ } from 'pipeljs'

// 创建定时取消订阅插件
const autoUnsubscribePlugin = {
  then: (unsubscribe) => {
    // 5秒后自动取消订阅
    setTimeout(unsubscribe, 5000)
  },
}

const stream$ = $().use(autoUnsubscribePlugin)

const observer$ = stream$.then((data) => {
  console.log('处理数据:', data)
})

// 正常处理
stream$.next('hello') // 输出: 处理数据: hello
stream$.next('world') // 输出: 处理数据: world

// 5秒后自动取消订阅
setTimeout(() => {
  stream$.next('timeout') // 不会输出，已取消订阅
}, 6000)
```

### 场景 2：Vue 组件生命周期集成

```typescript
import { getCurrentScope, onScopeDispose } from 'vue'
import { $ } from 'pipeljs'

// Vue 组件自动清理插件
const vueLifecyclePlugin = {
  then: (unsubscribe) => {
    // 在 Vue 组件作用域内自动清理
    if (getCurrentScope()) {
      onScopeDispose(() => {
        console.log('Vue 组件销毁，自动取消订阅')
        unsubscribe()
      })
    }
  },
}

// 在 Vue 组件中使用
const stream$ = $().use(vueLifecyclePlugin)

const dataProcessor$ = stream$
  .then((data) => data.toUpperCase())
  .then((data) => {
    console.log('处理结果:', data)
    return data
  })

stream$.next('hello') // 输出: 处理结果: HELLO
// 组件销毁时自动清理所有订阅
```

### 场景 3：条件性取消订阅

```typescript
import { $ } from 'pipeljs'

// 条件取消订阅插件
const conditionalUnsubscribePlugin = {
  then: (unsubscribe, observable) => {
    // 监听特定条件
    const checkCondition = () => {
      // 假设有全局状态管理
      if (window.appState?.shouldStopProcessing) {
        console.log('检测到停止条件，取消订阅')
        unsubscribe()
      }
    }

    // 每秒检查一次条件
    const intervalId = setInterval(checkCondition, 1000)

    // 当节点被取消订阅时，清理定时器
    observable.afterUnsubscribe(() => {
      clearInterval(intervalId)
    })
  },
}

const stream$ = $().use(conditionalUnsubscribePlugin)

stream$.then((data) => {
  console.log('处理数据:', data)
})

stream$.next('data1') // 正常处理
// 当 window.appState.shouldStopProcessing = true 时自动停止
```
