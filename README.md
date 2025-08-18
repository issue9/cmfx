<!--
该文件会被复制在 packages/admin 目录，为了链接的正确性，所有的链接都应该是绝对链接。
-->

# cmfx

![Version](https://img.shields.io/github/v/tag/issue9/cmfx?label=version)
[![License](https://img.shields.io/github/license/issue9/cmfx)](https://opensource.org/licenses/MIT)
[![PkgGoDev](https://pkg.go.dev/badge/github.com/issue9/cmfx)](https://pkg.go.dev/github.com/issue9/cmfx)
[![Go version](https://img.shields.io/github/go-mod/go-version/issue9/cmfx)](https://pkg.go.dev/github.com/issue9/cmfx)
[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@cmfx/admin)
![Node Current](https://img.shields.io/node/v/%40cmfx%2Fadmin)
[![Test](https://github.com/issue9/cmfx/actions/workflows/test.yml/badge.svg)](https://github.com/issue9/cmfx/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/issue9/cmfx/graph/badge.svg?token=D5y3FOJk8A)](https://codecov.io/gh/issue9/cmfx)

cmfx 是基于 [Go](https://go.dev) + [solidjs](https://www.solidjs.com/) 的快速后台管理开发框架。

## 开发

### 支持的平台和环境

- Firefox、Chrome 和 Safari 内核的最新两个版本，其它内核的浏览器未作测试；
- Go >= 1.24；
- Node >= 23；
- gcc Go 需要用到 cgo 支持；

### 本地化

后端采用 <https://pkg.go.dev/github.com/issue9/localeutil> 作为生成国际化的工具，
可通过 `web locale` 子命令导出国际化的文件。

前端则是 <https://www.npmjs.com/package/intl-messageformat> 作为国际化的方法，
用户需要手动维护本地化的文件。

若要参与此项目的开发，可参考 [CONTRIBUTING](https://github.com/issue9/cmfx/blob/master/CONTRIBUTING.md)。

## 版权

本项目采用 [MIT](https://opensource.org/licenses/MIT) 开源授权许可证，完整的授权说明可在 [LICENSE](https://github.com/issue9/cmfx/blob/master/LICENSE) 文件中找到。

图标源文件来自项目 [iconfiy](https://github.com/iconify/icon-sets)，每个图标可能有不同许可证。

插画源码来自 [storyset](https://storyset.com/amico)，其许可证可参考其 [terms](https://storyset.com/terms)。
