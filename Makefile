# SPDX-FileCopyrightText: 2024-2025 caixw
#
# SPDX-License-Identifier: MIT

.PHONY: gen build-cmd build-ts install install-ts install-go init watch-server watch-admin watch-components watch test test-go test-ts publish-npm

ROOT = .
CMD = $(ROOT)/cmd

CMD_SERVER = $(CMD)/server
SERVER_BIN = server

# 生成中间代码
gen:
	go generate $(ROOT)/...

# 编译测试项目
build-cmd: gen
	go build -o=$(CMD_SERVER)/$(SERVER_BIN) -v $(CMD_SERVER)
	pnpm --filter=./cmd/admin --filter=./cmd/components run build

# 编译前端项目内容
build-ts:
	pnpm --filter=./packages/core --filter=./packages/components --filter=./packages/admin run build
	
install-ts:
	pnpm install

install-go:
	go mod download

# 安装依赖
install: install-go install-ts

# 安装基本数据，依赖 build 生成的测试项目
init: build-cmd
	cd $(CMD_SERVER) && ./server -a=install

watch-server:
	web watch -app=-a=serve $(CMD_SERVER)

watch-admin:
	pnpm --filter=./cmd/admin run dev

watch-components:
	pnpm --filter=./cmd/components run dev

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
test-ts:
	pnpm run lint
	pnpm run test-nowatch

# 执行测试内容
test: test-go test-ts

publish-npm: build-ts
	pnpm publish --filter=./packages/core --filter=./packages/components --filter=./packages/admin --access=public
