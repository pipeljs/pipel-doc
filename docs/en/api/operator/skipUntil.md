# skipUntil

Skip operator that skips data emissions from the source stream until the trigger stream resolves once, then passes through subsequent data.

<div style="display: flex; justify-content: center">
  <img src="/skipUntil.drawio.svg" alt="image" >
</div>

## Type Definition

```typescript
type skipUntil = <T>(trigger$: Stream | Observable) => (observable$: Observable<T>) => Observable<T>
```

## Parameters

- trigger$: Trigger stream or observable that enables data passing when it resolves

## Details

- Only the resolve state of trigger$ can enable data passing; reject states are ignored
- Once enabled, all subsequent source stream data will be passed through normally
- Previously resolved data before enabling will not be passed through retroactively
- When downstream unsubscribes, trigger listeners are automatically cleaned up

## Examples

### Basic Usage

```typescript
import { $, skipUntil } from 'pipel'

const source$ = $()
const trigger$ = $()
const result$ = source$.pipe(skipUntil(trigger$))

result$.then((value) => {
  console.log('Passed:', value)
})

// Data pushed before trigger is enabled will be skipped
source$.next(1) // Skipped, no output
source$.next(2) // Skipped, no output

// Enable trigger
trigger$.next('go')

// Subsequent data passes through normally
source$.next(3) // Output: Passed: 3
source$.next(4) // Output: Passed: 4
```
