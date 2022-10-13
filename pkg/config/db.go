// SPDX-License-Identifier: MIT

package config

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/dialect"
	"github.com/issue9/web/app"

	"github.com/issue9/cmfx/locales"
)

// DB 数据库的配置文件格式
type DB struct {
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

func (conf *DB) SanitizeConfig() *app.ConfigError {
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
		return &app.ConfigError{Field: "type", Value: conf.Type, Message: locales.InvalidValue}
	}

	db, err := orm.NewDB(conf.DSN, d)
	if err != nil {
		return &app.ConfigError{Message: err}
	}
	conf.db = db

	return nil
}

func (conf *DB) DB() *orm.DB { return conf.db }
