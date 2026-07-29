# 错误处理

## 前端

在 [@cmfx/admin](https://www.npmjs.com/package/@cmfx/admin) 默认会拦截所有用户抛出的错误对象，
如果抛出的是 `LogicError` 和 `RuntimeError` 类型的错误，那么还会有专门的结果页。
@```@cmfx/core%LogicError```@
@```@cmfx/core%RuntimeError```@

由后端返回的错误类型为 `Problem`，这是一个符合 [RFC7807](https://datatracker.ietf.org/doc/html/rfc7807) 的错误描述对象，
`useAPI` 和 `useREST` 返回的第二参数可以根据配置提供一个默认处理 `Problem` 类型的函数。
如果不想使用默认处理方法，还可以使用由 `@cmfx/components` 提供的 `handleProblem`、`throwProblem` 和 `notifyProblem` 函数。
@```@cmfx/components%useAPI```@
@```@cmfx/components%useREST```@
@```@cmfx/components%handleProblem```@
@```@cmfx/components%notifyProblem```@
@```@cmfx/components%throwProblem```@

### ErrorBoundary

solidjs 的 ErrorBoundary 如果想要捕获异步方法中的异步，需要将其转换为同步的方法：
```tsx
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
