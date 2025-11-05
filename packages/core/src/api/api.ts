// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { newCache } from './cache';
import type { Mimetype, Serializer } from './serializer';
import { serializers } from './serializer';
import { delToken, getToken, SSEToken, state, Token, writeToken } from './token';
import { Method, Problem, Query, Return } from './types';

/**
 * 封装了 API 访问的基本功能
 */
export class API {
    /**
     * 当前客户端发生的一些非预料错误时的错误代码
     *
     * @remarks 表示客户端本身的错误，比如浏览器因版本问题导致其 fetch 的异常等。
     *  采用了 418 这个正常情况下很少被用的 HTTP 代码表示。
     */
    static readonly ErrorCode = 418;

    // NOTE: API 可能存在多个不同配置的实例，在添加静态属性时要注意。

    /**
     * 构建一个用于访问 API 的对象
     *
     * @param id - 保存令牌时的名称，在多实例中，通完此值判定不同的令牌；
     * @param s - 保存令牌的对象；
     * @param baseURL - API 的基地址，不能以 / 结尾；
     * @param contentType - 请求内容的类型；
     * @param accept - mimetype 返回内容的类型；
     * @param tokenPath - 相对于 baseURL 的登录地址，该地址应该包含 DELETE 和 PUT 两个请求，分别代表退出和刷新令牌；
     * @param locale - 请求报头 accept-language 的内容；
     */
    static async build(
        id: string, s: Storage, baseURL: string, tokenPath: string,
        contentType: Mimetype, accept: Mimetype, locale: string
    ): Promise<API> {
        // NOTE: 构造函数不能为 async，所以由一个静态方法代替构造函数。
        return new API(id, s, baseURL, tokenPath, contentType, accept, locale, await newCache(id));
    }

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
        id: string, s: Storage, baseURL: string, tokenPath: string,
        contentType: Mimetype, accept: Mimetype, locale: string, cache: Cache
    ) {
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
     * 当前对象访问 API 是的基地址
     */
    get baseURL(): string { return this.#baseURL; }

    /**
     * 切换语言并清空缓存
     */
    setLocale(v: string) {
        if (this.#locale === v) { return; }

        this.#locale = v;
        this.clearCache().then(() => { });
    }

    /**
     * 缓存 path 指向的 GET 接口数据
     *
     * 以下操作会删除缓存内容：
     *  - 切换语言；
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
    cache(path: string, ...deps: Array<string>) {
        if (!this.#cachePaths.has(path)) {
            deps.push(path);
            this.#cachePaths.set(path, deps);
        }
    }

    /**
     * 清除指定的缓存项
     *
     * @param path - 相对于 {@link baseURL} 的接口地址；
     */
    async uncache(path: string): Promise<void> {
        this.#cachePaths.delete(path);
        await this.#cache.delete(this.buildURL(path));
    }

    /**
     * 清除所有的缓存项
     */
    async clearCache(): Promise<void> {
        for (let val of this.#cachePaths.keys()) {
            await this.uncache(val);
        }
        this.#cachePaths.clear();
    }

    /**
     * 将 path 包装为一个 API 的 URL
     *
     * @param path - 相对于 {@link baseURL} 的地址
     */
    buildURL(path: string): string {
        if (path.length === 0) {
            throw '参数 path 不能为空';
        }

        if (path.charAt(0) !== '/') {
            return this.baseURL + '/' + path;
        }
        return this.baseURL + path;
    }

    /**
     * DELETE 请求
     */
    async delete<R = never, PE = never>(path: string, withToken = true): Promise<Return<R, PE>> {
        return this.request<R, PE>(path, 'DELETE', undefined, withToken);
    }

    /**
     * POST 请求
     */
    async post<R = never, PE = never>(path: string, body?: unknown, withToken = true): Promise<Return<R, PE>> {
        return this.request<R, PE>(path, 'POST', body, withToken);
    }

    /**
     * PUT 请求
     */
    async put<R = never, PE = never>(path: string, body?: unknown, withToken = true): Promise<Return<R, PE>> {
        return this.request<R, PE>(path, 'PUT', body, withToken);
    }

    /**
     * PATCH 请求
     */
    async patch<R = never, PE = never>(path: string, body?: unknown, withToken = true): Promise<Return<R, PE>> {
        return this.request<R, PE>(path, 'PATCH', body, withToken);
    }

    /**
     * GET 请求
     */
    async get<R = never, PE = never>(path: string, withToken = true): Promise<Return<R, PE>> {
        return this.request<R, PE>(path, 'GET', undefined, withToken);
    }

    /**
     * 执行普通的 API 请求
     *
     * @param path - 请求地址，相对于 {@link baseURL}；
     * @param method - 请求方法；
     * @param obj - 请求对象，会由 #contentSerializer 进行转换，如果是 GET，可以为空；
     * @param withToken - 是否带上令牌，如果此值为 true，那么在登录过期时会尝试刷新令牌；
     * @typeParam R - 表示在接口操作成功的情况下返回的类型，如果不需要该数据可设置为 never；
     * @typeParam PE - 表示在接口操作失败之后，{@link Problem#extension} 字段的类型，如果该字段为空值，可设置为 never；
     */
    async request<R = never, PE = never>(
        path: string, method: Method, obj?: unknown, withToken = true
    ): Promise<Return<R, PE>> {
        const token = withToken ? await this.getToken() : undefined;
        const body = obj === undefined ? undefined : this.#contentSerializer.stringify(obj);
        return this.#withArgument<R, PE>(path, method, token, !!body, body as BodyInit);
    }

    /**
     * 执行上传操作
     *
     * @param path - 上传地址，相对于 {@link baseURL}；
     * @param obj - 上传的对象；
     * @param withToken - 是否需要带上令牌，如果为 true，那么在登录过期时会尝试刷新令牌；
     * @param method - 请求方法；
     */
    async upload<R = never, PE = never>(
        path: string, obj: FormData, method: 'POST' | 'PATCH' | 'PUT' = 'POST', withToken = true
    ): Promise<Return<R, PE>> {
        const token = withToken ? await this.getToken() : undefined;
        return this.#withArgument<R, PE>(path, method, token, false, obj);
    }

    /**
     * 设置登录状态
     *
     * @param ret - 表示执行登录操作之后返回的对象；
     * @returns 如果返回 true，表示操作成功，否则表示错误信息；
     */
    async login(ret: Return<Token, never>): Promise<Problem<never> | undefined | true> {
        if (!ret.ok) {
            return ret.body;
        }

        this.#token = writeToken(ret.body!, this.#id, this.#storage);
        await this.clearCache();

        return true;
    }

    /**
     * 退出当前的登录状态
     *
     * 同时会断开需要登录的 SSE 连接。
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

        for (const key of keys) { // 从 events 删除这些 EventSource 对象
            this.#events.delete(key);
        }
    }

    /**
     * 当前是否是有效的登录状态
     *
     * @remarks 此方法与 {@link API#getToken} 的不同在于当前方法不会主动刷新 token。
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
        case 'accessExpired': // 尝试刷新令牌
        { //大括号的作用是防止 case 内部的变量 ret 提升作用域！
            const ret = await this.#withArgument<Token>(this.#tokenPath, 'PUT', this.#token.refresh_token, true);
            if (!ret.ok) {
                return undefined;
            }

            this.#token = writeToken(ret.body!, this.#id, this.#storage);
            return this.#token.access_token;
        }
        }
    }

    /**
     * 对 {@link API#fetch} 的二次包装，可以指定一些关键参数。
     *
     * @param path - 请求路径，相对于 baseURL 的路径；
     * @param method - 请求方法；
     * @param token - 携带的令牌，如果为空，表示不需要令牌；
     * @param ct - 是否需要指定 content-type 报头；
     * @param body - 提交的内容，如果没有可以为空；
     */
    async #withArgument<R = never, PE = never>(
        path: string, method: Method, token?: string, ct?: boolean, body?: BodyInit
    ): Promise<Return<R, PE>> {
        const h = new Headers({
            'Accept': this.#acceptType + '; charset=UTF-8',
            'Accept-Language': this.#locale,
        });
        if (token) {
            h.set('Authorization', 'Bearer ' + token);
        }
        if (ct) {
            h.set('Content-Type', this.#contentType + '; charset=UTF-8');
        }

        return await this.#fetch(path, {
            method: method,
            body: body,
            mode: 'cors',
            headers: h,
        });
    }

    /**
     * 相当于标准库的 {@link window.fetch} 方法，但是对返回参数作了处理，参数也兼容标准库的 fetch 方法。
     *
     * @param path - 地址，相对于 {@link baseURL}；
     * @param req - 相关的参数；
     * @typeParam R - 表示在接口操作成功的情况下返回的类型，如果不需要该数据可设置为 never；
     * @typeParam PE - 表示在接口操作失败之后，{@link Problem#extension} 字段的类型，如果该字段为空值，可设置为 never。
     */
    async #fetch<R = never, PE = never>(path: string, req?: RequestInit): Promise<Return<R, PE>> {
        // NOTE: req 的不同，可能需要返回不同的结果，对于缓存的接口，
        // 没办法根据 req 的不同而选择缓存不同的数据。干脆直接不让此方法公开。

        const isGET = req && req.method === 'GET';
        const fullPath = this.buildURL(path);

        try {
            let resp: Response | undefined;
            if (isGET && this.#cachePaths.has(path)) {
                resp = await this.#cache.match(fullPath);
            }
            const isMatched = !!resp; // 是否是从缓存中匹配到的数据
            if (!resp) {
                resp = await fetch(fullPath, req);
            }

            // 200-299

            if (resp.ok) {
                if (isGET) {
                    if (!isMatched && this.#cachePaths.has(path)) {
                        await this.#cache.put(fullPath, resp.clone());
                    }
                } else if (!req || (req.method !== 'OPTIONS' && req.method !== 'HEAD')) { // 非 GET 请求，则清除缓存。
                    const key = this.#needUncache(path);
                    if (key) {
                        await this.#cache.delete(this.buildURL(key));
                    }
                }

                return { headers: resp.headers, status: resp.status, ok: true, body: await this.parse<R>(resp) };
            }

            // 400-599

            if (resp.status === 401) {
                this.#token = undefined;
                delToken(this.#id, this.#storage);
            }
            return { headers: resp.headers, status: resp.status, ok: false, body: await this.parse<Problem<PE>>(resp) };
        } catch (e) { // 此处捕获的是客户端代码本身的错误
            const td = e instanceof Error // TODO: 采用 Error.isError https://caniuse.com/?search=isError
                ? { title: e.name, detail: e.message }
                : { title: String(e), detail: String(e) };
            return {
                status: API.ErrorCode,
                ok: false,
                body: {
                    type: API.ErrorCode.toString(),
                    status: API.ErrorCode,
                    ...td
                }
            };
        }
    }

    #needUncache(path: string): string | undefined {
        for (const [key, deps] of this.#cachePaths) {
            for (const dep of deps) {
                if (dep === path) { return key; }

                if (dep.charAt(dep.length - 1) === '*' && path.startsWith(dep.substring(0, dep.length - 1))) {
                    return key;
                }
            }
        }
    }

    async parse<R>(resp: Response): Promise<R | undefined> {
        const bs = await resp.bytes();
        if (bs.length === 0) {
            return;
        }
        return this.#acceptSerializer.parse(bs) as R;
    }

    /**
     * 获取用于订阅 SSE 的对象
     *
     * @param path - SSE 服务的地址；
     * @param needLogin - 是否需要登录状态才能访问。
     * 如果该值为 true，那么需要 path 参数提供的地址应该包含一 POST 请求，用于获取一个临时的访问令牌；
     */
    async eventSource(
        path: string, needLogin?: boolean
    ): Promise<Pick<EventSource, 'addEventListener' | 'removeEventListener'> | undefined> {
        // NOTE: 刷新页面可能导致 EventSource 无效

        if (this.#events.has(path)) {
            const item = this.#events.get(path)!;
            if (item[1] !== needLogin) {
                throw '参数 needLogin 与现有的实例不一致';
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
                return;
            }

            path = path + '?token=' + r.body!.token;
        }

        // watch 返回 Promise 和 Connect 两个对象，
        // Promise 监视 Connect.val 的变化，直到其变为 true，Promise 才会 resolve。
        interface Connect { val: boolean; }
        const watch = (): [Promise<unknown>, Connect] => {
            const connect: Connect = { val: false };
            let proxy: Connect;
            const p = new Promise((resolve) => {
                proxy = new Proxy(connect, {
                    set(target: Connect, p: string, val: boolean) {
                        if (val) { resolve(val); }
                        return Reflect.set(target, p, val);
                    }
                }); // end new Proxy
            });
            return [p, proxy!];
        };

        const [p, proxy] = watch();
        const es = new EventSource(this.buildURL(path));
        es.addEventListener('open', () => { proxy.val = true; });
        await p;
        return es;
    }
}

/**
 * 将 Q 转换为查询参数
 *
 * 如果存在 q.page 属性，会自动将 page 的值减去 1，因为后端的 api 是从 0 页开始的。
 */
export function query2Search<Q extends Query>(q: Q): string {
    if (q.page) {
        q = { ...q };
        q.page! -= 1;
    }

    const s = new URLSearchParams();
    Object.entries(q).forEach((v) => {
        if (Array.isArray(v[1])) {
            s.append(v[0], v[1].join(','));
        } else {
            if (typeof v[1] === 'string') {
                s.append(v[0], v[1]);
            } else if (v[1] !== undefined) {
                s.append(v[0], v[1]!.toString());
            }
        }
    });

    const qs = s.toString();
    if (qs) {
        return '?' + qs;
    }
    return '';
}
