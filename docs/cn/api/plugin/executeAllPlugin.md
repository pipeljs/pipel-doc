# executeAllPlugin

全局执行插件，在流链中每个节点处理数据时都会执行，用于全局监控和处理数据流的执行过程, 只能在`Stream`节点上使用。

## 类型定义

```typescript
executeAllPlugin: (params: {
  result: Promise<T> | T
  set: (setter: (state: T) => Promise<void> | void) => Promise<T> | T
  root: boolean
  status: PromiseStatus | null
  onfulfilled?: OnFulfilled
  onrejected?: OnRejected
  unsubscribe: () => void
}) => Promise<any> | any
```

## 参数说明

- `result`: 当前节点的执行结果（可能是 Promise 或同步值）
- `set`: 不可变状态设置函数，用于安全地修改对象状态
- `root`: 是否为根节点
- `status`: 当前节点的状态（pending、resolved、rejected）
- `onfulfilled`: 当前节点的成功处理函数
- `onrejected`: 当前节点的错误处理函数
- `unsubscribe`: 取消订阅函数

## 返回值

返回处理后的结果，可以是同步值或 Promise。如果返回值不为 `undefined`，会替换原始结果。

## 执行机制

从源码可以看出，executeAll 插件的执行逻辑：

```typescript
#runExecutePlugin(result: any) {
  const executeAll = this._root
    ? this._root.#plugin.executeAll.concat(this.#plugin.execute)
    : this.#plugin.execute
  if (!executeAll.length) return result

  const context = {
    result,
    status: this.status,
    set: (setter) => this.#set(result, setter),
    root: !this.#parent,
    onfulfilled: this.#resolve,
    onrejected: this.#reject,
    unsubscribe: () => this.#unsubscribeObservable(),
  }

  // use reduce from left to right to compose plugins
  return executeAll.reduce((prevResult, plugin) => {
    return safeCallback(() => plugin({ ...context, result: prevResult }))() ?? prevResult
  }, context.result)
}
```

- 合并根节点的 `executeAll` 插件和当前节点的 `execute` 插件
- 使用 `reduce` 从左到右依次执行插件
- 每个插件接收前一个插件的结果作为输入

## 详情

- **全局执行**: 在流链中每个节点处理数据时都会执行
- **数据处理**: 可以修改、监控或记录流经的数据
- **只能在根节点使用**: 只能在根 Stream 节点上使用，子节点无法使用 executeAll 插件
- **链式处理**: 多个 executeAll 插件按顺序执行，后一个插件接收前一个插件的结果
