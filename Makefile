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

# 生成 Go 的依赖内容
gen:
	go generate $(ROOT)/...

# 编译测试项目
build:
web build -o=$(CMD_SERVER)/$(SERVER_BIN) -v $(CMD_SERVER)

# 安装基本数据，依赖上一步的 build 生成的测试项目
install:
	cd $(CMD_SERVER) && ./server -a=install

watch:
	web watch -app=-a=serve $(CMD_SERVER)
