// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/middleware/v6/health"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/db"
)

// 同时保存至数据库和缓存系统，但读取时只从缓存查找数据。
type healthDBStore struct {
	cache  health.Store
	engine db.ModelEngine
	errlog *web.Logger
}

func newHealthDBStore(mod cmfx.Module) (health.Store, error) {
	store := &healthDBStore{
		cache:  health.NewCacheStore(mod.Server(), mod.ID()+"_health_"),
		engine: mod.DBEngine(nil),
		errlog: mod.Server().Logs().ERROR(),
	}

	// 初始时，从数据库加载数据保存到缓存系统。
	states := make([]*healthModel, 0, 100)
	_, err := store.engine.Where("1=1").Select(true, &states)
	if err != nil {
		return nil, err
	}
	for _, state := range states {
		store.cache.Save(&health.State{
			Route:        state.Route,
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

	mod := &healthModel{
		Route:   state.Route,
		Method:  state.Method,
		Pattern: state.Pattern,
	}
	found, err := s.engine.Select(mod)
	if err != nil {
		s.errlog.Error(err)
		return
	}

	mod = healthModelFromState(state)
	if found {
		_, err = s.engine.Update(mod)
	} else {
		_, err = s.engine.Insert(mod)
	}
	if err != nil {
		s.errlog.Error(err)
	}
}

func (s *healthDBStore) All() []*health.State { return s.cache.All() }

func healthModelFromState(s *health.State) *healthModel {
	return &healthModel{
		Route:        s.Route,
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
