// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { API } from './api';

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

interface ReturnBase {
	/**
	 * 返回的报头
	 */
	headers?: Headers;

	/**
	 * 状态码
	 */
	status: number;
}

/**
 * 接口返回的对象
 *
 * @typeParam R - 表示在接口操作成功的情况下返回的类型；
 * @typeParam PE - 表示在接口操作失败之后，{@link Problem#extension} 字段的类型；
 */
export type Return<R = unknown, PE = never> =
	| (ReturnBase & {
			/**
			 * 是否出错了
			 */
			ok: true;

			/**
			 * 服务端返回的类型
			 */
			body?: R;
	  })
	| (ReturnBase & {
			/**
			 * 是否出错了
			 */
			ok?: false;

			/**
			 * 服务端返回的类型
			 */
			body?: Problem<PE>;
	  });

/**
 * API 请求时的额外参数
 */
export type ReqInit = Omit<RequestInit, 'method' | 'body'>;

/**
 * RESTful 接口的基本操作方法
 */
export interface REST {
	/**
	 * 返回关联的 {@link API} 对象
	 */
	api(): API;

	/**
	 * DELETE 请求
	 *
	 * @param path - 相对于 {@link API#baseURL} 的请求地址；
	 * @param token - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 init.headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	delete<R = unknown, PE = never>(path: string, token?: boolean, init?: ReqInit): Promise<Return<R, PE>>;

	/**
	 * POST 请求
	 *
	 * @param path - 相对于 {@link API#baseURL} 的请求地址；
	 * @param body - 请求对象，会由 {@link Serializer} 进行转换，可以为空；
	 * @param token - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 init.headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	post<R = unknown, PE = never>(path: string, body?: unknown, token?: boolean, init?: ReqInit): Promise<Return<R, PE>>;

	/**
	 * PUT 请求
	 *
	 * @param path - 相对于 {@link API#baseURL} 的请求地址；
	 * @param body - 请求对象，会由 {@link Serializer} 进行转换，可以为空；
	 * @param token - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 init.headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	put<R = unknown, PE = never>(path: string, body?: unknown, token?: boolean, init?: ReqInit): Promise<Return<R, PE>>;

	/**
	 * PATCH 请求
	 *
	 * @param path - 相对于 {@link API#baseURL} 的请求地址；
	 * @param body - 请求对象，会由 #contentSerializer 进行转换，可以为空；
	 * @param token - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 init.headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	patch<R = unknown, PE = never>(path: string, body?: unknown, token?: boolean, init?: ReqInit): Promise<Return<R, PE>>;

	/**
	 * GET 请求
	 *
	 * @param path - 相对于 {@link API#baseURL} 的请求地址；
	 * @param token - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 init.headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	get<R = unknown, PE = never>(path: string, token?: boolean, init?: ReqInit): Promise<Return<R, PE>>;

	/**
	 * 执行普通的 API 请求
	 *
	 * @param path - 相对于 {@link API#baseURL} 的请求地址；
	 * @param method - 请求方法；
	 * @param obj - 请求对象，会由 #contentSerializer 进行转换，如果是 GET，可以为空；
	 * @param token - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 * @typeParam R - 表示在接口操作成功的情况下返回的类型，如果不需要该数据可设置为 never；
	 * @typeParam PE - 表示在接口操作失败之后，{@link Problem#extension} 字段的类型，如果该字段为空值，可设置为 never；
	 */
	request<R = unknown, PE = never>(
		path: string,
		method: Method,
		obj?: unknown,
		token?: boolean,
		init?: ReqInit,
	): Promise<Return<R, PE>>;

	/**
	 * 执行上传操作
	 *
	 * @param path - 相对于 {@link API#baseURL} 的上传地址；
	 * @param obj - 上传的对象；
	 * @param token - 是否需要带上令牌，如果为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 init.headers 参数的相关设置覆盖；
	 * @param method - 请求方法，默认为 'POST'；
	 * @param init - 请求的额外参数；
	 */
	upload<R = unknown, PE = never>(
		path: string,
		obj: FormData,
		method?: 'POST' | 'PATCH' | 'PUT',
		token?: boolean,
		init?: ReqInit,
	): Promise<Return<R, PE>>;
}

export function createREST(api: API, init?: Omit<ReqInit, 'signal'>): REST {
	const mergeInit = (r?: ReqInit): ReqInit | undefined => {
		if (!init && !r) {
			return undefined;
		}
		if (init && !r) {
			return init;
		}
		if (r && !init) {
			return r;
		}
		return Object.assign(init!, r);
	};

	const request = async <R = unknown, PE = never>(
		path: string,
		method: Method,
		obj?: unknown,
		token = true,
		init?: ReqInit,
	) => {
		return await api.request<R, PE>(path, method, obj, token, mergeInit(init));
	};

	return {
		request,

		api(): API {
			return api;
		},

		async get<R = unknown, PE = never>(path: string, token = true, init?: ReqInit) {
			return await request<R, PE>(path, 'GET', undefined, token, init);
		},

		async post<R = unknown, PE = never>(path: string, body: BodyInit, token = true, init?: ReqInit) {
			return await request<R, PE>(path, 'POST', body, token, init);
		},

		async put<R = unknown, PE = never>(path: string, body: BodyInit, token = true, init?: ReqInit) {
			return await request<R, PE>(path, 'PUT', body, token, init);
		},

		async patch<R = unknown, PE = never>(path: string, body: BodyInit, token = true, init?: ReqInit) {
			return await request<R, PE>(path, 'PATCH', body, token, init);
		},

		async delete<R = unknown, PE = never>(path: string, token = true, init?: ReqInit) {
			return await request<R, PE>(path, 'DELETE', undefined, token, init);
		},

		async upload<R = unknown, PE = never>(
			path: string,
			obj: FormData,
			m: 'POST' | 'PATCH' | 'PUT' = 'POST',
			token = true,
			init?: ReqInit,
		) {
			return await api.upload<R, PE>(path, obj, m, token, mergeInit(init));
		},
	};
}
