# CONTRIBUTING

当前文件规范了参与 cmfx 开发的一些注意事项

## 提交

### 代码

Go 采用 `gofmt` 进行格式化，无须手动处理，在 `gofmt` 允许的范围之内用户可自行决定。

前端代码已经配置 `ESLint`，需要在 IDE 做相应的配置，以开启自动检测功能。

对于像 yaml 等配置型的文件，由 `.editorconfig` 进行规范，你的 IDE 需要支持该功能以方便自动格式化。

### commit-msg

提交消息的格式如下：
```
<type>(<scope>): <subject>

<body>

<footer>
```
type 取值如下：
 - feat： 新增功能；
 - fix: 修复 BUG；
 - docs: 仅仅修改了文档；
 - style: 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑；
 - refactor: 重构代码；
 - perf: 优化相关，比如提升性能、体验；
 - test: 与测试相关的提交；
 - ci: 对集成测试等内容的修改；
 - chore: 其它一些非代码的修改；
 - revert: 回滚到指定版本；
 
scope 表示修改的范围，目录结构，可以为空。

subject 对此次变更的简要描述，一般不超过 80 个字符。

body 可选项，此次更改的具体信息，如果是多行，每行应该保持在 80 个字符之内。

footer 可选项，一般为关闭 issue 等附加的信息。

#### 校验方法

```bash
#!/bin/sh

# 获取当前提交的 commit msg
commit_msg=`cat $1`
msg_reg="^(feat|fix|docs|style|refactor|perf|test|ci|chore|revert)(\(.+\))?: .{1,80}"
if [[ ! $commit_msg =~ $msg_reg ]]
then
    echo "\n不合法的消息格式，请使用正确的格式\n <type>(<scope>): <subject>"
    exit 1
fi
```

可以将以上内容添加到项目 `.git/hooks` 之下，并命名为 `commit-msg`，可以在每次提交之前对提交信息格式进行检测，
部分系统可能还需要为 `commit-msg` 添加可执行权限，比如 macOS 下需要执行 `chmod +x .git/hooks/commit-msg`。

## 测试环境搭建

依赖以下的基本环境：

- node 22
- go: go.mod 中标明了最低的版本需求
- gcc: 部分 go 库需要 cgo 的支持
- make

之后可以通过以下方式初始开发环境

1. 在根目录下运行 `make install` 安装环境；
1. 在根目录下运行 `make init` 初始化项目的数据库等信息；
1. 在根目录下运行 `make watch -j2` 可同时运行前后端，之后可在浏览器中运行 `http://localhost:5173` 查看后台界面；

## 开发

### 目录结构

- admin 管理后台的主目录；
- cmd 包含了用于测试的前后端；
- cmfx 后端源码的主目录；
- docs 文档；

### 本地化

后端的本地化信息在 cmfx/locales 目录之下；前端的本地化信息在 admin/src/messages 目录之下。

### 前端

前端的一些注意事项：
 - 组件和页面的 CSS 样式，类型名必须以 c-- 或是 p-- 开头，防止不小心类名之间相互覆盖；
 - 所有组件都要有明确的返回值，否则在生成 .d.ts 文件时可能会出错；
 
### 后端

数据库模型的命名，为了好区分，分别有以下作为后缀的命名：

 - PO 持久化对象，一般为 ORM 中映射的对象；
 - VO 值对象，服务端传递给客户端；
 - TO 客户端传递给服务端的数据；