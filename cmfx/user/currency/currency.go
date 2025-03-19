// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

// Package currency 提供定义货币支付的相关功能
package currency

import (
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user"
)

type OverviewsVO struct {
	XMLName struct{} `json:"-" yaml:"-" cbor:"-" xml:"overview"`

	UID      int64  `json:"uid" yaml:"uid" cbor:"uid" xml:"uid"`
	NO       string `json:"no" yaml:"no" cbor:"no" xml:"no"`
	Username string `json:"username" yaml:"username" cbor:"username" xml:"username"`

	Available int64 `json:"available" yaml:"available" cbor:"available" xml:"available"`
	Freeze    int64 `json:"freeze" yaml:"freeze" cbor:"freeze" xml:"freeze"`
	Used      int64 `json:"used" yaml:"used" cbor:"used" xml:"used"`
}

type overviewsPO struct {
	overviewPO
	NO       string `orm:"name(no)"`
	Username string `orm:"name(username)"`
}

// GetOverviews 获取所有用户的摘要信息
func (m *Module) GetOverviews(q *query.Text) (*query.Page[OverviewsVO], error) {
	sql := m.db.SQLBuilder().Select().From(orm.TableName(&overviewPO{}), "ov")

	m.user.LeftJoin(sql, "u", "u.id=ov.uid", []user.State{user.StateLocked, user.StateNormal})

	return query.PagingWithConvert(&q.Limit, sql, func(o *overviewsPO) *OverviewsVO {
		return &OverviewsVO{
			UID:       o.UID,
			NO:        o.NO,
			Username:  o.Username,
			Available: o.Available,
			Freeze:    o.Freeze,
			Used:      o.Used,
		}
	})
}

type OverviewVO struct {
	XMLName   struct{}            `json:"-" yaml:"-" cbor:"-" xml:"overview"`
	Available int64               `json:"available" yaml:"available" cbor:"available" xml:"available"`
	Freeze    int64               `json:"freeze" yaml:"freeze" cbor:"freeze" xml:"freeze"`
	Used      int64               `json:"used" yaml:"used" cbor:"used" xml:"used"`
	Expire    []*OverviewExpireVO `json:"expire,omitempty" yaml:"expire,omitempty" cbor:"expire,omitempty" xml:"expire,omitempty"`
}

type OverviewExpireVO struct {
	Value int64     `json:"value" yaml:"value" cbor:"value" xml:"value"`
	Date  time.Time `json:"date" yaml:"date" cbor:"date" xml:"date"`
}

// GetOverview 获取用户 u 的摘要信息
//
// expire Expire 字段返回在此之前过期的积分，如果为空，则 Expire 不返回；
func (m *Module) GetOverview(uid int64, expire time.Time) (*OverviewVO, error) {
	p := &overviewPO{ID: uid}
	if found, err := m.db.Select(p); err != nil {
		return nil, err
	} else if !found {
		m.initOverview(nil, uid)
		return &OverviewVO{}, nil
	}

	ov := &OverviewVO{
		Available: p.Available,
		Freeze:    p.Freeze,
		Used:      p.Used,
	}

	if !expire.IsZero() {
		ep := make([]*expirePO, 0, 10)
		size, err := m.db.Where("uid=?", uid).And("expired<?", expire).Select(true, &ep)
		if err != nil {
			return nil, err
		}

		if size > 0 {
			ov.Expire = make([]*OverviewExpireVO, 0, size)

			for _, item := range ep {
				ov.Expire = append(ov.Expire, &OverviewExpireVO{
					Value: item.Value,
					Date:  item.Expired,
				})
			}
		}
	}

	return ov, nil
}

// Add 添加金额
//
// expire 如果不为空值，表示该积分在到达该时间还未被使用时，将不能再使用。
func (m *Module) Add(tx *orm.Tx, uid int64, val uint, memo string, expire time.Time) error {
	isExpire := !expire.IsZero()
	e := m.engine(tx)

	if isExpire && expire.Before(time.Now()) {
		return web.NewLocaleError("expire must b after now")
	}

	overview := &overviewPO{UID: uid}
	if found, err := e.Select(overview); err != nil {
		return err
	} else if !found {
		overview = m.initOverview(tx, uid)
	}

	v := int64(val)

	ov := &overviewPO{
		ID:        overview.ID,
		Available: overview.Available + v,
	}
	if isExpire {
		ov.Expire += v
	}
	if _, err := e.Update(ov, "available"); err != nil {
		return err
	}

	log := &LogPO{
		UID:    overview.UID,
		Before: overview.Available,
		After:  ov.Available,
		Value:  v,
		Memo:   memo,
	}
	if _, err := e.Insert(log); err != nil {
		return err
	}

	if isExpire {
		ee := &expirePO{}
		if _, err := e.Where("uid=?", uid).And("expired=?", expire).Select(true, ee); err != nil {
			return err
		}

		if ee.ID > 0 { // 存在一条同一时间的记录
			v += ee.Value
		}

		exp := &expirePO{
			UID:     overview.UID,
			Value:   v,
			Expired: expire,
		}
		if _, _, err := e.Save(exp); err != nil {
			return err
		}
	}

	return nil
}

