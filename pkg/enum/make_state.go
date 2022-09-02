// SPDX-License-Identifier: MIT

//go:build ignore

package main

import "github.com/issue9/cmfx/pkg/enum"

func main() {
	if err := enum.Write("./state.go", "enum", &enum.Enum{
		Name:     "State",
		Receiver: "t",
		Fields:   []string{"StateS1", "StateS2"},
	}); err != nil {
		panic(err)
	}
}
