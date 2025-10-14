# partition

Partitions the input [stream](/en/api/stream#stream) or [Observable](/en/api/observable) according to a predicate function, returning two streams: the first for values that satisfy the condition, the second for those that do not.

![image](/partition.drawio.svg)

## Type

```typescript
export enum PromiseStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

type partition: <T>(
  stream$: Stream<T> | Observable<T>,
  predicate: (this: any, value: any, status: PromiseStatus, index: number) => boolean,
  thisArg?: any,
) => [Stream<T>, Stream<T>];
```

## Parameters

- stream$ (Stream | Observable): Input stream or Observable
- predicate (Function): Condition function, receives `value`, `status`, and `index` as parameters
  - value: Current value
  - status: Promise status
  - index: Index starting from 1
- thisArg (optional): `this` context for the predicate function

## Return Value

Returns an array of two Streams: [stream of satisfied values, stream of unsatisfied values]

## Details

- Partitions the input stream according to the predicate function, returning two streams: the first for values that satisfy the condition, the second for those that do not
- When the input stream unsubscribes, both returned streams also unsubscribe
- When the input stream [completes](/en/guide/base#complete), the corresponding returned streams also complete
- If the input stream is already completed, both returned streams complete immediately
- If the predicate function throws an error, the value is assigned to the unsatisfied stream
- Index starts from 1 and increments after each value is processed

## Example

```typescript
import { $, partition } from 'pipeljs'

const stream$ = $()

const [selectedStream$, unselectedStream$] = partition(stream$, (value, status) => {
  // Select odd numbers in resolved state, or even numbers in rejected state
  if (status === 'resolved') {
    return value % 2 === 1
  } else {
    return value % 2 === 0
  }
})

selectedStream$.then(
  (value) => console.log('Selected resolved:', value),
  (value) => console.log('Selected rejected:', value)
)
unselectedStream$.then(
  (value) => console.log('Unselected resolved:', value),
  (value) => console.log('Unselected rejected:', value)
)

stream$.next('1') // resolved odd -> selected
// Output: Selected resolved: 1
stream$.next('2') // resolved even -> unselected
// Output: Unselected resolved: 2
stream$.next(Promise.reject('3')) // rejected odd -> unselected
// Output: Unselected rejected: 3
stream$.next(Promise.reject('4')) // rejected even -> selected
// Output: Selected rejected: 4
```

## Status-based Partitioning Example

```typescript
import { $, partition } from 'pipeljs'

const stream$ = $()

const [selectedStream$, unselectedStream$] = partition(stream$, (value, status) => {
  // Select resolved odd numbers or rejected even numbers
  if (status === 'resolved') {
    return value % 2 === 1
  } else {
    return value % 2 === 0
  }
})

selectedStream$.then(
  (value) => console.log('Selected resolved:', value),
  (value) => console.log('Selected rejected:', value)
)
unselectedStream$.then(
  (value) => console.log('Unselected resolved:', value),
  (value) => console.log('Unselected rejected:', value)
)

stream$.next('1') // resolved odd -> selected
// Output: Selected resolved: 1
stream$.next('2') // resolved even -> unselected
// Output: Unselected resolved: 2
stream$.next(Promise.reject('3')) // rejected odd -> unselected
// Output: Unselected rejected: 3
stream$.next(Promise.reject('4')) // rejected even -> selected
// Output: Selected rejected: 4
```

## Index-based Partitioning Example

```typescript
import { $, partition } from 'pipeljs'

const stream$ = $()

const [oddIndexStream$, evenIndexStream$] = partition(stream$, (value, status, index) => {
  return index % 2 === 1 // Select items at odd indices
})

oddIndexStream$.then((value) => console.log('odd index:', value))
evenIndexStream$.then((value) => console.log('even index:', value))

stream$.next('a') // index 1
// prints: odd index: a
stream$.next('b') // index 2
// prints: even index: b
stream$.next('c') // index 3
// prints: odd index: c
```

## Using thisArg Example

```typescript
import { $, partition } from 'pipeljs'

const stream$ = $()

const context = {
  threshold: 3,
  checkLength: function (value: string) {
    return value.length > this.threshold
  },
}

const [longStrings$, shortStrings$] = partition(
  stream$,
  function (value, status, index) {
    return this.checkLength(value)
  },
  context
)

longStrings$.then((value) => console.log('long string:', value))
shortStrings$.then((value) => console.log('short string:', value))

stream$.next('hi')
// prints: short string: hi
stream$.next('hello')
// prints: long string: hello
```

## Error Handling Example

```typescript
import { $, partition } from 'pipeljs'

const stream$ = $()

const [selected$, unselected$] = partition(stream$, (value, status, index) => {
  if (value === 'error') {
    throw new Error('Predicate error')
  }
  return value % 2 === 1
})

selected$.then((value) => console.log('selected:', value))
unselected$.then((value) => console.log('unselected:', value))

stream$.next(1)
// prints: selected: 1
stream$.next('error') // Predicate throws error, value goes to unselected stream
// prints: unselected: error
```

## Input Validation Example

```typescript
import { $, partition } from 'pipeljs'

// Correct input
const stream$ = $()
const [stream1$, stream2$] = partition(stream$, (value) => value > 0) // works normally

// Invalid input will throw an exception
try {
  const [error1$, error2$] = partition('invalid' as any, (value) => true)
} catch (error) {
  console.log(error.message)
  // prints: partition operator only accepts Stream or Observable as input
}
```
