# Introduction

## What is pipel?

pipel(/fluːθ/) is a combination of **flu**x + **th**en, representing promise-like stream.

pipel is a promise-like stream programming library, well-suited for reactive programming. If you think of promise as the publisher and then as the subscriber, a promise only publishes once.

pipel enhances promise, allowing promise to publish continuously! If you are familiar with Promise, you already grasp the basics of pipel.

```typescript
import { $ } from 'pipeljs'

const promise$ = $()

promise$.then(
  (r) => console.log('resolve', r),
  (e) => console.log('reject', e)
)

promise$.next(1)
promise$.next(2)
promise$.next(Promise.reject(3))
console.log('end')

// Logs:
// resolve 1
// resolve 2
// end
// reject 3
```

```typescript
import { $ } from 'pipeljs'

const promise$ = $(0)
const observable$ = promise$.thenImmediate(v => v + 1)

promise$.value === 0 ✅
observable$.value === 1 ✅

promise$.next(1)

promise$.value === 1 ✅
observable$.value === 2 ✅
```

- Compared to other stream programming libraries, pipel is simpler and easier to use, with a low learning curve.
- Compared to promise, pipel can publish continuously and supports unsubscription.
- Compared to promise, pipel executes then synchronously and updates data in time.
- Compared to promise, pipel retains each subscription node's data for later use.
- Compared to promise, pipel fully supports `PromiseLike`.

## Comparison with rxjs

[rxjs](https://rxjs.dev/) is a mainstream stream programming library. Compared to pipel, there are several differences:

1. pipel is very easy to get started with. It is promise-like; if you know promise, you can use pipel.
2. pipel streams are hot and multicast, while rxjs streams can also be cold and unicast.
3. pipel supports chaining subscriptions, whereas rxjs subscriptions are not chainable after subscribe.
4. pipel retains each subscription node's data and status for subsequent consumption.
5. pipel subscription nodes have status similar to promise.
6. pipel can add plugins to extend stream functionality and add custom behaviors.

```javascript
// rxjs:
stream$.pipe(operator1, operator2, operator3)
stream$.subscribe(observer1)
stream$.subscribe(observer2)
stream$.subscribe(observer3)
```

<!-- prettier-ignore-start -->
```javascript
//pipel:
stream$.use(plugin1, plugin2, plugin3)

stream$
  .pipe(operator1, operator2)
  .then(observer1)
  .pipe(operator3)
  .then(observer2)
  .pipe(operator4)
  .then(observer3);

stream$.next(1);

```
<!-- prettier-ignore-end -->
