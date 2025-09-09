#!/bin/bash

# SPDX-FileCopyrightText: 2025 caixw
#
# SPDX-License-Identifier: MIT

# NOTE: 当前脚本仅适用于 *nix 系统。

# 用法: ./changelog.sh [起始 tag] [结束 tag]
# 示例: ./changelog.sh v1.0.0 v1.1.0

FROM_TAG=$1
TO_TAG=$2
CHANGELOG_FILE="CHANGELOG.md"
DATE=$(date +"%Y-%m-%d")

if [ -z "$FROM_TAG" ] || [ -z "$TO_TAG" ]; then
    echo "请提供起始和结束 tag，例如: ./changelog.sh v1.0.0 v1.1.0"
    exit 1
fi

# 临时保存 CHANGELOG 内容的
TMP_CHANGELOG=$(mktemp)

# 输出标题
printf "# CHANGELOG\n\n" >> "$TMP_CHANGELOG"

# 输出当前版本的标题
printf "## %s\n\n" "$TO_TAG ($DATE)" >> "$TMP_CHANGELOG"

function print_section() {
    local TYPE=$1
    local TITLE=$2
    local LOG

    LOG=$(git log "$FROM_TAG..$TO_TAG" --pretty=format:"- %s (%h)" --no-merges \
        --regexp-ignore-case -E --grep="^$TYPE(\([^)]*\))?!?:" \
        | sed -E "s/- $TYPE(\(([^)]*)\))?!?:(.*)/\2:\3\n/; s/^:[[:space:]]//g")

    if [ -n "$LOG" ]; then
        printf "### %s\n\n" "$TITLE" >> "$TMP_CHANGELOG"

        printf "%s\n\n" "$LOG" >> "$TMP_CHANGELOG"
    fi
}

print_section "feat" "新功能"
print_section "fix" "修复问题"
print_section "perf" "性能优化"

# 如果 CHANGELOG.md 不存在，直接创建。
if [ ! -f "$CHANGELOG_FILE" ]; then
    < "$TMP_CHANGELOG" sed '$d' > "$CHANGELOG_FILE"
else
    # 插入到文件顶部（保留原内容）
    cat "$TMP_CHANGELOG" > "${CHANGELOG_FILE}.new"
    < "$CHANGELOG_FILE" sed '1,2d' >> "${CHANGELOG_FILE}.new"
    mv "${CHANGELOG_FILE}.new" "$CHANGELOG_FILE"
fi

rm "$TMP_CHANGELOG"

echo "CHANGELOG 已更新到 $CHANGELOG_FILE"
