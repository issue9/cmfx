// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { newCache } from './cache';
import type { Mimetype, Serializer } from './serializer';
import { serializers } from './serializer';
import { delToken, getToken, SSEToken, state, Token, writeToken } from './token';
import { Method, Problem, Return } from './types';

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
	 * @param path - 相对于 {@link baseURL} 的请求地址；
	 * @param withToken - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 init.headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	delete<R = never, PE = never>(path: string, withToken?: boolean, init?: ReqInit): Promise<Return<R, PE>>;

	/**
	 * POST 请求
	 *
	 * @param path - 相对于 {@link baseURL} 的请求地址；
	 * @param body - 请求对象，会由 #contentSerializer 进行转换，可以为空；
	 * @param withToken - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 init.headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	post<R = never, PE = never>(
		path: string,
		body?: unknown,
		withToken?: boolean,
		init?: ReqInit,
	): Promise<Return<R, PE>>;

	/**
	 * PUT 请求
	 *
	 * @param path - 相对于 {@link baseURL} 的请求地址；
	 * @param body - 请求对象，会由 #contentSerializer 进行转换，可以为空；
	 * @param withToken - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	put<R = never, PE = never>(path: string, body?: unknown, withToken?: boolean, init?: ReqInit): Promise<Return<R, PE>>;

	/**
	 * PATCH 请求
	 *
	 * @param path - 相对于 {@link baseURL} 的请求地址；
	 * @param body - 请求对象，会由 #contentSerializer 进行转换，可以为空；
	 * @param withToken - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	patch<R = never, PE = never>(
		path: string,
		body?: unknown,
		withToken?: boolean,
		init?: ReqInit,
	): Promise<Return<R, PE>>;

	/**
	 * GET 请求
	 *
	 * @param path - 相对于 {@link baseURL} 的请求地址；
	 * @param withToken - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 */
	get<R = never, PE = never>(path: string, withToken?: boolean, init?: ReqInit): Promise<Return<R, PE>>;

	/**
	 * 执行普通的 API 请求
	 *
	 * @param path - 相对于 {@link baseURL} 的请求地址；
	 * @param method - 请求方法；
	 * @param obj - 请求对象，会由 #contentSerializer 进行转换，如果是 GET，可以为空；
	 * @param withToken - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 headers 参数的相关设置覆盖；
	 * @param init - 请求的额外参数；
	 * @typeParam R - 表示在接口操作成功的情况下返回的类型，如果不需要该数据可设置为 never；
	 * @typeParam PE - 表示在接口操作失败之后，{@link Problem#extension} 字段的类型，如果该字段为空值，可设置为 never；
	 */
	request<R = never, PE = never>(
		path: string,
		method: Method,
		obj?: unknown,
		withToken?: boolean,
		init?: ReqInit,
	): Promise<Return<R, PE>>;

	/**
	 * 执行上传操作
	 *
	 * @param path - 相对于 {@link baseURL} 的上传地址；
	 * @param obj - 上传的对象；
	 * @param withToken - 是否需要带上令牌，如果为 true，那么在登录过期时会尝试刷新令牌。该值可能会被 headers 参数的相关设置覆盖；
	 * @param method - 请求方法，默认为 POST；
	 * @param init - 请求的额外参数；
	 */
	upload<R = never, PE = never>(
		path: string,
		obj: FormData,
		method?: 'POST' | 'PATCH' | 'PUT',
		withToken?: boolean,
		init?: ReqInit,
	): Promise<Return<R, PE>>;
}

/**
 * 封装了访问后端接口的基本功能
 */
export class API implements REST {
	// NOTE: API 可能存在多个不同配置的实例，在添加静态属性时要注意。

	/**
	 * 构建一个 API 的对象
	 *
	 * @param id - 保存令牌时的名称，在多实例中，通完此值判定不同的令牌；
	 * @param s - 保存令牌的对象；
	 * @param baseURL - API 的基地址，不能以 / 结尾；
	 * @param contentType - 请求内容的类型；
	 * @param accept - mimetype 返回内容的类型；
	 * @param tokenPath - 相对于 baseURL 的登录地址，该地址应该包含 DELETE 和 PUT 两个请求，分别代表退出和刷新令牌；
	 * @param locale - 请求报头 accept-language 的内容；
	 * @param presetInit - 默认的 {@link RequestInit} 对象，所有请求都会传递该对象内容，除非被请求的参数覆盖；
	 */
	static async build(
		id: string,
		s: Storage,
		baseURL: string,
		tokenPath: string,
		contentType: Mimetype,
		accept: Mimetype,
		locale: string,
		presetInit?: ReqInit,
	): Promise<API> {
		// NOTE: 构造函数不能为 async，所以由一个静态方法代替构造函数。
		return new API(id, s, baseURL, tokenPath, contentType, accept, locale, await newCache(id), presetInit);
	}

