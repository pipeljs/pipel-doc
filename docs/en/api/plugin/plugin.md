# Plugin

Plugin is a mechanism for extending the functionality of streams. It allows you to add custom behavior to streams without modifying the core stream implementation.

## Basic Usage

```typescript
import { $ } from 'pipel'

const stream = $([1, 2, 3]).plugin(customPlugin).subscribe(console.log)
```

## Plugin Interface

A plugin is a function that takes a stream and returns a new stream:

```typescript
type Plugin<T, R> = (stream: Stream<T>) => Stream<R>
```

## Creating Custom Plugins

You can create custom plugins by implementing the plugin interface:

```typescript
function customPlugin<T>(stream: Stream<T>): Stream<T> {
  return stream.map((value) => {
    console.log('Processing:', value)
    return value
  })
}
```

## Built-in Plugins

Pipel provides several built-in plugins:

- `consoleAll` - Log all values in the stream
- `consoleNode` - Log specific node values
- `debugAll` - Debug all stream operations
- `debugNode` - Debug specific node operations
- `delayExec` - Delay execution of stream operations
- `executeAllPlugin` - Execute all plugins in sequence
- `executePlugin` - Execute a specific plugin
- `thenAllPlugin` - Execute plugins after stream completion
- `thenPlugin` - Execute a plugin after stream completion

## Plugin Composition

Plugins can be composed together to create more complex behavior:

```typescript
const stream = $([1, 2, 3]).plugin(debugAll).plugin(consoleAll).plugin(delayExec(1000))
```

## Advanced Usage

Plugins can also accept parameters and maintain state:

```typescript
function createCounterPlugin(initialCount = 0) {
  let count = initialCount

  return function counterPlugin<T>(stream: Stream<T>): Stream<T> {
    return stream.map((value) => {
      count++
      console.log(`Item ${count}:`, value)
      return value
    })
  }
}

const stream = $([1, 2, 3]).plugin(createCounterPlugin(10))
```
