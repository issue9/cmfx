# 主题

对于主题，可以在项目的配置对象 `Options` 中使用 `Options.themes` 指定所有的可用主题，`Options.theme` 指定默认主题。

主题采用 tailwind 作为样式管理，所有与主题相关的自定义属性也是通过修改 tailwind 的配置文件来实现的。

支持容器媒体查询，可以在需要的元素上添加 `@container`。

## 颜色

定义了以下几个调色盘，通过组件的 `palette` 属性指定组件的颜色信息：

- primary
- secondary
- tertiary
- error
- surface

每个色盘又衍生了 base、high 和 low 三种颜色以及前景色 fg 和背景色 bg 供开发者使用，所以一个色盘总共有 6 种颜色：

- bg
- bg-high
- bg-low
- fg
- fg-high
- fg-low

在 tailwind 中可以使用 `bg-{palette/primary/secondary/tertiary/error/surface}-{bg/fg}-{low/high/}` 等对颜色进行访问。

## z-index

定义了以下几个通用的 z-index 值：

- z-affix: 界面上固定的按钮；
- z-tooltip: 提示信息；
- z-popover: 一此普通的弹出元素；
- z-notify: 通知类型的弹出元素；
- z-dialog: 弹出对话框；
