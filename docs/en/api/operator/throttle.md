# throttle

Throttle operator, limits the frequency of data emissions by controlling the emission rate within a specified time interval.

<div style="display: flex; justify-content: center">
  <img src="/throttle.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type throttle = (throttleTime: number) => (observable$: Observable) => Observable
```

## Parameters

- throttleTime: Throttle time interval in milliseconds

## Details

- Uses "leading edge" throttling strategy: first data emission passes through immediately
- Subsequent emissions within the throttle interval are delayed
- The last emission during the throttle period will be emitted after the interval ends
- If the interval between emissions is greater than the throttle time, each emission passes through immediately

## Examples

```typescript
import { $, throttle } from 'pipeljs'

const stream$ = $()

// Use throttle operator, throttle time 100ms
const throttled$ = stream$.pipe(throttle(100))

throttled$.then((value) => {
  console.log('Throttled value:', value)
})

// First emission passes through immediately
stream$.next(1) // Immediate output: Throttled value: 1

// Rapid consecutive emissions
setTimeout(() => stream$.next(2), 30) // Throttled
setTimeout(() => stream$.next(3), 60) // Throttled, but will be emitted after 100ms
setTimeout(() => stream$.next(4), 90) // Throttled

// Output:
// Immediate: Throttled value: 1
// After 100ms: Throttled value: 4
```

### Scenario 2: Multiple throttle batches

```typescript
import { $, throttle } from 'pipeljs'

const stream$ = $()
const throttled$ = stream$.pipe(throttle(100))

throttled$.then((value) => {
  console.log('Value:', value)
})

// First batch of emissions
stream$.next(1) // Immediate output: Value: 1
setTimeout(() => stream$.next(2), 30) // Throttled
setTimeout(() => stream$.next(3), 60) // Throttled, will emit after 100ms

// Second batch (with sufficient interval)
setTimeout(() => {
  stream$.next(4) // Immediate output: Value: 4
  setTimeout(() => stream$.next(5), 30) // Throttled
  setTimeout(() => stream$.next(6), 60) // Throttled, will emit after interval
}, 150)

// Output sequence:
// Immediate: Value: 1
// After 100ms: Value: 3
// At 150ms: Value: 4
// After 250ms: Value: 6
```

### Scenario 3: Long interval emissions

```typescript
import { $, throttle } from 'pipeljs'

const stream$ = $()
const throttled$ = stream$.pipe(throttle(50))

throttled$.then((value) => {
  console.log('Spaced emission:', value)
})

stream$.next('first') // Immediate output: Spaced emission: first

// Emit after throttle period
setTimeout(() => {
  stream$.next('second') // Immediate output: Spaced emission: second
}, 100)

setTimeout(() => {
  stream$.next('third') // Immediate output: Spaced emission: third
}, 200)
```

### Scenario 4: Handle Promise states

```typescript
import { $, throttle } from 'pipeljs'

const stream$ = $()
const throttled$ = stream$.pipe(throttle(100))

throttled$.then(
  (value) => console.log('Success:', value),
  (error) => console.log('Error:', error)
)

// First emission passes immediately
stream$.next(Promise.reject('error1')) // Immediate output: Error: error1

// Rapid consecutive emissions
setTimeout(() => {
  stream$.next(Promise.reject('error2')) // Throttled
}, 30)

setTimeout(() => {
  stream$.next('success') // Throttled, emits after 100ms
}, 60)

// Output:
// Immediate: Error: error1
// After 100ms: Success: success
```

### Scenario 5: Zero delay throttling

```typescript
import { $, throttle } from 'pipeljs'

const stream$ = $()
const throttled$ = stream$.pipe(throttle(0))

throttled$.then((value) => {
  console.log('Immediate:', value)
})

// All emissions pass through immediately with zero delay
stream$.next(1) // Output: Immediate: 1
stream$.next(2) // Output: Immediate: 2
stream$.next(3) // Output: Immediate: 3
```

### Scenario 6: Search input optimization

```typescript
import { $, throttle } from 'pipeljs'

const searchInput$ = $()
const throttledSearch$ = searchInput$.pipe(throttle(300))

throttledSearch$.then((keyword) => {
  console.log('Execute search:', keyword)
  // Actual search logic
})

// Simulate rapid user input
searchInput$.next('a') // Immediate search execution
searchInput$.next('ap') // Throttled
searchInput$.next('app') // Throttled
searchInput$.next('apple') // Throttled, executes after 300ms

// Output:
// Immediate: Execute search: a
// After 300ms: Execute search: apple
```

## Relationship with Other Operators

- **vs `debounce`**: `throttle` first emission passes immediately, `debounce` delays all emissions
- **Throttling strategy**: Uses "leading edge throttling" to ensure immediate response while controlling frequency
- **Use cases**: Button click prevention, scroll event optimization, search suggestions, etc., where immediate response with frequency control is needed
