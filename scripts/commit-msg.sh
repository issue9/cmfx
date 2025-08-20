#!/bin/sh

# 获取当前提交的 commit msg
commit_msg=$(cat "$1")
msg_reg="^(feat|fix|docs|style|refactor|perf|test|ci|chore|revert|build|release)(\(.+\))?: .{1,80}"

case "$commit_msg" in
  *"$msg_reg"*) # 匹配成功时的操作
    ;;
  *)
    echo "\n不合法的消息格式，请使用正确的格式\n <type>(<scope>): <subject>"
    exit 1
    ;;
esac
