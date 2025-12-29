# 常见问题

## 支持 RTL 吗

有限支持，在标签上添加 `dir="rtl"` 属性即可。

## 为什么通过 `Ref.root().classList.add` 添加样式无效

组件内部是通过设置 class 属性来设定样式的，如果再利用 `Ref.root().classList.add` 添加样式，会相互覆盖。
所以如果要改变一个组件内部某个外放成员的样式，只能是通过 `Ref.root().style` 修改样式。

## Code 组件为什么不高亮代码

为了减少库的体积，打包时并未包含 [shiki](https://shiki.tmrs.site/)，需要在自己的 `package.json` 中添加以下配置：

```json
{
  "devDependencies": {
    "shiki": "^3.12.0"
  }
}
```

## 为什么不提供 prefers-contrast 相关功能

不常用，且实现麻烦（主题颜色依赖 --contrast 变量进行计算，如果提供了修改 --constrast 的功能，
每次的修改还需要将所有的颜色变量复制到当前元素上，才能让颜色值重新计算），所干脆不弄了。
而 prefers-reduced-motion 是因为实现简单，加一个类名的事儿，就顺手加了。
