// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"os"
	"path/filepath"
	"time"

	"github.com/issue9/scheduled/schedulers/cron"
	"github.com/issue9/web"
	"github.com/issue9/web/locales"
)

// Config 配置项
type Config struct {
	// Backup 备份数据的选项
	Backup *Backup `yaml:"backup,omitempty" json:"backup,omitempty" xml:"backup,omitempty"`
}

// Backup 备份数据的相关设置项
type Backup struct {
	// 备份文件的路径
	Dir string `json:"dir" yaml:"dir" xml:"dir"`

	// 备份的文件格式
	Format string `json:"format" yaml:"format" xml:"format"`

	// 备份任务的执行时间
	Cron string `yaml:"cron" json:"cron" xml:"cron"`

	// 生成备份文件的文件名
	buildFile func(time time.Time) string
}

func (c *Config) SanitizeConfig() *web.FieldError {
	if c.Backup != nil {
		if err := c.Backup.SanitizeConfig(); err != nil {
			return err.AddFieldParent("backup")
		}
	}

	return nil
}

func (b *Backup) SanitizeConfig() *web.FieldError {
	if b.Dir == "" {
		return web.NewFieldError("dir", locales.CanNotBeEmpty)
	}

	stat, err := os.Stat(b.Dir)
	if err != nil {
		return web.NewFieldError("dir", err)
	}
	if !stat.IsDir() {
		return web.NewFieldError("dir", web.Phrase("must be a dir"))
	}

	if b.Cron == "" {
		return web.NewFieldError("cron", locales.CanNotBeEmpty)
	}
	if _, err := cron.Parse(b.Cron, time.UTC); err != nil {
		return web.NewFieldError("cron", err)
	}

	b.buildFile = func(now time.Time) string {
		return filepath.Join(b.Dir, now.Format(b.Format))
	}

	return nil
}
