# 常见问题

## 支持 RTL 吗

有限支持，在标签上添加 `dir="rtl"` 属性即可。

## 为什么通过 `Ref.element().classList.add` 添加样式无效

组件内部是通过设置 class 属性来设定样式的，如果再利用 `Ref.element().classList.add` 添加样式，会相互覆盖。
所以如果要改变一个组件内部某个外放成员的样式，只能是通过 `Ref.element().style` 修改样式。

## Code 组件为什么不高亮代码

为了减少库的体积，打包时并未包含 [shiki](https://shiki.tmrs.site/)，需要在自己的 `package.json` 中添加以下配置：

```json
{
  "devDependencies": {
    "shiki": "^3.12.0"
  }
}
```
