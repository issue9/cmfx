// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 定义两个对象之间的相互转换接口
 */
export interface Converter<T, F> {
	/**
	 * 将地址栏中的参数转换为类型 Q
	 */
	to(params: F): T;

	/**
	 * 将类型 Q 转换为符合地址栏中的参数类型
	 */
	from(query: T): F;
}
