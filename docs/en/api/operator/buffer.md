# buffer

Buffer operator collects data from the source stream into a buffer. When the trigger stream emits a value, all buffered data is emitted at once as an array.

<div style="display: flex; justify-content: center">
  <img src="/buffer.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type buffer = <T>(
  trigger$: Stream | Observable,
  shouldAwait?: boolean
) => (observable$: Observable<T>) => Observable<T[]>
```

## Parameters

- trigger$ (Stream | Observable): The trigger stream. When this stream emits a value, the operator emits all buffered data.
- shouldAwait (boolean, optional): Whether to wait for the source stream's `pending` state to finish. Defaults to `true`. When trigger$ fires while the source is `pending`, it waits for resolution before emitting.

## Details

- Continuously collects resolved values from the source stream into an internal buffer; rejected values are ignored.
- Only emits all buffered data when the trigger stream is in `resolve` status and emits a value.
- After each emission, the buffer is cleared to collect the next batch of data.
- When `shouldAwait` is `true`, if the source is `pending`, it waits for resolution before emitting.

## Usage Scenarios

### Scenario 1: Basic data buffering

```typescript
import { $, buffer } from 'pipeljs'

const source$ = $()
const trigger$ = $()

const buffered$ = source$.pipe(buffer(trigger$))

buffered$.then((values) => {
  console.log('Buffered data:', values)
})

// Emit data to the source stream, but not emitted immediately
source$.next(1)
source$.next(2)
source$.next(3)

// Only emits buffered data when the trigger is activated
trigger$.next('trigger') // Output: Buffered data: [1, 2, 3]

// Continue emitting data
source$.next(4)
source$.next(5)

// Next trigger emission
trigger$.next('trigger') // Output: Buffered data: [4, 5]
```

### Scenario 2: Handling empty buffer

```typescript
import { $, buffer } from 'pipeljs'

const source$ = $()
const trigger$ = $()

const buffered$ = source$.pipe(buffer(trigger$))

buffered$.then((values) => {
  console.log('Buffered data:', values)
})

// Trigger when there is no data
trigger$.next('trigger') // Output: Buffered data: []
```

### Scenario 3: Batch data processing

```typescript
import { $, buffer } from 'pipeljs'

const dataStream$ = $()
const batchTrigger$ = $()

const batchedData$ = dataStream$.pipe(buffer(batchTrigger$))

batchedData$.then((batch) => {
  console.log(`Processing ${batch.length} items:`, batch)
  // Batch process data
})

// Generate data quickly
for (let i = 1; i <= 100; i++) {
  dataStream$.next(i)
}

// Batch process
batchTrigger$.next('process') // Output: Processing 100 items: [1, 2, 3, ..., 100]
```

### Scenario 4: Awaiting asynchronous values

```typescript
import { $, buffer } from 'pipeljs'

const source$ = $()
const trigger$ = $()

// shouldAwait is true (default)
const buffered$ = source$.pipe(buffer(trigger$, true))

buffered$.then((values) => {
  console.log('Buffered data:', values)
})

// Emit both immediate and async values
source$.next(1)
source$.next(2)

const slowPromise = new Promise((resolve) => {
  setTimeout(() => resolve('async result'), 1000)
})
source$.next(slowPromise)

// Trigger immediately, but will wait for async value to resolve
trigger$.next('trigger')
// After 1 second: Output: Buffered data: [1, 2, 'async result']
```

### Scenario 5: Not awaiting asynchronous values

```typescript
import { $, buffer } from 'pipeljs'

const source$ = $()
const trigger$ = $()

// shouldAwait is false
const buffered$ = source$.pipe(buffer(trigger$, false))

buffered$.then((values) => {
  console.log('Buffered data:', values)
})

source$.next(1)
source$.next(2)

const slowPromise = new Promise((resolve) => {
  setTimeout(() => resolve('async result'), 1000)
})
source$.next(slowPromise)

// Trigger immediately, does not wait for async value to resolve
trigger$.next('trigger') // Output: Buffered data: [1, 2, Promise] or [1, 2]
```
