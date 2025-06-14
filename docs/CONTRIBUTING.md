# CONTRIBUTING

当前文件规范了参与 cmfx 开发的一些注意事项

## 提交

### 代码

Go 采用 `gofmt` 进行格式化，无须手动处理，在 `gofmt` 允许的范围之内用户可自行决定。

前端代码已经配置 `ESLint`，需要在 IDE 做相应的配置，以开启自动检测功能。

对于像 yaml 等配置型的文件，由 `.editorconfig` 进行规范，你的 IDE 需要支持该功能以方便自动格式化。

### commit-msg

提交消息的格式如下：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

type 取值如下：

- feat: 新增功能；
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

可以将 `./scripts/commit-msg.sh` 添加到项目 `.git/hooks` 之下，并命名为 `commit-msg`，可以在每次提交之前对提交信息格式进行检测，
部分系统可能还需要为 `commit-msg` 添加可执行权限，比如 macOS 下需要执行 `chmod +x .git/hooks/commit-msg`。

## 测试环境搭建

如果支持 Makefile 的使用，可以使用以下命令进行初始化：

1. `make install` 安装环境；
1. `make init` 初始化项目的数据库等信息；
1. `make watch-components` 热编译前端组件库代码，之后可通过 `http://localhost:5173` 访问组件库的示例界面；
1. `make watch-server` 热编译后端代码，之后可通过 `http://localhost:8080` 作为后端接口的基地址；
1. `make watch-admin` 热编译前端代码，之后可通过 `http://localhost:5173` 访问后台界面；
1. 如果需要同时执行前后端代码，则可采用 `make watch -j2`；

## 开发

### 目录结构

- cmd 包含了用于测试的前后端；
- cmfx 后端源码的主目录；
- docs 文档；
- packages 前端相关的代码；
- packages/core 前端的核心代码库；
- packages/components 前端组件库；
- packages/admin 前端的后台管理界面；

### 本地化

后端的本地化信息在 `cmfx/locales` 目录之下；前端的本地化信息在 `packages/**/src/messages` 目录之下。

### 前端

前端的一些注意事项：

- 所有组件都要有明确的返回值，否则在生成 `.d.ts` 文件时可能会出错；
- 组件属性中不推荐直接使用 classList 属性，而是应该使用 classList 函数转换为字符串然后传递给 class 属性；
- 注意 CSS 中不同 layer 的优先级；
- solid-router 只能有一个实例对象，否则会出现 `Error: <A> and 'use' router primitives can be only used inside a Route. ` 的错误，
所以在所有的 vite.config.ts 中都将 solid-router 加入到 rollupOptions.external，只在主项目中真实导入；

### 后端

数据库模型的命名，为了好区分，分别有以下作为后缀的命名：

- PO 持久化对象，一般为 ORM 中映射的对象；
- VO 值对象，服务端传递给客户端；
- TO 客户端传递给服务端的数据；
