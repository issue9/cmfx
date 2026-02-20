// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

export const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export type Method = (typeof methods)[number];

/**
 * 接口错误返回的对象
 *
 * @typeParam E - 表示 {@link extension} 字段的类型，如果该字段空值，不需要指定。
 */
export interface Problem<E = never> {
	type: string;
	title: string;
	status: number;
	detail?: string;
	instance?: string;
	extension?: E;
	headers?: Headers;

	/**
	 * 具体的错误字段
	 *
	 * 根据 {@link status} 的不同，可能表示提交对象、查询参数或是报头的错误。
	 */
	params?: Params;
}

/**
 * 表示字段错误的列表
 *
 * @remarks
 * 同时表示了后端返回的 {@link Problem#params} 以及在前端数据验证中表示的验证错误。
 *
 * @typeParam K - 表示字段名的类型，默认为 string，但是在前端的数据验证中，可以收紧为某个对象的 keyof。
 */
export type Params<K extends string = string> = Array<{
	/**
	 * 表示出错的字段名
	 */
	name: K;

	/**
	 * 错误信息
	 */
	reason: string;
}>;

/**
 * 接口返回的对象
 *
 * @typeParam R - 表示在接口操作成功的情况下返回的类型，如果为空表示 never；
 * @typeParam PE - 表示在接口操作失败之后，{@link Problem#extension} 字段的类型，如果该字段为空值，表示为 never；
 */
export type Return<R = never, PE = never> =
	| {
			/**
			 * 返回的报头
			 */
			headers?: Headers;

			/**
			 * 服务端返回的类型
			 */
			body?: Problem<PE>;

			/**
			 * 状态码
			 */
			status: number;

			/**
			 * 是否出错了
			 */
			ok: false;
	  }
	| {
			/**
			 * 返回的报头
			 */
			headers?: Headers;

			/**
			 * 服务端返回的类型
			 */
			body?: R;

			/**
			 * 状态码
			 */
			status: number;

			/**
			 * 是否出错了
			 */
			ok: true;
	  };

/**
 * 分页接口返回的对象
 *
 * @typeParam T - 表示当前页的类型
 */
export interface Page<T> {
	count: number;
	current: Array<T>;
	more?: boolean;
}
