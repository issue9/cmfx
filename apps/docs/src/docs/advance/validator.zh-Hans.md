# 验证

在 [@cmfx/core](https://npmjs.com/package/@cmfx/core) 中定义了验证器的接口，所有实现该接口的对象都可在以表单中对数据进行验证。
```ts Validator,ValidResult
```

[@cmfx/admin](https://npmjs.com/package/@cmfx/admin) 内部是基于 [zod](https://zod.dev/) 作数据验证的，
并且提供了一部分公用的数据验证器。如果你想采用 zod 作为验证器，可以使用 `zodValidator` 创建验证器：
```ts zodValidator
```

`zodValidator` 还附加了一些本地化的数据，可以使用 `createZodLocaleLoader` 加载本地化数据。
```ts createZodLocaleLoader
```
