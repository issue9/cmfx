// SPDX-License-Identifier: MIT

package setting

import (
	"fmt"
	"reflect"
)

var _ Store = &memoryStore{}

type memoryStore struct {
	items map[string]any
}

func newMemoryStore() Store { return &memoryStore{items: make(map[string]any, 3)} }

func (s *memoryStore) Update(id string, v any) error {
	s.items[id] = v
	return nil
}

func (s *memoryStore) Insert(id string, v any) error { return s.Update(id, v) }

func (s *memoryStore) Load(id string, v any) error {
	vv, found := s.items[id]
	if !found {
		return fmt.Errorf("not found %s", id)
	}

	rv := reflect.ValueOf(vv)
	for rv.Kind() == reflect.Pointer {
		rv = rv.Elem()
	}

	rv2 := reflect.ValueOf(v)
	for rv2.Kind() == reflect.Pointer {
		rv2 = rv2.Elem()
	}

	rv2.Set(rv)
	return nil
}

func (s *memoryStore) Exists(id string) (bool, error) {
	_, found := s.items[id]
	return found, nil
}
