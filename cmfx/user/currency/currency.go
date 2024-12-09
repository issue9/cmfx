// SPDX-FileCopyrightText: 2024 caixw
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

type OverviewVO struct {
	XMLName struct{} `json:"-" yaml:"-" cbor:"-" xml:"overview"`

	Available int64               `json:"available" yaml:"available" cbor:"available" xml:"available"`
	Freeze    int64               `json:"freeze" yaml:"freeze" cbor:"freeze" xml:"freeze"`
	Used      int64               `json:"used" yaml:"used" cbor:"used" xml:"used"`
	Expire    []*OverviewExpireVO `json:"expire,omitempty" yaml:"expire,omitempty" cbor:"expire,omitempty" xml:"expire,omitempty"`
}

type OverviewExpireVO struct {
	Value int64     `json:"value" yaml:"value" cbor:"value" xml:"value"`
	Date  time.Time `json:"date" yaml:"date" cbor:"date" xml:"date"`
}

// GetUserOverview 获取用户 u 的摘要信息
//
// expire Expire 字段返回在此之前过期的积分，如果为空，则 Expire 不返回；
func (m *Module) GetUserOverview(u *user.User, expire time.Time) (*OverviewVO, error) {
	p := &overviewPO{ID: u.ID}
	if found, err := m.db.Select(p); err != nil {
		return nil, err
	} else if !found {
		m.initOverview(nil, u)
		return &OverviewVO{}, nil
	}

	ov := &OverviewVO{
		Available: p.Available,
		Freeze:    p.Freeze,
		Used:      p.Used,
	}

	if !expire.IsZero() {
		ep := make([]*expirePO, 0, 10)
		size, err := m.db.Where("uid=?", u.ID).And("expired<?", expire).Select(true, &ep)
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
func (m *Module) Add(tx *orm.Tx, u *user.User, val uint, memo string, expire time.Time) error {
	isExpire := !expire.IsZero()
	e := m.engine(tx)

	if isExpire && expire.Before(time.Now()) {
		return web.NewLocaleError("expire must b after now")
	}

	overview := &overviewPO{UID: u.ID}
	if found, err := e.Select(overview); err != nil {
		return err
	} else if !found {
		overview = m.initOverview(tx, u)
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

	log := &logPO{
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
		if _, err := e.Where("uid=?", u.ID).And("expired=?", expire).Select(true, ee); err != nil {
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
func (m *Module) Del(tx *orm.Tx, u *user.User, val uint64, memo string) error {
	e := m.engine(tx)
	v := int64(val)

	overview := &overviewPO{UID: u.ID}
	if found, err := e.Select(overview); err != nil {
		return err
	} else if !found {
		overview = m.initOverview(tx, u)
	}

	if overview.Available < v {
		return ErrBalanceNotEnough()
	}

	// 更新 expirePO
	switch {
	case overview.Expire <= v: // 所有 expirePO 的值都置零
		_, err := e.Where("uid=?", u.ID).Update(&expirePO{Value: 0, Expired: time.Time{}}, "value", "expired")
		if err != nil {
			return err
		}
	case overview.Expire > v: // 部分 expirePO 设置为零
		expires := make([]*expirePO, 0, 10)
		size, err := e.Where("uid=?", u.ID).And("value>0").And("expired>?", time.Now()).Select(true, &expires)
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
				switch newVal := vv - exp.Value; {
				case newVal == 0:
					if _, err := e.Update(&expirePO{ID: exp.ID, Value: 0, Expired: time.Time{}}, "value", "expired"); err != nil {
						return err
					}
					vv = 0
					break LOOP
				case newVal > 0:
					if _, err := e.Update(&expirePO{ID: exp.ID, Value: 0, Expired: time.Time{}}, "value", "expired"); err != nil {
						return err
					}
					vv = newVal
				case newVal < 0:
					if _, err := e.Update(&expirePO{ID: exp.ID, Value: -newVal}, "value"); err != nil {
						return err
					}
					vv = 0
				}
			}
		}
	case overview.Expire == 0:
	}

	// 更新 overview
	expire := overview.Expire - v
	if expire < 0 {
		expire = 0
	}
	o2 := &overviewPO{
		ID:        overview.ID,
		Available: overview.Available - v,
		Used:      overview.Used + v,
		Expire:    expire,
	}
	if _, err := e.Update(o2, "expire", "available"); err != nil {
		return err
	}

	// 更新 logPO
	log := &logPO{
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

	log := &logPO{
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

	v := int64(val)
	if (overview.Freeze) < v {
		return ErrBalanceNotEnough()
	}

	o2 := &overviewPO{
		ID:        overview.ID,
		Available: overview.Available + v,
		Freeze:    overview.Freeze - v,
	}
	if _, err := e.Update(o2, "available", "freeze"); err != nil {
		return err
	}

	log := &logPO{
		UID:    u.ID,
		Before: overview.Available,
		After:  o2.Available,
		Value:  +v,
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
func (m *Module) GetLogs(u *user.User, q *LogQuery) (*query.Page[logPO], error) {
	sql := m.db.SQLBuilder().Select().Where("uid=?", u.ID)
	if q.Text.Text != "" {
		text := "%" + q.Text.Text + "%"
		sql.And("memo LIKE ?", text)
	}

	return query.Paging[logPO](&q.Limit, sql, nil)
}
