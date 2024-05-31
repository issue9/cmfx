// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/plugins/health"

	"github.com/issue9/cmfx/cmfx"
)

// 同时保存至数据库和缓存系统，但读取时只从缓存查找数据。
type healthDBStore struct {
	cache  health.Store
	db     *orm.DB
	errlog *web.Logger
}

func newHealthDBStore(mod *cmfx.Module) (health.Store, error) {
	store := &healthDBStore{
		cache:  health.NewCacheStore(mod.Server(), mod.ID()+"_health_"),
		db:     mod.DB(),
		errlog: mod.Server().Logs().ERROR(),
	}

	// 初始时，从数据库加载数据保存到缓存系统。
	states := make([]*modelHealth, 0, 100)
	_, err := store.db.Where("1=1").Select(true, &states)
	if err != nil {
		return nil, err
	}
	for _, state := range states {
		store.cache.Save(&health.State{
			Router:       state.Router,
			Method:       state.Method,
			Pattern:      state.Pattern,
			Min:          state.Min,
			Max:          state.Max,
			Count:        state.Count,
			UserErrors:   state.UserErrors,
			ServerErrors: state.ServerErrors,
			Last:         state.Last,
			Spend:        state.Spend,
		})
	}

	return store, nil
}

func (s *healthDBStore) Get(route, method, pattern string) *health.State {
	return s.cache.Get(route, method, pattern)
}

func (s *healthDBStore) Save(state *health.State) {
	s.cache.Save(state)

	// 保存到数据库

	mod := &modelHealth{
		Router:  state.Router,
		Method:  state.Method,
		Pattern: state.Pattern,
	}
	found, err := s.db.Select(mod)
	if err != nil {
		s.errlog.Error(err)
		return
	}

	mod = healthModelFromState(state)
	if found {
		_, err = s.db.Update(mod)
	} else {
		_, err = s.db.Insert(mod)
	}
	if err != nil {
		s.errlog.Error(err)
	}
}

func (s *healthDBStore) All() []*health.State { return s.cache.All() }

func healthModelFromState(s *health.State) *modelHealth {
	return &modelHealth{
		Router:       s.Router,
		Method:       s.Method,
		Pattern:      s.Pattern,
		Min:          s.Min,
		Max:          s.Max,
		Count:        s.Count,
		UserErrors:   s.UserErrors,
		ServerErrors: s.ServerErrors,
		Last:         s.Last,
		Spend:        s.Spend,
	}
}
