// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package db

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/dialect"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/locales"
)

// Config 数据库的配置项
type Config struct {
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

	db *DB
}

func (conf *Config) SanitizeConfig() *web.FieldError {
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

	db, err := orm.NewDB(conf.DSN, d)
	if err != nil {
		return web.NewFieldError("", err)
	}
	conf.db = db

	return nil
}

func (conf *Config) DB() *DB { return conf.db }
