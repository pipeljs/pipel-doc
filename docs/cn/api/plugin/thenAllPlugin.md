# thenAllPlugin

全局 then 插件，在流链中每个节点创建子节点时都会执行，用于全局监控和处理节点的创建过程，只能在`Stream`节点上使用。

## 类型定义

```typescript
thenAllPlugin: (unsubscribe: () => void, observable: Observable<T>) => void
```

## 参数说明

- `unsubscribe`: 取消订阅函数，可以用来取消当前观察者节点
- `observable`: 新创建的观察者节点实例

## 详情

- **全局执行**: 在流链中每个节点调用 `then`、`catch`、`finally` 等方法创建子节点时都会执行
- **节点创建时机**: 在新的观察者节点创建后立即执行
- **只能在根节点使用**: 只能在根 Stream 节点上使用，子节点无法使用 thenAll 插件
- **传播到所有子节点**: 根节点的 thenAll 插件会影响整个流链的所有子节点创建

## 执行机制

从源码可以看出，thenAll 插件的执行逻辑：

```typescript
#runThenPlugin(observer: Observable) {
  const thenPlugins = this._root
    ? this._root.#plugin.thenAll.concat(this.#plugin.then)
    : this.#plugin.then
  thenPlugins.forEach((fn) => {
    safeCallback(fn)(() => observer.#unsubscribeObservable(), observer)
  })
}
```

- 合并根节点的 `thenAll` 插件和当前节点的 `then` 插件
- 依次执行每个插件，传入[取消订阅](/cn/guide/base.html#取消订阅)函数和新创建的观察者节点

## 注意事项

1. **只能在根节点使用**: thenAll 插件只能在根 Stream 节点上使用，子节点使用会抛出错误
2. **不会修改数据流**: thenAll 插件不会影响数据的传递和处理
3. **执行时机**: 在每个新节点创建后立即执行，不是在数据流动时执行
4. **取消订阅**: 可以使用提供的 `unsubscribe` 函数来取消特定节点的订阅
5. **性能考虑**: 由于会在每个节点创建时执行，应避免复杂的计算操作
