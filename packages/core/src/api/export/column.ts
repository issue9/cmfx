// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 定义导出列的相关信息
 *
 * @typeParam T - 导出数据中每行数据的类型
 */
export interface Column<T extends object> {
	/**
	 * 导出列在对象 T 中的字段名，如果是自定义列，也可以是不存在于 T 中。
	 */
	id: string | keyof T;

	/**
	 * 导出列的标题，如果为空将直接采用 id
	 */
	label?: string;

	/**
	 * 如果导出列的内容需要进行转换可以使用此方法进行转换
	 */
	content?: CellRenderFunc<T>;

	/**
	 * 该列不需要导出
	 */
	isUnexported?: boolean;
}

/**
 * 导出数据每个单元格允许的类型
 */
export type CellType = string | number | boolean | Date | null | undefined;

/**
 * 判断参数 val 的类型是否为 {@link CellType}
 */
export function isCellType(val: unknown): val is CellType {
	return (
		typeof val === 'string' ||
		typeof val === 'number' ||
		typeof val === 'boolean' ||
		val instanceof Date ||
		val === null ||
		val === undefined
	);
}

/**
 * 渲染单元格的方法
 * @param id - 同 {@link Column#id}；
 * @param val - 如果该 id 存在于 T 中，那返回其在 T 中当前行的值，如果不存在则是 undefined；
 * @param obj - 表示是当前行的对象，其类型为 T；
 */
export type CellRenderFunc<T extends object> = <K extends keyof T>(
	id: string | K,
	val?: K extends keyof T ? T[K] : unknown,
	obj?: T,
) => CellType;
