# SPDX-FileCopyrightText: 2024-2025 caixw
#
# SPDX-License-Identifier: MIT

ROOT = .
CMD = $(ROOT)/cmd

CMD_SERVER = $(CMD)/server
SERVER_BIN = server

########################### mk-coverage ###################################

.PHONY: mk-coverage gen

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

.PHONY: build build-go build-ts build-cmd
.PHONY: build-ts-vite-plugin-about build-ts-vite-plugin-api build-ts-plugin
.PHONY: build-ts-docs build-ts-core build-ts-components build-ts-admin

build: build-go build-ts

build-cmd: build-go build-ts-admin build-ts-docs

build-ts-plugin: build-ts-vite-plugin-about build-ts-vite-plugin-api

build-go: gen
	go build -o=$(CMD_SERVER)/$(SERVER_BIN) -v $(CMD_SERVER)

build-ts-docs:
	pnpm --filter=./cmd/docs run build

build-ts-vite-plugin-about:
	pnpm --filter=./build/vite-plugin-about run build

build-ts-vite-plugin-api:
	pnpm --filter=./build/vite-plugin-api run build

build-ts-core:
	pnpm --filter=./packages/core run build

build-ts-components:
	pnpm --filter=./packages/components run build

build-ts-admin:
	pnpm --filter=./packages/admin run build

# 编译前端项目内容
build-ts: build-ts-core build-ts-components build-ts-admin build-ts-vite-plugin-about build-ts-vite-plugin-api build-ts-docs
	pnpm --filter=./cmd/admin run build

########################### install ###################################

.PHONY: install install-ts install-go init

install-ts:
	pnpm install

install-go:
	go mod download

# 安装依赖
install: install-go install-ts

# 安装基本数据，依赖 build 生成的测试项目
init: build-cmd
	cd $(CMD_SERVER) && ./server -a=install

########################### watch ###################################

.PHONY: watch-server watch-admin watch-docs watch

watch-server:
	web watch -app=-a=serve $(CMD_SERVER)

watch-admin:
	pnpm --filter=./cmd/admin run dev

watch-docs:
	pnpm --filter=./cmd/docs run dev

# 运行测试内容
#
# 需要采用 -j 执行并行命令，比如：
#  make watch -j2
watch: watch-server watch-admin

########################### test ###################################

.PHONY: lint-ts test test-go test-ts
.PHONY: test-ts-core test-ts-components test-ts-admin
.PHONY: test-ts-vite-plugin-about test-ts-vite-plugin-api

lint-ts:
	pnpm run lint

# 执行 Go 测试
test-go: mk-coverage
	go vet -v ./...
	go test -v -coverprofile='coverage/go.txt' -p=1 -parallel=1 -covermode=atomic ./...

test-ts-vite-plugin-about: mk-coverage
	pnpm run test --project=@cmfx/vite-plugin-about

test-ts-vite-plugin-api: mk-coverage
	pnpm run test --project=@cmfx/vite-plugin-api

test-ts-core: mk-coverage
	pnpm run test --project=@cmfx/core

test-ts-components: mk-coverage build-ts-core
	pnpm run test --project=@cmfx/components

test-ts-admin: mk-coverage build-ts-components
	pnpm run test --project=@cmfx/admin

# 执行 TypeScript 测试
test-ts: lint-ts build-ts mk-coverage
	pnpm run test-nowatch

# 执行测试内容
test: test-go test-ts

############################# changelog ###############################

# 生成 CHANGELOG.md 文件，接受 from 和 to 参数，用于指定生成的范围，一般为 git tag 值。
# to 同时也会作为版本号写入 CHANGELOG.md 文件。
#
# 如果不指定参数
# to 表示最新的提交
# from 表示第一个提交

.PHONY: changelog
to = 'HEAD'
from = '$(shell git rev-list --max-parents=0 HEAD)'

changelog:
	bash ./scripts/changelog.sh $(from) $(to)

########################### publish ###################################

.PHONY: publish-npm

publish-npm: build-ts
	pnpm publish --filter=./packages/core --filter=./packages/components --filter=./packages/admin \
	--filter=./build/vite-plugin-about --filter=./build/vite-plugin-api \
	--access=public --no-git-checks

########################### version ###################################

# 用于修正各个前端包中 package.json 的 version 字段。
# 包含一个参数 target，用以指定需要升级的版本号，可以是 patch、minor 和 major 三个值，默认值为 patch。
#
# NOTE: 大版本号的更新会清零小版本号。

.PHONY: version-ts
target = patch
version-ts:
	pnpm version $(target) --commit-hooks=false --git-tag-version=false --workspaces \
	--include-workspace-root --workspaces-update=false
