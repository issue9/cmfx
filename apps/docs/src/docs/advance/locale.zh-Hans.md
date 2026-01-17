# 国际化

国际化分两部分，稍有不同。

## 后端

后端由框架 [web](https://github.com/issue9/web) 提供的国际化功能，将需要国际化的内容用 [`web.Phrase`](https://pkg.go.dev/github.com/issue9/web#Phrase) 包裹，之后由命令行工具 `web locale` 生成国际化文件。

## 前端

前端需要定义翻译文件，经由配置对象的 `messages` 进行加载。该字段的原型为：

```ts
Record<string, Array<{(): Promise<Dict>;}>>
```

属性名为语言 ID，属性值为一个函数数组，每一个函数返回一个翻译字典。对于 `Dict` 的要求是，是属性名只能是字符串类型的可嵌套对象。

用户需要手动维护字典的内容，一量翻译在源代码中不存在了，需要手动在字典中作删除处理，这样才保持文件清爽。

### 第三方的翻译对象

前端引用的部分库本身带有翻译内容，需要将其加载过程转换为上面的类型，有以下几个：

- `createChartLocaleLoader`: 由 [@cmfx/components](https://www.npmjs.com/package/@cmfx/components) 的 echart 组件而引入；
```ts createChartLocaleLoader
```

- `createZodLocaleLoader`: 由 [@cmfx/core](https://www.npmjs.com/package/@cmfx/core) 的 zod 组件而引入；
```ts createZodLocaleLoader
```
