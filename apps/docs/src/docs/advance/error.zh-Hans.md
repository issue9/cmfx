# 错误处理

## 前端

在 [@cmfx/core](https://www.npmjs.com/package/@cmfx/core) 默认会拦截所有用户抛出的错误对象，
本身也提供了一个 `APIError` 类用以表示各种 HTTP 状态码下的错误。
```ts APIError
```

由后端返回的错误类型为 `Problem`，这是一个符合 [RFC7807](https://datatracker.ietf.org/doc/html/rfc7807) 的错误描述对象，
用户可以根据自身的需求处理部分错误，比如 403 等。无须处理的可以交给专门的处理函数 `handleProblem`。
```ts Problem,handleProblem
```
