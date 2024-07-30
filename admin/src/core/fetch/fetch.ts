// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { delToken, getToken, state, Token, TokenState, writeToken } from './token';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const serializers = new Map<string, Serializer>([
    ['application/json', JSON],
]);

/**
 * 以 JSON 为参照定义了序列化和反序列化的接口
 */
interface Serializer {
    parse(_: string): unknown;
    stringify(_: unknown): string;
}

/**
 * 对 fetch 的二次封装，提供了令牌续订功能。
 */
export class Fetcher {
    readonly #baseURL: string;
    readonly #loginPath: string;
    #locale: string;
    #token: Token | null;

    readonly #contentType: string;
    readonly #serializer: Serializer;

    /**
     * 返回一个对 fetch 进行二次包装的对象
     *
     * @param baseURL API 的基地址，不能以 / 结尾。
     * @param contentType mimetype 的类型。
     * @param loginPath 相对于 baseURL 的登录地址，该地址应该包含 POST、DELETE 和 PUT 三个请求，分别代表登录、退出和刷新令牌。
     * @param locale 报头 accept-language 的内容。
     */
    static async build(baseURL: string, loginPath: string, contentType: string, locale: string): Promise<Fetcher> {
        const t = await getToken();
        return new Fetcher(baseURL, loginPath, contentType, locale, t);
    }

    private constructor(baseURL: string, loginPath: string, contentType: string, locale: string, token: Token | null) {
        const s = serializers.get(contentType);
        if (!s) {
            throw `不支持的 contentType ${contentType}`;
        }

        this.#baseURL = baseURL;
        this.#loginPath = loginPath;
        this.#locale = locale;
        this.#token = token;

        this.#contentType = contentType;
        this.#serializer = s;
    }

