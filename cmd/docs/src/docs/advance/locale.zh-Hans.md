# 国际化

国际化分两部分，稍有不同。

## 后端

后端由框架 [web](https://github.com/issue9/web) 提供的国际化功能，将需要国际化的内容用 `web.Phrase` 包裹，之后由命令行工具 `web locale` 生成国际化文件。

## 前端

前端需要定义翻译文件，经由 Options.messages 进行加载。
