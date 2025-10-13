# Using Plugins

## Plugin Types

pipel supports four types of plugins: then, thenAll, execute, and executeAll.

### then Plugin

Triggered when creating a subscription node, receives the unsubscribe function and the current observer instance as parameters.

```typescript
import { $ } from 'pipel'

// Custom then plugin, unsubscribes the node after 1s
const thenPlugin = {
  then: (unsubscribe) => {
    setTimeout(unsubscribe, 1000)
  },
}

const promise$ = $(1).use(thenPlugin)

promise$.then((data) => {
  console.log(data)
})

promise$.next(2) // Output: 2
sleep(1000)
promise$.next(3) // No output
```

### thenAll Plugin

Triggered when all nodes in the stream create subscriptions, can only be used on Stream; using on Observable nodes will throw an error.

```typescript
import { $ } from 'pipel'

// Custom thenAll plugin, adds unified handling to all then operations in the stream
const thenAllPlugin = {
  thenAll: (unsubscribe) => {
    console.log('thenAll plugin triggered')
    // Add unified logic here, such as unified unsubscription handling
  },
}

const promise$ = $(1).use(thenAllPlugin)

// First then node
promise$.then((data) => {
  console.log('First then:', data)
  return data + 1
})

// Second then node (child node)
promise$.then((data) => {
  console.log('Second then:', data)
  return data * 2
})

// Third then node (child node)
promise$.then((data) => {
  console.log('Third then:', data)
})

promise$.next(2)
// Output:
// thenAll plugin triggered
// thenAll plugin triggered
// thenAll plugin triggered
// First then: 2
// Second then: 3
// Third then: 6
```

### execute Plugin

Triggered when a node executes, can modify the execution result. If a node has multiple execute plugins, they are executed in plugin order, with the result of the previous plugin passed as input to the next, and the final result returned as the current node's value.

```typescript
import { $ } from 'pipel'

// Custom execute plugin, modifies the result when executing the node
const executePlugin = {
  execute: ({ result, root }) => {
    console.log(`Executing node - is Stream node: ${root}, result: ${result}`)
    return result + 1
  },
}

const promise$ = $().use(executePlugin)

promise$.then((data) => console.log(data))

promise$.next(1)
// Output: Executing node - is Stream node: true, result: 1
// Output: 2
```

### executeAll Plugin

Triggered when a node executes, can modify the execution result. Can only be used on Stream; using on Observable nodes will throw an error.

If a node has multiple executeAll plugins, they are executed in plugin order, with the result of the previous plugin passed as input to the next, and the final result returned as the current node's value.

```typescript
import { $ } from 'pipel'

// Custom executeAll plugin, adds unified handling to the root stream and all its child nodes' execute operations
const executeAllPlugin = {
  executeAll: ({ result, root, onfulfilled, onrejected }) => {
    // Skip pass-through nodes (nodes without handler functions)
    if (!root && !onfulfilled && !onrejected) {
      return result
    }
    console.log('executeAll plugin triggered, result:', result, 'is Stream node:', root)
    return result
  },
}

const promise$ = $().use(executeAllPlugin)

promise$
  .then((data) => data + 1)
  .then() // onfulfilled = undefined, onrejected = undefined
  .then((data) => data * 2)

promise$.next(1)
// Output:
// executeAll plugin triggered, result: 1 is Stream node: true
// executeAll plugin triggered, result: 2 is Stream node: false
// executeAll plugin triggered, result: 4 is Stream node: false
```

## Plugin Usage Notes

- thenAll and executeAll plugins can only be used on Stream; using on Observable nodes will throw an error
- then and execute plugins can be used on any node
- Plugins can be added via the use method and removed via the remove method
