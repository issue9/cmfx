# cmfx 开发文档

## 支持的平台和环境

 - Firefox、Chrome 和 Safari 内核的最新两个版本，其它内核的浏览器未作测试；
 - Go >= 1.24；
 - Node >= 23；
 - gcc Go 需要用到 cgo 支持；

## 开发

[参与此项目的开发](CONTRIBUTING.md)

[基于此项目的开发](DEV.md)

### 本地化

后端采用 <https://pkg.go.dev/github.com/issue9/localeutil> 作为生成国际化的工具，
可通过 `web locale` 子命令导出国际化的文件。

前端则是 <https://www.npmjs.com/package/intl-messageformat> 作为国际化的方法，
用户需要手动维护本地化的文件。