	readonly #init?: ReqInit;

	readonly #id: string;
	readonly #storage: Storage;
	readonly #tokenPath: string;
	#token: Token | undefined;

	readonly #baseURL: string;
	#locale: string;

	// 键名为对应的 SSE 地址，键值为对应的 EventSource 实例，以及是否需要登录才能使用的标记。
	readonly #events: Map<string, [EventSource, boolean]>;

	readonly #cache: Cache;
	readonly #cachePaths: Map<string, Array<string>>; // 键名为地址，键值为依赖地址。

	readonly #contentType: Mimetype;
	readonly #contentSerializer: Serializer;
	readonly #acceptType: Mimetype;
	readonly #acceptSerializer: Serializer;

	private constructor(
		id: string,
		s: Storage,
		baseURL: string,
		tokenPath: string,
		contentType: Mimetype,
		accept: Mimetype,
		locale: string,
		cache: Cache, // TODO 是否可合并到 init?
		init?: ReqInit,
	) {
		if (!baseURL.includes('://')) {
			throw new Error('参数 baseURL 必须是一个有效果的 URL');
		}

		this.#init = init;

		this.#tokenPath = tokenPath;
		this.#id = id;
		this.#storage = s;
		this.#token = getToken(id, s);

		this.#baseURL = baseURL;
		this.#locale = locale;
		this.#events = new Map();

		this.#cache = cache;
		this.#cachePaths = new Map<string, Array<string>>();

		this.#contentType = contentType;
		this.#contentSerializer = serializers.get(contentType)!;
		this.#acceptType = accept;
		this.#acceptSerializer = serializers.get(accept)!;
	}

	/**
	 * 声明一个包含指定报头的 {@link REST} 实例
	 *
	 * @param init - 请求的额外参数；
	 */
	rest(init?: ReqInit): REST {
		const self = this;

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

		const request = async <R = never, PE = never>(
			path: string,
			method: Method,
			obj?: unknown,
			withToken = true,
			init?: ReqInit,
		): Promise<Return<R, PE>> => {
			return await self.request<R, PE>(path, method, obj, withToken, mergeInit(init));
		};

		return {
			request,

			api(): API {
				return self;
			},

			async get<R = never, PE = never>(path: string, withToken = true, init?: ReqInit): Promise<Return<R, PE>> {
				return await request<R, PE>(path, 'GET', undefined, withToken, init);
			},

			async post<R = never, PE = never>(
				path: string,
				body: BodyInit,
				withToken = true,
				init?: ReqInit,
			): Promise<Return<R, PE>> {
				return await request<R, PE>(path, 'POST', body, withToken, init);
			},

			async put<R = never, PE = never>(
				path: string,
				body: BodyInit,
				withToken = true,
				init?: ReqInit,
			): Promise<Return<R, PE>> {
				return await request<R, PE>(path, 'PUT', body, withToken, init);
			},

			async patch<R = never, PE = never>(
				path: string,
				body: BodyInit,
				withToken = true,
				init?: ReqInit,
			): Promise<Return<R, PE>> {
				return await request<R, PE>(path, 'PATCH', body, withToken, init);
			},

			async delete<R = never, PE = never>(path: string, withToken = true, init?: ReqInit): Promise<Return<R, PE>> {
				return await request<R, PE>(path, 'DELETE', undefined, withToken, init);
			},

			async upload<R = never, PE = never>(
				path: string,
				obj: FormData,
				m: 'POST' | 'PATCH' | 'PUT' = 'POST',
				withToken = true,
				init?: ReqInit,
			): Promise<Return<R, PE>> {
				return await self.upload<R, PE>(path, obj, m, withToken, mergeInit(init));
			},
		};
	}

	/**
	 * 当前对象访问 API 是的基地址
	 */
	get baseURL(): string {
		return this.#baseURL;
	}

	/**
	 * 切换语言
	 */
	setLocale(v: string): void {
		this.#locale = v;
	}

