# delayExec

延迟执行插件，在当前节点延迟指定时间后再将处理结果推送给子节点。

## 类型定义

```typescript
delayExec: (delayTime: number) => {
  execute: ({ result }: { result: Promise<any> | any }) => Promise<unknown>
}
```

## 参数说明

- `delayTime` (必需): 延迟时间，单位为毫秒

## 详情

- 只在当前节点执行，不会传播到子节点
- 将结果包装成 `Promise`，在指定时间后 `resolve`
- 对于 `Promise` 类型的结果，会等待 `Promise` 解析后再开始延迟计时
- 精确控制数据流的时间节奏

## 示例

### 场景 1：基础延迟

```typescript
import { $ } from 'pipel'

const stream$ = $().use(delayExec(100))

stream$.then((value) => {
  console.log(value)
})

stream$.next(1)
// 等待 100ms 后输出: 1
```

### 场景 2：与其他插件结合

```typescript
import { $, consoleNode } from 'pipel'

const promise$ = $().use(delayExec(100), consoleNode())

promise$
  .then((value) => value + 1)
  .use(delayExec(100), consoleNode())
  .then((value) => value + 1)
  .use(delayExec(100), consoleNode())

promise$.next(1)
// 等待 100ms 后输出: resolve 1
// 等待 200ms 后输出: resolve 2
// 等待 300ms 后输出: resolve 3
```

### 场景 3：流水线延迟处理

```typescript
import { $ } from 'pipel'

const processingStream$ = $()

// 第一步：数据预处理（延迟 200ms）
const preprocessed$ = processingStream$.use(delayExec(200)).then((data) => {
  console.log('预处理完成:', data)
  return { ...data, preprocessed: true }
})

// 第二步：数据验证（延迟 300ms）
const validated$ = preprocessed$.use(delayExec(300)).then((data) => {
  console.log('验证完成:', data)
  return { ...data, validated: true }
})

// 第三步：数据存储（延迟 150ms）
const stored$ = validated$.use(delayExec(150)).then((data) => {
  console.log('存储完成:', data)
  return { ...data, stored: true }
})

processingStream$.next({ id: 1, content: 'test data' })
// 200ms 后输出: 预处理完成: { id: 1, content: 'test data', preprocessed: true }
// 300ms 后输出: 验证完成: { id: 1, content: 'test data', preprocessed: true, validated: true }
// 150ms 后输出: 存储完成: { id: 1, content: 'test data', preprocessed: true, validated: true, stored: true }
```
