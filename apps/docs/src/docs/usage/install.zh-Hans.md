# 安装

在安装项目之前需要具备基本的开发环境：

- [Node.js](https://nodejs.org/zh-cn)
- [pnpm](https://pnpm.io/zh/)
- [Go](https://go.dev/)
- Git

如果只是作一个简单的项目，可以跳过以下安装步骤，直接在 `apps` 下作开发：

- server 后端代码；
- admin 前端代码；

## 前端

可通过以下命令安装基本的依赖：

```bash
npm i typescript vite vite-plugin-solid @tailwindcss/vite
npm i @solidjs/router solid-js
npm i @cmfx/admin @cmfx/core @cmfx/components @cmfx/illustrations
```

如果需要高亮功能，还需要安装 `shiki/bundle/full`：

```bash
npm i shiki
```

### 可继承的属性

#### browserslist

如果要保持与 @cmfx/admin 相同的浏览器版本，需要在 browserslist 中指定 `extends @cmfx/admin`。

#### tsdoc

自定义了部分 [tsdoc](https://tsdoc.org/) 标签，在 [@cmfx/vite-plugin-api](https://www.npmjs.com/package/@cmfx/vite-plugin-api) 使用，如果你的项目中也需要用到，可以在项目的 `tsdoc.json` 中引入：

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json",
    "extends": [
        "@cmfx/admin/tsdoc.json"
    ]
}

```

#### tailwind

对 tailwind 的进行了部分自定义，**必须**在项目的样式文件中引入相关定义：

```css
/* style.css */

@source '.';                              /* 指定 tailwind 扫描的根目录 */
@import 'tailwindcss';                    /* 导入 tailwind */
@import '@cmfx/components/style.css';     /* 导入组件样式 */
@import '@cmfx/components/tailwind.css';  /* 导入组件库中对 tailwind 样式的修改 */
```

项目中，**必须**第一个引用样式文件，否则可能存在部分样式文件失效的情况：

```ts
/* index.ts */
import './style.css'; // 第一个引入项目的样式文件

import 'other.ts';

// TODO
```

## 后端

可通过以下命令安装依赖项：

```bash
go get github.com/cmfx@latest
```
