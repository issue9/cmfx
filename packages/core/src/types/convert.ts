// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 定义两个对象之间的相互转换接口
 */
export interface Converter<T, F> {
	/**
	 * 将类型 F 转换为类型 T
	 */
	to(f: F): T;

	/**
	 * 将类型 T 转换为类型 F
	 */
	from(t: T): F;
}
