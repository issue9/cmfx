// SPDX-License-Identifier: MIT

package cmfx

import (
	"fmt"
	"os"

	"github.com/issue9/web"
)

type Chain struct {
	Err error
}

func NewChain() *Chain { return &Chain{} }

func (c *Chain) Next(f func() error) *Chain {
	if c.Err == nil {
		c.Err = f()
	}
	return c
}

// Fatal 如果存在错误则输出错误并以 code 退出
func (c *Chain) Fatal(l web.Logger, code int) {
	if c.Err != nil {
		l.Printf("%+v\n", c.Err)
		os.Exit(code)
	}
}

// Panic 如果存在错误则 Panic
func (c *Chain) Panic() {
	if c.Err != nil {
		panic(fmt.Sprintf("%+v\n", c.Err))
	}
}
