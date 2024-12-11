// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package currency

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

func TestCurrency(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	u := usertest.NewModule(s)
	Install(u, "point")
	m := Load(u, "point")
	a.NotNil(m)

	u1, err := u.GetUserByUsername("u1")
	a.NotError(err).NotNil(u1)

	expire := time.Now().Add(time.Hour)

	t.Run("Add", func(t *testing.T) {
		a.NotError(m.Add(nil, u1, 10, "+10", time.Time{}))
		ov := &overviewPO{UID: u1.ID}
		_, err = m.db.Select(ov)
		a.NotError(err).Equal(ov.Available, 10).
			Zero(ov.Freeze).
			Zero(ov.Expire).
			Zero(ov.Freeze)

		log := &LogPO{}
		_, err = m.db.Where("uid=?", u1.ID).Select(true, log)
		a.NotError(err).
			Equal(log.Value, 10).
			Equal(log.Type, TypeNormal).
			Equal(log.Before, 0).
			Equal(log.After, 10)

		// add with expire

		a.NotError(m.Add(nil, u1, 10, "+10", expire))
		ov = &overviewPO{UID: u1.ID}
		_, err = m.db.Select(ov)
		a.NotError(err).Equal(ov.Available, 20).
			Zero(ov.Used).
			Equal(ov.Expire, 10).
			Zero(ov.Freeze)

		size, err := m.db.Where("uid=?", u1.ID).Count(&LogPO{})
		a.NotError(err).Equal(size, 2)
	})

	t.Run("GetOverview", func(t *testing.T) {
		vo, err := m.GetOverview(u1, time.Now())
		a.NotError(err).Equal(vo, &OverviewVO{Available: 20})

		vo, err = m.GetOverview(u1, expire.Add(time.Hour))
		a.NotError(err).Equal(vo.Available, 20).
			Length(vo.Expire, 1).
			Equal(vo.Expire[0].Value, 10).
			Equal(vo.Expire[0].Date.Unix(), expire.Unix())
	})

	t.Run("GetOverviews", func(t *testing.T) {
		vo, err := m.GetOverviews(&query.Text{Limit: query.Limit{Size: 10, Page: 0}})
		a.NotError(err).Length(vo.Current, 1)

		vo, err = m.GetOverviews(&query.Text{Limit: query.Limit{Size: 10, Page: 0}})
		a.NotError(err).Length(vo.Current, 1)
	})

	t.Run("Del", func(t *testing.T) {
		m.Del(nil, u1, 5, "-5")

		ov := &overviewPO{UID: u1.ID}
		_, err = m.db.Select(ov)
		a.NotError(err).Equal(ov.Available, 15).
			Zero(ov.Freeze).
			Equal(ov.Expire, 5).
			Equal(ov.Used, 5)

		size, err := m.db.Where("uid=?", u1.ID).Count(&LogPO{})
		a.NotError(err).Equal(size, 3)

		m.Del(nil, u1, 10, "-10")

		ov = &overviewPO{UID: u1.ID}
		_, err = m.db.Select(ov)
		a.NotError(err).Equal(ov.Available, 5).
			Zero(ov.Freeze).
			Zero(ov.Expire).
			Equal(ov.Used, 15)

		size, err = m.db.Where("uid=?", u1.ID).Count(&LogPO{})
		a.NotError(err).Equal(size, 4)
	})

	t.Run("Freeze", func(t *testing.T) {
		a.Equal(m.Freeze(nil, u1, 50, "freeze"), ErrBalanceNotEnough())

		a.NotError(m.Freeze(nil, u1, 5, "freeze"))

		ov := &overviewPO{UID: u1.ID}
		_, err = m.db.Select(ov)
		a.NotError(err).Zero(ov.Available).
			Equal(ov.Freeze, 5).
			Zero(ov.Expire).
			Equal(ov.Used, 15)

		size, err := m.db.Where("uid=?", u1.ID).Count(&LogPO{})
		a.NotError(err).Equal(size, 5)
	})

	t.Run("Unfreeze", func(t *testing.T) {
		a.Equal(m.Unfreeze(nil, u1, 50, "unfreeze"), ErrBalanceNotEnough())

		a.NotError(m.Unfreeze(nil, u1, 5, "unfreeze"))

		ov := &overviewPO{UID: u1.ID}
		_, err = m.db.Select(ov)
		a.NotError(err).Equal(ov.Available, 5).
			Zero(ov.Freeze).
			Zero(ov.Expire).
			Equal(ov.Used, 15)

		size, err := m.db.Where("uid=?", u1.ID).Count(&LogPO{})
		a.NotError(err).Equal(size, 6)
	})
}
