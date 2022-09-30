// SPDX-License-Identifier: MIT

// Package store 提供对 setting.Store 的实现
package store

import "encoding/json"

func unmarshal(s string, v any) error {
	data := []byte(s)
	return json.Unmarshal(data, v)
}

func marshal(v any) (string, error) {
	s, err := json.Marshal(v)
	if err != nil {
		return "", err
	}
	return string(s), nil
}
