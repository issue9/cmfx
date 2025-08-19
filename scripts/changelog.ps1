# SPDX-FileCopyrightText: 2025 caixw
#
# SPDX-License-Identifier: MIT

# 当前脚本是对 ./changelog.sh 的 powershell 翻译。
# 适合 powershell 7.x，其它版本未测试。

# 用法: .\changelog.ps1 起始tag 结束tag
# 示例: .\changelog.ps1 v1.0.0 v1.1.0

param (
    [string]$FromTag,
    [string]$ToTag
)

$ChangelogFile = "CHANGELOG.md"
$Date = Get-Date -Format "yyyy-MM-dd"

if (-not $FromTag -or -not $ToTag) {
    Write-Host "请提供起始和结束 tag，例如: .\changelog.ps1 v1.0.0 v1.1.0"
    exit 1
}

# 创建临时文件
$TmpChangelog = New-TemporaryFile

Add-Content $TmpChangelog "# CHANGELOG"
Add-Content $TmpChangelog ""
Add-Content $TmpChangelog "## $ToTag ($Date)"
Add-Content $TmpChangelog ""

function Print-Section {
    param (
        [string]$Type,
        [string]$Title
    )

    # 必须要带上 --encoding=gbk 否则会乱码
    $Log = git log "$FromTag..$ToTag" --pretty=format:"- %s (%h)" --encoding=gbk --no-merges `
        --regexp-ignore-case -E --grep="^$Type\([^)]*\):" |
        ForEach-Object {
            $_ -replace "- $Type\(([^)]*)\):(.*)", '$1:$2'
        }

    if ($Log) {
        Add-Content $TmpChangelog "### $Title"
        Add-Content $TmpChangelog ""
        $Log | ForEach-Object { Add-Content $TmpChangelog $_ }
        Add-Content $TmpChangelog ""
    }
}

Print-Section "feat" "新功能"
Print-Section "fix" "修复问题"
Print-Section "perf" "性能优化"

if (-not (Test-Path $ChangelogFile)) { # 文件不存在
    Get-Content $TmpChangelog | Select-Object -SkipLast 1 | Set-Content $ChangelogFile
} else { # 文件存在
    $NewFile = "${ChangelogFile}.new"
    Get-Content $TmpChangelog | Set-Content $NewFile
    Get-Content $ChangelogFile | Select-Object -Skip 2 | Add-Content $NewFile
    Move-Item -Force $NewFile $ChangelogFile
}

Remove-Item $TmpChangelog

Write-Host "CHANGELOG 已更新到 $ChangelogFile"
