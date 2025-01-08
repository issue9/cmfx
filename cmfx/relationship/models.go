// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package relationship

type relationshipPO[T1, T2 T] struct {
	V1 T1 `orm:"name(v1);unique(v12)"`
	V2 T2 `orm:"name(v2);unique(v12)"`
}

func (*relationshipPO[T1, T2]) TableName() string { return "_relationships" }
