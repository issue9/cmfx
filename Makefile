# SPDX-FileCopyrightText: 2024 caixw
#
# SPDX-License-Identifier: MIT

.PHONY: api gen watch build install

ROOT = .
DOCS = $(ROOT)/docs
API = $(DOCS)/api
TARGET = $(ROOT)/cmd/server
BIN = $(TARGET)/server

dist = ./dist

# 生成 API 文件
api:
	web restdoc -o=$(API)/restdoc.json $(ROOT)/cmfx

# 生成 go 的依赖内容
gen:
	go generate ./...

# 编译测试项目
build:
	web build -o=$(BIN) -v $(TARGET)

# 安装基本数据，依赖上一步的 build 生成的测试项目
install:
	cd $(TARGET) && ./server -a=install

watch:
	web watch -app=-a=serve $(TARGET)
