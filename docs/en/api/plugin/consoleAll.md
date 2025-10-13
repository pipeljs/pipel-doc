# consoleAll

consoleAll 是一个将流中所有值输出到控制台的插件。

## 用法

```typescript
import { $, consoleAll } from 'pipel'

$([1, 2, 3]).plugin(consoleAll).subscribe()
```

## 输出

```
1
2
3
```

## 参数

该插件不接受任何参数。

## 返回值

返回原始流，但会产生控制台日志的副作用。

## 示例

### 基本用法

```typescript
import { $, consoleAll } from 'pipel'

// 输出数组中的所有元素
$([1, 2, 3, 4, 5]).plugin(consoleAll).subscribe()
// 输出: 1, 2, 3, 4, 5
```

### 与其他操作符结合

```typescript
import { $, consoleAll } from 'pipel'

$([1, 2, 3, 4, 5])
  .map((x) => x * 2)
  .plugin(consoleAll) // 输出映射后的值
  .filter((x) => x > 5)
  .subscribe()
// 输出: 2, 4, 6, 8, 10
```

### 调试流程

```typescript
import { $, consoleAll } from 'pipel'

$([1, 2, 3])
  .plugin(consoleAll) // 查看原始值
  .map((x) => x * 2)
  .plugin(consoleAll) // 查看映射后的值
  .subscribe()
// 输出: 1, 2, 3, 2, 4, 6
```
