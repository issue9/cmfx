# 安装

在安装项目之前需要具备基本的开发环境：
- Node.js
- npm
- Go
- Git

如果只是作一个简单的项目，可以跳过以下安装步骤，直接在 `cmd` 下作开发：
- server 后端代码；
- admin 前端代码；

## 前端

可通过以下命令安装基本的依赖：

```bash
npm i typescript vite vite-plugin-solid @tailwindcss/vite
npm i @solidjs/router solid-js
npm i @cmfx/admin @cmfx/core @cmfx/components
```

### 可继承的属性

- browserslist 如果要保持与 @cmfx/admin 相同的浏览器版本，需要在 browserslist 中指定 `extends @cmfx/admin`。
- tsdoc 自定义了部分 tsdoc 标签，如果需要用到，可以项目的 tsdoc.json 中引入：
```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json",
    "extends": [
        "@cmfx/admin/tsdoc.json"
    ]
}

```
- tailwind 对 tailwind 的进行了部分自定义，需要在项目的样式表中引入相关定义：
```css
@import 'tailwindcss';
@import '@cmfx/components/style.css';
@import '@cmfx/components/tailwind.css';
```

## 后端

可通过以下命令安装依赖项：

```bash
go get github.com/cmfx@latest
```
