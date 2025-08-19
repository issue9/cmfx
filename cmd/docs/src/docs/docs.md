# 开发指南

### 主题

前端采用了 tailwind css 作为样式管理，可直接采用 tailwind 相关项目。
支持容器媒体查询，可以在整个项目的挂载元素上添加 `@container`。

同时还定义了以下几个调色盘：

- primary
- secondary
- tertiary
- error
- surface

各个组件可通过指定 palette 属性指定其颜色。

### 样式

- TODO: 图标

## 部署

如果在 <https://pkg.go.dev/github.com/issue9/web/server/app#CLIOptions> 中指定了 Daemon 字段，
那么应用中本身就带了简单的守护进程操作功能。否则需要用户自己将应用转换为守护进程。
