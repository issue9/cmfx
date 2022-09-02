// SPDX-License-Identifier: MIT

// 简单的生成枚举数据
//
// 命令行通过 -enum 定义枚举量，可以指定多个，每个之间用分号分隔。
// 单个枚举之间用逗号分隔每个枚举常量名称，其中第一个为枚举名称和枚举方法的 receiver 变量名。
//
//	enums -file=state.go -pkg=enums -enum=state:receiver,states1,states2;state2:receiver,state2s1,state2s2
package main

import (
    "flag"
    "fmt"
    "strings"

    "github.com/issue9/cmfx/pkg/enum"
)

func main() {
    file := flag.String("file", "", "文件名")
    pkg := flag.String("pkg", "", "包名称")
    e := flag.String("enum", "", "枚举的定义")
    flag.Parse()

    if *file == "" {
        panic("file 不能为空")
    }
    if *pkg == "" {
        panic("pkg 不能为空")
    }

    items := strings.Split(*e, ";")
    if len(items) == 0 {
        panic("enum 不能为空")
    }

    enums := make([]*enum.Enum, 0, len(items))
    for _, item := range items {
        fields := strings.Split(item, ",")
        if len(fields) < 2 {
            panic(fmt.Sprintf("%s 未指定元素", fields[0]))
        }

        var name, receiver string
        index := strings.IndexByte(fields[0], ':')
        if index < 0 {
            name = fields[0]
            receiver = fields[0][0:1]
        } else {
            name = fields[0][:index]
            receiver = fields[0][index+1:]
        }
        //
        enums = append(enums, &enum.Enum{
            Name:     name,
            Receiver: receiver,
            Fields:   fields[1:],
        })
    }

    if err := enum.Write(*file, *pkg, enums...); err != nil {
        panic(err)
    }
}
