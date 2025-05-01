# SPDX-FileCopyrightText: 2024-2025 caixw
#
# SPDX-License-Identifier: MIT

.PHONY: gen mk-coverage build-cmd build-ts install install-ts install-go init watch-server watch-admin watch-components watch test test-go test-ts publish-npm

ROOT = .
CMD = $(ROOT)/cmd

CMD_SERVER = $(CMD)/server
SERVER_BIN = server

########################### mk-coverage ###################################

COVERAGE = $(ROOT)/coverage
ifeq ($(OS),Windows_NT)
	MKCOVERAGE = mkdir "$(COVERAGE)" 2>NUL || exit 0
else
	MKCOVERAGE = mkdir -p $(COVERAGE)
endif

mk-coverage:
	$(MKCOVERAGE)

# 生成中间代码
gen:
	go generate $(ROOT)/...

########################### build ###################################

# 编译测试项目
build-cmd: gen
	go build -o=$(CMD_SERVER)/$(SERVER_BIN) -v $(CMD_SERVER)
	pnpm --filter=./cmd/admin --filter=./cmd/components run build

build-ts-core:
	pnpm --filter=./packages/core run build

build-ts-components:
	pnpm --filter=./packages/components run build

build-ts-admin:
	pnpm --filter=./packages/admin run build

# 编译前端项目内容
build-ts:
	pnpm --filter=./packages/core --filter=./packages/components --filter=./packages/admin run build
	
########################### install ###################################

install-ts:
	pnpm install -w

install-go:
	go mod download

# 安装依赖
install: install-go install-ts

# 安装基本数据，依赖 build 生成的测试项目
init: build-cmd
	cd $(CMD_SERVER) && ./server -a=install

########################### watch ###################################

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

########################### test ###################################

# 执行 Go 测试
test-go: mk-coverage
	go vet -v ./...
	go test -v -coverprofile='coverage/go.txt' -p=1 -parallel=1 -covermode=atomic ./...

test-ts-core: mk-coverage
	pnpm run lint
	pnpm run test --project=@cmfx/core

test-ts-components: mk-coverage build-ts-core
	pnpm run lint
	pnpm run test --project=@cmfx/components

test-ts-admin: mk-coverage build-ts-components
	pnpm run lint
	pnpm run test --project=@cmfx/admin

# 执行 TypeScript 测试
test-ts: build-ts mk-coverage
	pnpm run lint
	pnpm run test-nowatch

# 执行测试内容
test: test-go test-ts

########################### publish ###################################

publish-npm: build-ts
	pnpm publish --filter=./packages/core --filter=./packages/components --filter=./packages/admin --access=public --no-git-checks
