// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmd

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/dialect"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/initial"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
	"github.com/issue9/cmfx/locales"
)

// Config 配置文件的自定义部分内容
type Config struct {
	// URL 路由的基地址
	URL string `yaml:"url" xml:"url" json:"url"`

	// Ratelimit API 限速的配置
	Ratelimit *initial.Ratelimit `yaml:"ratelimit" xml:"ratelimit" json:"ratelimit"`

	// DB 数据库配置
	DB *DB `yaml:"db" xml:"db" json:"db"`

	// Admin 后台管理员用户的相关配置
	Admin *admin.Config `yaml:"admin" xml:"admin" json:"admin"`

	// System 系统模块的相关配置
	System *system.Config `yaml:"system,omitempty" xml:"system,omitempty" json:"system,omitempty"`
}

// DB 数据库的配置项
type DB struct {
	// Prefix 表名前缀
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

	if c.System != nil {
		if err := c.System.SanitizeConfig(); err != nil {
			return err.AddFieldParent("system")
		}
	}

	return nil
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

// DB 返回根据配置项生成的 [orm.DB] 实例
//
// 调用 [DB.SanitizeConfig] 之后生成。
func (conf *DB) DB() *orm.DB { return conf.db }
