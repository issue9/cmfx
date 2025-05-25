// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/relationship"
)

// Install 安装数据
//
// mod 所属模块；tablePrefix 表名前缀；ts 关联的标签列表；
func Install(mod *cmfx.Module, tablePrefix string, ts ...string) *Articles {
	linkage.Install(mod, tablePrefix+"_"+topicsTableName, &linkage.Linkage{Title: "topics"})
	tag.Install(mod, tablePrefix+"_"+tagsTableName, ts...)
	relationship.Install[int64, int64](mod, tablePrefix+"_article_topic")
	relationship.Install[int64, int64](mod, tablePrefix+"_article_tag")

	db := buildDB(mod, tablePrefix)
	if err := db.Create(&snapshotPO{}, &articlePO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return NewArticles(mod, tablePrefix)
}
