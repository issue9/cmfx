// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmd

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/dialect"
	"github.com/issue9/web"
	"github.com/issue9/web/filter"
	"github.com/issue9/web/server/config"

	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/member"
	"github.com/issue9/cmfx/cmfx/modules/system"
)

// Config 配置文件的自定义部分内容
type Config struct {
	// Ratelimit API 限速的配置
	Ratelimit *Ratelimit `yaml:"ratelimit" xml:"ratelimit" json:"ratelimit"`

	// DB 数据库配置
	DB *DB `yaml:"db" xml:"db" json:"db"`

	// Admin 后台管理员用户的相关配置
	Admin *admin.Config `yaml:"admin" xml:"admin" json:"admin"`

	// System 系统模块的相关配置
	System *system.Config `yaml:"system" xml:"system" json:"system"`

	Member *member.Config `yaml:"member" xml:"member" json:"member"`
}

func (c *Config) SanitizeConfig() *web.FieldError {
	if c.Ratelimit == nil {
		return web.NewFieldError("ratelimit", locales.Required)
	}
	if err := c.Ratelimit.SanitizeConfig(); err != nil {
		return err.AddFieldParent("ratelimit")
	}

	if c.DB == nil {
		return web.NewFieldError("db", locales.Required)
	}
	if err := c.DB.SanitizeConfig(); err != nil {
		return err.AddFieldParent("db")
	}

	if c.Admin == nil {
		return web.NewFieldError("admin", locales.Required)
	}
	if err := c.Admin.SanitizeConfig(); err != nil {
		return err.AddFieldParent("admin")
	}

	if c.System == nil {
		return web.NewFieldError("system", locales.Required)
	}
	if err := c.System.SanitizeConfig(); err != nil {
		return err.AddFieldParent("system")
	}

	if c.Member == nil {
		return web.NewFieldError("member", locales.Required)
	}
	if err := c.Member.SanitizeConfig(); err != nil {
		return err.AddFieldParent("member")
	}

	return nil
}

// DB 数据库的配置项
type DB struct {
	// 表名前缀
	//
	// 可以为空。
	Prefix string `yaml:"prefix,omitempty" json:"prefix,omitempty" xml:"prefix,attr,omitempty"`

	// 表示数据库的类型
	//
	// 目前支持以下几种类型：
	//  - sqlite3
	//  - sqlite 纯 Go
	//  - mysql
	//  - mariadb
	//  - postgres
	Type string `yaml:"type" json:"type" xml:"type,attr"`

	// 连接数据库的参数
	DSN string `yaml:"dsn" json:"dsn" xml:"dsn"`

	db *orm.DB
}

func (conf *DB) SanitizeConfig() *web.FieldError {
	var d orm.Dialect
	switch conf.Type {
	case "sqlite3":
		d = dialect.Sqlite3("sqlite3")
	case "sqlite":
		d = dialect.Sqlite3("sqlite")
	case "mysql":
		d = dialect.Mysql("mysql")
	case "mariadb":
		d = dialect.Mariadb("mysql")
	case "postgres":
		d = dialect.Postgres("postgres")
	default:
		err := web.NewFieldError("type", locales.InvalidValue)
		err.Value = conf.Type
		return err
	}

	db, err := orm.NewDB(conf.Prefix, conf.DSN, d)
	if err != nil {
		return web.NewFieldError("", err)
	}
	conf.db = db

	return nil
}

func (conf *DB) DB() *orm.DB { return conf.db }

// Ratelimit API 访问限制
type Ratelimit struct {
	Prefix   string          `yaml:"prefix" json:"prefix" xml:"prefix"`            // 在缓存系统中前缀，保证数据的唯一性
	Rate     config.Duration `yaml:"rate" json:"rate" xml:"rate"`                  // 发放令牌的频率
	Capacity uint64          `yaml:"capacity" json:"capacity" xml:"capacity,attr"` // 令牌桶的最高容量
}

func (r *Ratelimit) SanitizeConfig() *web.FieldError {
	return filter.ToFieldError(
		filters.NotEmpty("prefix", &r.Prefix),
		filters.GreatEqual[config.Duration](0)("rate", &r.Rate),
		filters.GreatEqual[uint64](10)("capacity", &r.Capacity),
	)
}
