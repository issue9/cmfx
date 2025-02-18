# 开发指南

## 前端

前端部分提供了后台的管理的基本框架，可通过以下命令安装依赖：
```bash
npm i @cmfx/admin
```
当然也可以直接在当前项目的 [cmd/admin](/cmd/admin) 下作开发。

### 可继承的属性

 - browserslist 如果要保持与 @cmfx/admin 相同的浏览器版本，需要在 browserslist 中指定 `extends @cmfx/admin`。

### 主题

前端采用了 tailwind css 作为样式管理，可直接采用 tailwind 相关项目。
支持容器媒体查询，可以在整个项目的挂载元素上添加 `@container`。

图标字体采用 <https://fonts.google.com/icons>。

同时还定义了以下几个调色盘：
 - primary
 - secondary
 - tertiary
 - error
 - surface

各个组件可通过指定 palette 属性指定其颜色。

## 后端

可采用以下代码安装：
```bash
go get github.com/issue9/cmfx
```
或是直接在当前项目的 [cmd/server](/cmd/server) 下开发。