// Del 减少金额
func (m *Module) Del(tx *orm.Tx, uid int64, val uint, memo string) error {
	e := m.engine(tx)
	v := int64(val)

	overview := &overviewPO{UID: uid}
	if found, err := e.Select(overview); err != nil {
		return err
	} else if !found {
		overview = m.initOverview(tx, uid)
	}

	if overview.Available < v {
		return ErrBalanceNotEnough()
	}

	// 更新 expirePO
	switch {
	case overview.Expire <= v: // 所有 expirePO 的值都置零
		_, err := e.Where("uid=?", uid).Update(&expirePO{Value: 0, Expired: time.Time{}}, "value", "expired")
		if err != nil {
			return err
		}
	case overview.Expire > v: // 部分 expirePO 设置为零
		expires := make([]*expirePO, 0, 10)
		size, err := e.Where("uid=?", uid).And("value>0").And("expired>?", time.Now()).Select(true, &expires)
		if err != nil {
			return err
		}
		switch {
		case size == 1: // 就一条记录
			if _, err := e.Update(&expirePO{ID: expires[0].ID, Value: 0, Expired: time.Time{}}, "value", "expired"); err != nil {
				return err
			}
		case size > 1:
			vv := v
		LOOP:
			for _, exp := range expires {
				switch remind := vv - exp.Value; {
				case remind == 0: // 正好一条记录减完所有数据
					if _, err := e.Update(&expirePO{ID: exp.ID, Value: 0, Expired: time.Time{}}, "value", "expired"); err != nil {
						return err
					}
					vv = 0
					break LOOP
				case remind > 0: // 此条记录不够减
					if _, err := e.Update(&expirePO{ID: exp.ID, Value: 0, Expired: time.Time{}}, "value", "expired"); err != nil {
						return err
					}
					vv = remind
				case remind < 0: // 此记录减完之后还有剩余
					if _, err := e.Update(&expirePO{ID: exp.ID, Value: -remind}, "value"); err != nil {
						return err
					}
					break LOOP
				}
			}
		}
	case overview.Expire == 0:
	}

	// 更新 overview
	o2 := &overviewPO{
		ID:        overview.ID,
		Available: overview.Available - v,
		Used:      overview.Used + v,
		Expire:    max(overview.Expire-v, 0),
	}
	if _, err := e.Update(o2, "expire", "available"); err != nil {
		return err
	}

	// 更新 logPO
	log := &LogPO{
		UID:    overview.UID,
		Before: overview.Available,
		After:  o2.Available,
		Value:  -v, // 减少
		Memo:   memo,
	}
	if _, err := e.Insert(log); err != nil {
		return err
	}

	return nil
}

// Freeze 冻结资金
//
// 会过期的资金无法冻结
func (m *Module) Freeze(tx *orm.Tx, u *user.User, val uint, memo string) error {
	e := m.engine(tx)

	overview := &overviewPO{UID: u.ID}
	if _, err := e.Select(overview); err != nil {
		return err
	}

	v := int64(val)
	if (overview.Available - overview.Expire) < v {
		return ErrBalanceNotEnough()
	}

	o2 := &overviewPO{
		ID:        overview.ID,
		Available: overview.Available - v,
		Freeze:    overview.Freeze + v,
	}
	if _, err := e.Update(o2, "available"); err != nil {
		return err
	}

	log := &LogPO{
		UID:    u.ID,
		Before: overview.Available,
		After:  o2.Available,
		Value:  -v,
		Memo:   memo,
		Type:   TypeFreeze,
	}
	_, err := e.Insert(log)
	return err
}

func (m *Module) Unfreeze(tx *orm.Tx, u *user.User, val int64, memo string) error {
	e := m.engine(tx)

	overview := &overviewPO{UID: u.ID}
	if _, err := e.Select(overview); err != nil {
		return err
	}

	if (overview.Freeze) < val {
		return ErrBalanceNotEnough()
	}

	o2 := &overviewPO{
		ID:        overview.ID,
		Available: overview.Available + val,
		Freeze:    overview.Freeze - val,
	}
	if _, err := e.Update(o2, "available", "freeze"); err != nil {
		return err
	}

	log := &LogPO{
		UID:    u.ID,
		Before: overview.Available,
		After:  o2.Available,
		Value:  +val,
		Memo:   memo,
		Type:   TypeUnfreeze,
	}
	_, err := e.Insert(log)
	return err
}

type LogQuery struct {
	query.Text
	Types []Type `query:"type,normal"`
}

// GetLogs 查询日志
func (m *Module) GetLogs(u *user.User, q *LogQuery) (*query.Page[LogPO], error) {
	sql := m.db.SQLBuilder().Select().Where("uid=?", u.ID).From(orm.TableName(&LogPO{}))
	if q.Text.Text != "" {
		text := "%" + q.Text.Text + "%"
		sql.And("memo LIKE ?", text)
	}

	return query.Paging[LogPO](&q.Limit, sql, nil)
}
