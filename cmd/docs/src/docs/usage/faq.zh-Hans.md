# 常见问题

## 支持 RTL 吗

有限支持，需要手动在 `html` 标签上添加 `dir="rtl"` 属性。

## Code 组件为什么不高亮代码

为了减少库的体积，打包时并未包含 [shiki](https://shiki.tmrs.site/)，需要在自己的 `package.json` 中添加以下配置：

```json
{
  "devDependencies": {
    "shiki": "^3.12.0"
  }
}
```

## 如何不打印部分内容

通过添加 `.no-print` 类名，可以在打印时隐藏该元素；
