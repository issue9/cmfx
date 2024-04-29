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
	web restdoc -o=$(API)/restdoc.json

gen:
	go generate ./...

build:
	web build -o=$(BIN) -v $(TARGET)

install:
	cd $(TARGET) && ./server -a=install

watch:
	web watch -app=-a=serve $(TARGET)
