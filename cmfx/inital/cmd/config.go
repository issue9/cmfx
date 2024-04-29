// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmd

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/dialect"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/locales"
)

// Config 配置文件的自定义部分内容
type Config struct {
	// DB 数据库配置
	DB *DB `yaml:"db" xml:"db" json:"db"`

	// URL 路由的基地址
	URL string `yaml:"url" xml:"url" json:"url"`

	// Admin 后台管理员用户的相关配置
	Admin *user.Config `yaml:"admin" xml:"admin" json:"admin"`
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
	if err := c.DB.SanitizeConfig(); err != nil {
		return err.AddFieldParent("db")
	}
	if err := c.Admin.SanitizeConfig(); err != nil {
		return err.AddFieldParent("admin")
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