    set locale(v: string) { this.#locale = v; }

    /**
     * 将 path 包装为一个 API 的 URL
     *
     * @param path 相对于 baseURL 的地址
     */
    buildURL(path: string): string {
        if (path.length === 0) {
            throw '参数 path 不能为空';
        }

        if (path.charAt(0) !== '/') {
            return this.#baseURL + '/' + path;
        }
        return this.#baseURL + path;
    }

    /**
     * DELETE 请求
     */
    async delete<T=never,P=never>(path: string, withToken = true): Promise<Return<T,P>> {
        return this.request<T,P>(path, 'DELETE', undefined, withToken);
    }

    /**
     * POST 请求
     *
     * @param path 相对于 baseURL 的地址
     * @param body 上传的数据，若没有则为空
     * @param withToken 是否带上令牌，可参考 request
     */
    async post<T=never,P=never>(path: string, body?: unknown, withToken = true): Promise<Return<T,P>> {
        return this.request<T,P>(path, 'POST', body, withToken);
    }

    /**
     * PUT 请求
     */
    async put<T=never,P=never>(path: string, body?: unknown, withToken = true): Promise<Return<T,P>> {
        return this.request<T,P>(path, 'PUT', body, withToken);
    }

    /**
     * PATCH 请求
     */
    async patch<T=never,P=never>(path: string, body?: unknown, withToken = true): Promise<Return<T,P>> {
        return this.request<T,P>(path, 'PATCH', body, withToken);
    }

    /**
     * GET 请求
     */
    async get<T=never,P=never>(path: string, withToken = true): Promise<Return<T,P>> {
        return this.request<T,P>(path, 'GET', undefined, withToken);
    }

    /**
     * 执行普通的 API 请求
     *
     * @param path 请求地址，相对于 baseURL
     * @param method 请求方法
     * @param obj 请求对象，如果是 GET，可以为空。
     * @param withToken 是否带上令牌，如果此值为 true，那么在 token 过期的情况下会自动尝试刷新令牌。
     */
    async request<T=never,P=never>(path: string, method: Method, obj?: unknown, withToken = true): Promise<Return<T,P>> {
        const token = withToken ? await this.getToken() : undefined;
        const body = obj ? this.#serializer.stringify(obj) : undefined;
        return this.withArgument<T,P>(path, method, token, this.#contentType, body);
    }

    /**
     * 执行上传操作
     *
     * @param path 上传地址，相对于 baseURL
     * @param obj 上传的对象
     * @param withToken 是否需要带上 token，如果为 true，那么在登录过期时会尝试刷新令牌。
     */
    async upload<T=never,P=never>(path: string, obj: FormData, withToken = true): Promise<Return<T,P>> {
        const token = withToken ? await this.getToken() : undefined;
        return this.withArgument<T,P>(path, 'POST', token, undefined, obj);
    }

    /**
     * 执行登录操作
     *
     * @returns 如果返回 true，表示操作成功，否则表示错误信息。
     */
    async login(account: Account): Promise<Problem<never>|undefined|true> {
        const token = await this.post<Token>(this.#loginPath, account, false);
        if (token.ok) {
            this.#token = await writeToken(token.body!);
            return true;
        }

        return token.body;
    }

    /**
     * 退出当前的登录状态
     */
    async logout() {
        await this.delete(this.#loginPath);
        this.#token = null;
        await delToken();
    }

    /**
     * 获得令牌，如果令牌已经过期，会尝试刷新令牌，令牌不存在，则返回 undefined。
     */
    async getToken(): Promise<string | undefined> {
        if (!this.#token) {
            return undefined;
        }

        switch (state(this.#token)) {
        case TokenState.Normal: // 正常状态
            return this.#token.access_token;
        case TokenState.RefreshExpired: // 刷新令牌也过期了
            return undefined;
        case TokenState.AccessExpired: // 尝试刷新令牌
        { //大括号的作用是防止 case 内部的变量 ret 提升作用域！
            const ret = await this.withArgument<Token>(this.#loginPath, 'PUT', this.#token.refresh_token, this.#contentType);
            if (!ret.ok) {
                return undefined;
            }

            this.#token = await writeToken(ret.body!);
            return this.#token.access_token;
        }
        }
    }

    /**
     * 对 fetch 的二次包装，可以指定一些关键参数。
     *
     * @param path 请求路径，相对于 baseURL 的路径；
     * @param method 请求方法；
     * @param token 携带的令牌，如果为空，表示不需要令牌；
     * @param ct content-type 的值，如果为空，表示不需要，比如上传等操作，不需要指定客户的 content-type 值；
     * @param body 提交的内容，如果不没有可以为空；
     */
    async withArgument<T=never,P=never>(path: string, method: Method, token?: string, ct?: string, body?: BodyInit): Promise<Return<T,P>> {
        const h = new Headers({
            'Accept': this.#contentType + '; charset=UTF-8',
            'Accept-Language': this.#locale,
        });
        if (token) {
            h.set('Authorization', token);
        }
        if (ct) {
            h.set('Content-Type', ct);
        }

        return await this.fetch(path, {
            method: method,
            body: body,
            mode: 'cors',
            headers: h,
        });
    }

    /**
     * 相当于标准库的 fetch 方法，但是对返回参数作了处理，参数也兼容标准库的 fetch 方法。
     *
     * @param path 地址，相对于 baseURL
     * @param req 相关的参数
     */
    async fetch<T=never,P=never>(path: string, req?: RequestInit): Promise<Return<T,P>> {
        try {
            const resp = await fetch(this.buildURL(path), req);

            // 200-299

            if (resp.ok) {
                return { status: resp.status, ok: true, body: await this.parse<T>(resp) };
            }

            // TODO 300-399

            // 400-599

            if (resp.status === 401) {
                this.#token = null;
                await delToken();
            }
            return { status: resp.status, ok: false, body: await this.parse<Problem<P>>(resp) };
        } catch(e) {
            if (e instanceof Error) {
                return { status: 500, ok: false, body: {type: '500', status: 500, title: 'fetch error', detail: e.message } };
            }
            return { status: 500, ok: false, body: {type: '500', status: 500, title: 'error', detail: (<any>e).toString() } };
        }
    }

    async parse<T>(resp: Response): Promise<T | undefined> {
        const txt = await resp.text();
        if (txt.length === 0) {
            return;
        }
        return this.#serializer.parse(txt) as T;
    }
}

/**
 * 接口错误返回的对象
 *
 * T 表示 extension 字段的类型，如果该字段空值，不需要指定。
 */
export interface Problem<T> {
    type: string
    title: string
    status: number
    detail?: string
    params?: Array<Param>
    instance?: string
    extension?: T
}

export interface Param {
    name: string
    reason: string
}

/**
 * 接口返回的对象
 *
 * T 表示在接口操作成功的情况下返回的类型，如果不需要该数据可设置为 never；
 * R 表示在接口操作失败之后，{@link Problem#extension} 字段的类型，如果该字段为空值，可设置为 never。
 */
export type Return<T, P> = {
    /**
     * 服务端返回的类型
     */
    body?: Problem<P>;

    /**
     * 状态码
     */
    status: number;

    /**
     * 是否出错了。
     */
    ok: false;
} | {
    /**
     * 服务端返回的类型
     */
    body?: T;

    /**
     * 状态码
     */
    status: number;

    /**
     * 是否出错了。
     */
    ok: true;
};

export interface Account {
    [key: string]: string; // 限制字段名的类型
    username: string;
    password: string;
}

/**
 * 分页接口返回的对象
 */
export interface Page<T> {
    [key: string]: unknown; // 限制字段名的类型
    count: number
    current: Array<T>
    more?: boolean
}
