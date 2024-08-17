# SPDX-FileCopyrightText: 2024 caixw
#
# SPDX-License-Identifier: MIT

.PHONY: api gen watch build install

ROOT = .
DOCS = $(ROOT)/docs
CMD = $(ROOT)/cmd
CMFX = $(ROOT)/cmfx
ADMIN = $(ROOT)/admin

DOC_API = $(DOCS)/api
CMD_SERVER = $(CMD)/server
SERVER_BIN = server

# 生成 API 文件
api:
	web restdoc -t=admin,common -o=$(DOC_API)/admin.yaml $(CMFX)

# 生成中间代码
gen:
	go generate $(ROOT)/...

# 编译测试项目
build-cmd:
	web build -o=$(CMD_SERVER)/$(SERVER_BIN) -v $(CMD_SERVER)
	npm run build -w=cmd/admin

# 编译项目内容
build:
	npm run build -w=admin

# 安装依赖
install:
	go mod download
	npm install

# 安装基本数据，依赖 build 生成的测试项目
init:
	cd $(CMD_SERVER) && ./server -a=install

watch-server:
	web watch -app=-a=serve $(CMD_SERVER)

watch-admin:
	npm run dev -w=cmd/admin

# 运行测试内容
watch: watch-server watch-admin
