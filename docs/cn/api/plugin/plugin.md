# 插件

- 类型

  ```typescript
  interface Plugin {
    then: thenPluginFn || thenPluginFn[];
    thenAll: thenPluginFn || thenPluginFn[];
    execute: executePlugin || executePlugin[];
    executeAll: executePlugin || executePlugin[];
  }

  type thenPluginFn = (unsubscribe: () => void) => void;

  type executePlugin = <T>(params: {
    result: Promise<T> | T;
    set: (setter: (state: T) => Promise<void> | void) => Promise<T> | T;
    root: boolean;
    onfulfilled?: OnFulfilled;
    onrejected?: OnRejected;
    unsubscribe: () => void;
  }) => Promise<any> | any;

  ```
