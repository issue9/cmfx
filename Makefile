# SPDX-FileCopyrightText: 2024-2025 caixw
#
# SPDX-License-Identifier: MIT

.PHONY: gen build-cmd build-ts install init watch-server watch-admin watch-components watch test test-go test-ts

ROOT = .
CMD = $(ROOT)/cmd

CMD_SERVER = $(CMD)/server
SERVER_BIN = server

# 生成中间代码
gen:
	go generate $(ROOT)/...

# 编译测试项目
build-cmd:
	go build -o=$(CMD_SERVER)/$(SERVER_BIN) -v $(CMD_SERVER)
	npm run build -w=@cmfx/admin-demo -w=@cmfx/components-demo

# 编译项目内容
build-ts:
	npm run build -w=@cmfx/core -w=@cmfx/components -w=@cmfx/admin

# 安装依赖
install:
	go mod download
	npm install

# 安装基本数据，依赖 build 生成的测试项目
init: build-cmd
	cd $(CMD_SERVER) && ./server -a=install

watch-server:
	web watch -app=-a=serve $(CMD_SERVER)

watch-admin:
	npm run dev -w=@cmfx/admin-demo

watch-components:
	npm run dev -w=@cmfx/components-demo

# 运行测试内容
#
# 需要采用 -j 执行并行命令，比如：
#  make watch -j2
watch: watch-server watch-admin

# 执行 Go 测试
test-go:
	go vet -v ./...
	go test -v -coverprofile='coverage.txt' -p=1 -parallel=1 -covermode=atomic ./...

# 执行 TypeScript 测试
test-ts: build-ts
	npm run lint
	npm run test-nowatch -w=@cmfx/core -w=@cmfx/components -w=@cmfx/admin

# 执行测试内容
test: test-go test-ts
