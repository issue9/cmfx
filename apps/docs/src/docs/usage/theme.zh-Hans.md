# 主题

对于主题，可以在项目的配置对象 `Options` 中使用 `Options.themes` 指定所有的可用主题，`Options.theme` 指定默认主题。

主题采用 tailwind 作为样式管理，所有与主题相关的自定义属性也是通过修改 tailwind 的配置文件来实现的。

支持容器媒体查询，由 `run` 创建的组件的根元素提供了 `@container/root`。

## 颜色

定义了以下几个调色盘，通过组件的 `palette` 属性指定组件的颜色信息：

- primary
- secondary
- tertiary
- error
- surface

每个色盘又衍生了 基础色、high 和 low 三种颜色。
以及根据颜色所处的位置不同分成 边框 border、前景色 fg 和背景色 bg 供开发者使用，所以一个色盘总共有 9 种颜色：

- bg
- bg-high
- bg-low
- fg
- fg-high
- fg-low
- border
- border-high
- border-low

在 tailwind 中可以使用 `bg-{palette/palette-*/primary/secondary/tertiary/error/surface}-{bg/fg/border}-{low/high/}` 等对颜色进行访问。
其中的 palette 和 palette-* 表示组件的当前色盘或是基于当前色盘的之后个 n 个色盘。

## z-index

定义了以下几个通用的 z-index 值：

- z-affix: 界面上固定的按钮；
- z-tooltip: 提示信息；
- z-popover: 一此普通的弹出元素；
- z-notify: 通知类型的弹出元素；
- z-dialog: 弹出对话框；

## 全局 CSS

### `.prefers-reduced-motion`

减少动画效果，与 `@media (prefers-reduced-motion: reduce)` 一样的效果，但是此类可以用于局部。
系统级别的设置可参考[各个操作系统的设置](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-reduced-motion#%E7%94%A8%E6%88%B7%E5%81%8F%E5%A5%BD)。
如果 `@media (prefers-reduced-motion: reduce)` 匹配，则 css 样式不再起作用。

### `.no-print`

通过 `@cmfx/core` 下的 `printElement` 打印内容的，可通过为子元素添加此类名以达到不打印的目的。
