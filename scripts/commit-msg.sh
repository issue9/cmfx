#!/bin/sh

# 获取当前提交的 commit msg
commit_msg=$(cat "$1")
msg_reg="^(feat|fix|docs|style|refactor|perf|test|ci|chore|revert|typo|community|build|release|deps)(\(.+\))?!?: .{1,80}"

if echo "$commit_msg" | grep -Eq "$msg_reg"; then
    exit 0
else
    echo -e "\n❌ 不合法的消息格式，请使用正确的格式：\n  <type>(<scope>): <subject>\n"
    exit 1
fi