	/**
	 * 缓存 path 指向的 GET 接口数据
	 *
	 * @remarks
	 * 以下操作会删除缓存内容：
	 *  - 访问了该接口的非 GET 请求；
	 *  - 调用 {@link uncache} 方法；
	 *  - 调用 {@link clearCache} 方法；
	 *  - 调用参数 deps 中的非 GET 请求；
	 *  - token 发生变化；
	 *
	 * @param path - 相对于 {@link baseURL} 的接口地址；
	 * @param deps - 缓存的依赖接口，这些依赖项的非 GET 接口一旦被调用，将更新当前的缓存项。
	 *  支持在尾部以 * 作为通配符，用以匹配任意字符。
	 *
	 * NOTE: 查询的数据应该是不带分页的，否则可能会造成数据混乱。
	 * NOTE: 相同的 path 多次调用，后续的调用将被忽略。
	 */
	cache(path: string, ...deps: Array<string>): void {
		path = this.buildURL(path);
		if (!this.#cachePaths.has(path)) {
			const dep = deps.map(v => this.buildURL(v));
			dep.push(path);
			this.#cachePaths.set(path, dep);
		}
	}

	/**
	 * 清除指定的缓存项
	 *
	 * @param path - 相对于 {@link baseURL} 的接口地址；
	 */
	async uncache(path: string): Promise<void> {
		path = this.buildURL(path);
		this.#cachePaths.delete(path);
		await this.#cache.delete(this.buildURL(path));
	}

	/**
	 * 清除所有的缓存项
	 */
	async clearCache(): Promise<void> {
		for (const val of this.#cachePaths.keys()) {
			await this.uncache(val);
		}
		this.#cachePaths.clear();
	}

	/**
	 * 将 path 包装为一个完整的 API 访问地址
	 *
	 * @param path - 相对于 {@link baseURL} 的地址；
	 */
	buildURL(path: string): string {
		if (path.length === 0) {
			throw new Error('参数 path 不能为空');
		}

		if (path.charAt(0) !== '/') {
			return `${this.baseURL}/${path}`;
		}
		return this.baseURL + path;
	}

	api(): API {
		return this;
	}

	async delete<R = never, PE = never>(path: string, withToken = true, init?: ReqInit): Promise<Return<R, PE>> {
		return this.request<R, PE>(path, 'DELETE', undefined, withToken, init);
	}

	async post<R = never, PE = never>(
		path: string,
		body?: unknown,
		withToken = true,
		init?: ReqInit,
	): Promise<Return<R, PE>> {
		return this.request<R, PE>(path, 'POST', body, withToken, init);
	}

	async put<R = never, PE = never>(
		path: string,
		body?: unknown,
		withToken = true,
		init?: ReqInit,
	): Promise<Return<R, PE>> {
		return this.request<R, PE>(path, 'PUT', body, withToken, init);
	}

	async patch<R = never, PE = never>(
		path: string,
		body?: unknown,
		withToken = true,
		init?: ReqInit,
	): Promise<Return<R, PE>> {
		return this.request<R, PE>(path, 'PATCH', body, withToken, init);
	}

	async get<R = never, PE = never>(path: string, withToken = true, init?: ReqInit): Promise<Return<R, PE>> {
		return this.request<R, PE>(path, 'GET', undefined, withToken, init);
	}

