# SPDX-FileCopyrightText: 2024 caixw
#
# SPDX-License-Identifier: MIT

.PHONY: api gen watch build install

ROOT = .
DOCS = $(ROOT)/docs
DEMO = $(ROOT)/demo
CMFX = $(ROOT)/cmfx
ADMIN = $(ROOT)/admin

DOC_API = $(DOCS)/api
DEMO_SERVER = $(DEMO)/server
SERVER_BIN = server

# 生成 API 文件
api:
	web restdoc -t=admin,common -o=$(DOC_API)/admin.yaml $(CMFX)

# 生成 Go 的依赖内容
gen:
	go generate $(ROOT)/...

# 编译测试项目
build:
web build -o=$(DEMO_SERVER)/$(SERVER_BIN) -v $(DEMO_SERVER)

# 安装基本数据，依赖上一步的 build 生成的测试项目
install:
	cd $(DEMO_SERVER) && ./server -a=install

watch:
	web watch -app=-a=serve $(DEMO_SERVER)
