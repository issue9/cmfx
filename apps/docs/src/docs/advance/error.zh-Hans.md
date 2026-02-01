# 错误处理

## 前端

在 [@cmfx/admin](https://www.npmjs.com/package/@cmfx/admin) 默认会拦截所有用户抛出的错误对象，
如果抛出的是 `APIError` 类型的错误，那么还会有专门的结果页。
```ts APIError
```

由后端返回的错误类型为 `Problem`，这是一个符合 [RFC7807](https://datatracker.ietf.org/doc/html/rfc7807) 的错误描述对象，
可以由 `APIError` 的 fromProblem 方法转换为 `APIError` 类型。
用户可以根据自身的需求处理部分错误，比如 403 等。无须处理的可以交给专门的处理函数 `handleProblem`。
```ts Problem,handleProblem
```

### ErrorBoundary

solidjs 的 ErrorBoundary 如果想要捕获异步方法中的异步，需要将其转换为同步的方法：
```ts
import { ErrorBoundary } from 'solid-js/web';

function AsyncComponent(): JSX.Element {
  const [err, setErr] = createSignal<Error>();

  createEffect(() => {
    if (err()) {throw err();}
  });

  return (
    <ErrorBoundary fallback={(error) => <div>Error: {error.message}</div>}>
        <form onsubmit={()=>{
            fetch().catch(setErr);
        }} />
    </ErrorBoundary>
  );
}
```