	async request<R = never, PE = never>(
		path: string,
		method: Method,
		obj?: unknown,
		withToken = true,
		init?: ReqInit,
	): Promise<Return<R, PE>> {
		const body = obj === undefined ? undefined : (this.#contentSerializer.stringify(obj) as BufferSource);

		const headers = new Headers(init?.headers);
		if (withToken && !headers.has('Authorization')) {
			headers.set('Authorization', `Bearer ${await this.getToken()}`);
		}
		if (body && !headers.has('Content-Type')) {
			headers.set('Content-Type', `${this.#contentType}; charset=UTF-8`);
		}

		if (init) {
			init.headers = headers;
		} else {
			init = { headers };
		}

		return this.#fetchWithArgument<R, PE>(path, method, body, init);
	}

	async upload<R = never, PE = never>(
		path: string,
		obj: FormData,
		method: 'POST' | 'PATCH' | 'PUT' = 'POST',
		withToken = true,
		init?: ReqInit,
	): Promise<Return<R, PE>> {
		if (withToken) {
			let headers: Headers;

			if (!init?.headers) {
				headers = new Headers({
					Authorization: `Bearer ${await this.getToken()}`,
				});
			} else {
				headers = new Headers(init.headers);
				if (!headers.has('Authorization')) {
					headers.set('Authorization', `Bearer ${await this.getToken()}`);
				}
			}

			if (init) {
				init.headers = headers;
			} else {
				init = { headers };
			}
		}

		return this.#fetchWithArgument<R, PE>(path, method, obj, init);
	}

	/**
	 * 设置登录状态
	 *
	 * @param ret - 表示执行登录操作之后返回的对象；
	 * @returns 如果返回 true，表示操作成功，否则表示错误信息；
	 */
	async login(ret: Return<Token>): Promise<Problem | undefined | true> {
		if (!ret.ok) {
			return ret.body;
		}

		this.#token = writeToken(ret.body!, this.#id, this.#storage);
		await this.clearCache();

		return true;
	}

	/**
	 * 退出当前的登录状态并断开需要登录的 SSE 连接
	 */
	async logout() {
		await this.delete(this.#tokenPath);
		this.#token = undefined;
		delToken(this.#id, this.#storage);
		await this.clearCache();

		// 关闭需要登录的 EventSource

		const keys: Array<string> = [];
		for (const [key, item] of this.#events) {
			if (item[1]) {
				item[0].close();
				keys.push(key);
			}
		}

		for (const key of keys) {
			// 从 events 删除这些 EventSource 对象
			this.#events.delete(key);
		}
	}

	/**
	 * 当前是否是有效的登录状态
	 *
	 * @remarks
	 * 此方法与 {@link API#getToken} 的不同在于当前方法不会主动刷新 token。
	 * 所以是无法判断诸如服务端重启等非当前实例主动发起退出导致的状态。
	 */
	isLogin(): boolean {
		return !!this.#token && state(this.#token) !== 'refreshExpired';
	}

	/**
	 * 获得令牌，如果令牌已经过期，会尝试刷新令牌，令牌不存在，则返回 undefined。
	 */
	async getToken(): Promise<string | undefined> {
		if (!this.#token) {
			return undefined;
		}

		switch (state(this.#token)) {
			case 'normal': // 正常状态
				return this.#token.access_token;
			case 'refreshExpired': // 刷新令牌也过期了
				return undefined;
			case 'accessExpired': {
				// 尝试刷新令牌
				const ret = await this.#fetchWithArgument<Token>(this.#tokenPath, 'PUT', undefined, {
					headers: new Headers({
						Authorization: `Bearer ${this.#token.refresh_token}`,
					}),
				});
				if (!ret.ok) {
					return undefined;
				}

				this.#token = writeToken(ret.body!, this.#id, this.#storage);
				return this.#token.access_token;
			}
		}
	}

	/**
	 * 对 {@link API#'#fetch'} 的二次包装，可以指定一些关键参数。
	 *
	 * @param path - 请求路径，相对于 baseURL 的路径；
	 * @param method - 请求方法；
	 * @param body - 请求体；
	 * @param init - 其它的 RequestInit 参数；
	 */
	async #fetchWithArgument<R = never, PE = never>(
		path: string,
		method: Method,
		body?: unknown,
		init?: ReqInit,
	): Promise<Return<R, PE>> {
		let h: Headers;
		if (!init?.headers) {
			h = new Headers({
				Accept: `${this.#acceptType}; charset=UTF-8`,
				'Accept-Language': this.#locale,
			});
		} else {
			h = new Headers(init.headers);
			if (!h.has('Accept')) {
				h.set('Accept', `${this.#acceptType}; charset=UTF-8`);
			}
			if (!h.has('Accept-Language')) {
				h.set('Accept-Language', this.#locale);
			}

			delete init.headers;
		}

		const headers = this.#init?.headers ? Object.assign(this.#init.headers, h) : h;

		init = Object.assign(this.#init ? structuredClone(this.#init) : {}, init, {
			headers,
			method: method,
			body: body,
		});

		return await this.#fetch(new Request(this.buildURL(path), init));
	}

	/**
	 * 相当于标准库的 {@link fetch} 方法，但是对返回参数作了处理，参数也兼容标准库的 fetch 方法。
	 *
	 * @param req - 相关的参数；
	 * @typeParam R - 表示在接口操作成功的情况下返回的类型，如果不需要该数据可设置为 never；
	 * @typeParam PE - 表示在接口操作失败之后，{@link Problem#extension} 字段的类型，如果该字段为空值，可设置为 never。
	 */
	async #fetch<R = never, PE = never>(req: Request): Promise<Return<R, PE>> {
		const isGET = req.method === 'GET';
		const fullPath = req.url;

		let resp: Response | undefined;
		if (isGET && this.#cachePaths.has(fullPath)) {
			resp = await this.#cache.match(req);
		}
		const isMatched = !!resp; // 是否是从缓存中匹配到的数据
		if (!resp) {
			resp = await fetch(req);
		}

		// 200-299

		if (resp.ok) {
			if (isGET) {
				if (!isMatched && this.#cachePaths.has(fullPath)) {
					await this.#cache.put(req, resp.clone());
				}
			} else if (req.method !== 'OPTIONS' && req.method !== 'HEAD') {
				// 非 GET 请求，则清除缓存。
				const key = this.#needUncache(fullPath);
				if (key) {
					await this.#cache.delete(key);
				}
			}

			return { headers: resp.headers, status: resp.status, ok: true, body: await this.parse<R>(resp) };
		}

		// 400-599

		if (resp.status === 401) {
			this.#token = undefined;
			delToken(this.#id, this.#storage);
		}
		const body = await this.parse<Problem<PE>>(resp);
		if (body) {
			body!.headers = resp.headers;
		}
		return { headers: resp.headers, status: resp.status, ok: false, body: body };
	}

	#needUncache(path: string): string | undefined {
		for (const [key, deps] of this.#cachePaths) {
			for (const dep of deps) {
				if (dep === path) {
					return key;
				}

				if (dep.charAt(dep.length - 1) === '*' && path.startsWith(dep.substring(0, dep.length - 1))) {
					return key;
				}
			}
		}
	}

