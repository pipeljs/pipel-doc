# 快速开始

## 安装

```bash
# npm
npm install pipeljs

# yarn
yarn add pipel

# pnpm
pnpm add pipel
```

## 使用

### 第一步：创建和订阅流

#### 创建空流

```typescript
import { $ } from 'pipel'

// 创建一个空流
const stream$ = $()

// 订阅流的数据变化
stream$.then((data) => {
  console.log('接收到数据:', data)
})

// 推送数据
stream$.next('第一条消息') // 输出：接收到数据: 第一条消息
stream$.next('第二条消息') // 输出：接收到数据: 第二条消息
```

#### 创建带初始值的流

```typescript
// 创建带初始值的流
const stream$ = $('初始值')

// 立即触发订阅（因为有初始值）
stream$.thenImmediate((data) => {
  console.log('接收到数据:', data) // 输出: 初始值
}) // 输出：接收到数据: 初始值

// 继续推送新数据
stream$.next('新数据') // 输出：接收到数据: 新数据
```

### 第二步：链式订阅

和 Promise 一样，pipel 支持链式操作：

```typescript
import { $ } from 'pipel'

const stream$ = $()

// 链式处理数据
stream$
  .then((data) => data.toUpperCase()) // 转大写
  .then((data) => `[${data}]`) // 添加括号
  .then((data) => {
    console.log(data)
  })

stream$.next('hello') // 输出: [HELLO]
stream$.next('world') // 输出: [WORLD]
```

### 第三步：推流

推流既可以采用 next 方法，也可以采用 set 方法，两者的区别在于：

- next 方法会直接推送新值，适合简单数据类型
- set 方法会自动创建不可变对象，适合复杂对象，自动处理深拷贝

#### 使用 next 推送新数据

```typescript
const stream$ = $(0)

stream$.then((value) => {
  console.log('当前值:', value)
})

stream$.next(1) // 输出: 当前值: 1
stream$.next(2) // 输出: 当前值: 2
```

#### 使用 set 进行不可变更新

```typescript
const stream$ = $({ key1: { key11: 'test' }, key2: { key22: 'test' } })
const oldValue = stream$.value

stream$.set((state) => {
  state.key2.key22 = 'test2' // 直接修改，pipel 会创建新的不可变对象
})

// 验证不可变性
console.log(oldValue === stream$.value) // false - 根对象引用已改变
console.log(oldValue?.key2 === stream$.value?.key2) // false - 修改的对象引用已改变
console.log(oldValue?.key1 === stream$.value?.key1) // true - 未修改的对象引用保持不变
```

### 第四步： 部分订阅

```typescript
import { $, change } from 'pipel'

const stream$ = $({ key1: { key11: 'test' }, key2: { key22: 'test' } })

stream$.pipe(change((state) => state.key2)).then((data) => {
  console.log('key2发生变化')
})

stream$.set((state) => {
  state.key1.key11 = 'test1'
}) // 没有输出

stream$.set((state) => {
  state.key2.key22 = 'test2'
}) // 输出：key2发生变化
```

### 第五步：条件订阅

```typescript
import { $, filter } from 'pipel'
const stream$ = $()

// 只处理偶数
stream$.pipe(filter((num) => num % 2 === 0)).then((evenNum) => {
  console.log('偶数:', evenNum)
})

stream$.next(1) // 不输出
stream$.next(2) // 输出: 偶数: 2
stream$.next(3) // 不输出
stream$.next(4) // 输出: 偶数: 4
```

### 第六步：流的组合

#### 合并多个流的最新值

```typescript
import { $, combine } from 'pipel'

const name$ = $('john')
const age$ = $(25)

// 合并两个流的最新值
const user$ = combine(name$, age$)

user$.then(([name, age]) => {
  console.log(`用户: ${name}, 年龄: ${age}`)
})

// 当且仅当所有流都推送过数据后，才会输出
name$.next('andy') // 不输出
age$.next(30) // 输出: 用户: andy, 年龄: 30
name$.next('lucy') // 输出: 用户: lucy, 年龄: 30
age$.next(31) // 输出: 用户: lucy, 年龄: 31
```

#### 等待所有流完成

```typescript
import { $, finish } from 'pipel'

const task1$ = $()
const task2$ = $()
const task3$ = $()

// 等待所有任务完成
const allTasks$ = finish(task1$, task2$, task3$)

allTasks$.then(([result1, result2, result3]) => {
  console.log('所有任务完成:', { result1, result2, result3 })
})

// 完成各个任务
task1$.next('任务1完成', true) // true 表示流结束
task2$.next('任务2完成', true)
task3$.next('任务3完成', true)
// 输出: 所有任务完成: { result1: "任务1完成", result2: "任务2完成", result3: "任务3完成" }
```

### 第七步：实际应用场景

#### 用户输入防抖

```typescript
import { $, throttle } from 'pipel'

const searchInput$ = $()

// 使用节流插件，300ms 内只处理最后一次输入
searchInput$.use(throttle(300)).then((keyword) => {
  console.log('搜索:', keyword)
  // 执行搜索逻辑
})

// 模拟用户快速输入
searchInput$.next('f')
searchInput$.next('fl')
searchInput$.next('flu')
searchInput$.next('pipel')
// 只会输出最后一次: 搜索: pipel
```

#### 对象状态管理

```typescript
import { $ } from 'pipel'

// 应用状态
const appState$ = $({
  user: null,
  loading: false,
  error: null,
})

// 监听用户状态变化
appState$
  .get((state) => state.user)
  .then((user) => {
    if (user) {
      console.log('用户已登录:', user.name)
    } else {
      console.log('用户未登录')
    }
  })

// 监听加载状态
appState$
  .get((state) => state.loading)
  .then((loading) => {
    console.log(loading ? '加载中...' : '加载完成')
  })

// 模拟登录流程
appState$.set((state) => {
  state.loading = true
})

setTimeout(() => {
  appState$.set((state) => {
    state.loading = false
    state.user = { name: 'john', id: 1 }
  })
}, 1000)
```

### 常见问题

#### 如何取消订阅？

```typescript
const stream$ = $()
const observable$ = stream$.then((data) => console.log(data))

// 取消订阅
observable$.unsubscribe()
```

#### 如何处理错误？

```typescript
const stream$ = $()

stream$.then(
  (data) => console.log('成功:', data),
  (error) => console.log('错误:', error)
)

stream$.next('正常数据')
stream$.next(Promise.reject('错误信息'))
```