	async parse<R>(resp: Response): Promise<R | undefined> {
		const bs = await resp.bytes();
		if (bs.length > 0) {
			return this.#acceptSerializer.parse<R>(bs);
		}
	}

	/**
	 * 获取用于订阅 SSE 的对象
	 *
	 * @param path - SSE 服务的地址；
	 * @param needLogin - 是否需要登录状态才能访问。
	 * 如果该值为 true，那么需要 path 参数提供的地址应该包含一 POST 请求，用于获取一个临时的访问令牌；
	 */
	async eventSource(
		path: string,
		needLogin?: boolean,
	): Promise<Pick<EventSource, 'addEventListener' | 'removeEventListener'> | undefined> {
		// NOTE: 刷新页面可能导致 EventSource 无效

		if (this.#events.has(path)) {
			const item = this.#events.get(path)!;
			if (item[1] !== needLogin) {
				throw new Error('参数 needLogin 与现有的实例不一致');
			}
			return item[0];
		}

		const es = await this.#initEventSource(path, needLogin);
		if (es) {
			this.#events.set(path, [es, !!needLogin]);
		}
		return es;
	}

	/**
	 * 关闭当前实例建立起来的所有 SSE 服务
	 */
	async closeEventSource(): Promise<void> {
		for (const [_, item] of this.#events) {
			item[0].close();
		}
		this.#events.clear();
	}

	// 初始化 EventSource
	async #initEventSource(path: string, needLogin?: boolean): Promise<EventSource | undefined> {
		if (needLogin) {
			const r = await this.post<SSEToken>(path);
			if (!r.ok) {
				console.error(r.body);
				throw new Error(r.body!.title);
			}

			path = `${path}?token=${r.body!.token}`;
		}

		// watch 返回 Promise 和 Connect 两个对象，
		// Promise 监视 Connect.val 的变化，直到其变为 true，Promise 才会 resolve。
		interface Connect {
			val: boolean;
		}
		const watch = (): [Promise<unknown>, Connect] => {
			const connect: Connect = { val: false };
			let proxy: Connect;
			const p = new Promise(resolve => {
				proxy = new Proxy(connect, {
					set(target: Connect, p: string, val: boolean) {
						if (val) {
							resolve(val);
						}
						return Reflect.set(target, p, val);
					},
				}); // end new Proxy
			});
			return [p, proxy!];
		};

		const [p, proxy] = watch();
		const es = new EventSource(this.buildURL(path));
		es.addEventListener('open', () => {
			proxy.val = true;
		});
		await p;
		return es;
	}
}
