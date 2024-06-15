// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Locales } from '@/core/locales/locales';

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
 * 返回一个对 fetch 进行二次包装的对象
 *
 * @param baseURL API 的基地址，不能以 / 结尾。
 * @param contentType mimetype 的类型。
 * @param loginPath 相对于 baseURL 的登录地址，该地址应该包含 POST、DELETE 和 PUT 三个请求，分别代表登录、退出和刷新令牌。
 * @param locales 管理本地化的对象，由该参数确定 accept-language 报头的内容。
 */
export async function build(baseURL: string, loginPath: string, contentType: string, locales: Locales): Promise<Fetcher> {
    const t = await getToken();
    return new Fetcher(baseURL, loginPath, contentType, locales, t);
}

class Fetcher {
    readonly #baseURL: string;
    readonly #loginPath: string;
    readonly #locales: Locales;
    #token: Token | null;

    readonly #contentType: string;
    readonly #serializer: Serializer;

    /**
     * 构造函数，参数参考 build
     */
    constructor(baseURL: string, loginPath: string, contentType: string, locales: Locales, token: Token | null) {
        const s = serializers.get(contentType);
        if (!s) {
            throw `不支持的 contentType ${contentType}`;
        }

        this.#baseURL = baseURL;
        this.#loginPath = loginPath;
        this.#locales = locales;
        this.#token = token;

        this.#contentType = contentType;
        this.#serializer = s;
    }

    /**
     * 返回关联的 Locales 对象
     */
    get locales(): Locales { return this.#locales; }

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
    async delete(path: string, withToken = true): Promise<Return> {
        return this.request(path, 'DELETE', undefined, withToken);
    }

    /**
     * POST 请求
     *
     * @param path 相对于 baseURL 的地址
     * @param body 上传的数据，若没有则为空
     * @param withToken 是否带上令牌，可参考 request
     */
    async post(path: string, body?: unknown, withToken = true): Promise<Return> {
        return this.request(path, 'POST', body, withToken);
    }

    /**
     * PUT 请求
     */
    async put(path: string, body?: unknown, withToken = true): Promise<Return> {
        return this.request(path, 'PUT', body, withToken);
    }

    /**
     * PATCH 请求
     */
    async patch(path: string, body?: unknown, withToken = true): Promise<Return> {
        return this.request(path, 'PATCH', body, withToken);
    }

    /**
     * GET 请求
     */
    async get(path: string, withToken = true): Promise<Return> {
        return this.request(path, 'GET', undefined, withToken);
    }

    /**
     * 执行普通的 API 请求
     *
     * @param path 请求地址，相对于 baseURL
     * @param method 请求方法
     * @param obj 请求对象，如果是 GET，可以为空。
     * @param withToken 是否带上令牌，如果此值为 true，那么在 token 过期的情况下会自动尝试刷新令牌。
     */
    async request(path: string, method: Method, obj?: unknown, withToken = true): Promise<Return> {
        const token = withToken ? await this.getToken() : undefined;
        const body = obj ? this.#serializer.stringify(obj) : undefined;
        return this.withArgument(path, method, token, this.#contentType, body);
    }

    /**
     * 执行上传操作
     *
     * @param path 上传地址，相对于 baseURL
     * @param obj 上传的对象
     * @param withToken 是否需要带上 token，如果为 true，那么在登录过期时会尝试刷新令牌。
     */
    async upload(path: string, obj: FormData, withToken = true): Promise<Return> {
        const token = withToken ? await this.getToken() : undefined;
        return this.withArgument(path, 'POST', token, undefined, obj);
    }

    /**
     * 是否处于登录状态
     */
    async isLogin(): Promise<boolean> {
        const token = await this.getToken();
        return token !== undefined;
    }

    /**
     * 退出当前的登录状态
     */
    async logout() {
        this.#token = null;
        await delToken();
    }

    /**
     * 获得令牌，如果令牌已经过期，会尝试刷新令牌。
     */
    async getToken(): Promise<string | undefined> {
        const t = this.#token;
        if (!t) {
            return undefined;
        }


        switch (state(t)) {
        case TokenState.Normal: // 正常状态
            return t.access_token;
        case TokenState.RefreshExpired: // 刷新令牌也过期了
            return undefined;
        case TokenState.AccessExpired: // 尝试刷新令牌
        { //大括号的作用是防止 case 内部的变量 ret 提升作用域！
            const ret = await this.withArgument(this.#loginPath, 'PUT', t.refresh_token, this.#contentType);
            if (!ret.ok) {
                return undefined;
            }

            this.#token = ret.body as Token;
            await writeToken(this.#token);
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
    async withArgument(path: string, method: Method, token?: string, ct?: string, body?: BodyInit): Promise<Return> {
        const h = new Headers({
            'Accept': this.#contentType + '; charset=UTF-8',
            'Accept-Language': this.#locales.current,
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
    async fetch(path: string, req?: RequestInit): Promise<Return> {
        const resp = await fetch(this.buildURL(path), req);

        // 200-299

        if (resp.ok) {
            const txt = await resp.text();
            if (txt.length === 0) {
                return { status: resp.status, ok: true };
            }
            return { status: resp.status, ok: true, body: this.#serializer.parse(txt) };
        }

        // TODO 300-399

        // 400-599

        let ok = false;
        switch (resp.status) {
        case 401:
            this.#token = null;
            await delToken();
            break;
        case 404: // 404 算正常返回
            ok = true;
        }

        let p: Problem | undefined;
        try {
            p = this.#serializer.parse(await resp.text()) as Problem;
        } catch (error) {
            console.error(error);
        }
        return { status: resp.status, ok: ok, problem: p };
    }
}

/**
 * 接口错误返回的对象
 */
export interface Problem {
    type: string
    title: string
    status: number
    detail?: string
    params?: Array<Param>
    instance?: string
    extension?: unknown
}

export interface Param {
    name: string
    reason: string
}

/**
 * 分页接口返回的对象
 */
export interface Page<T> {
    count: number
    current: Array<T>
    more?: boolean
}

/**
 * 接口返回的对象
 *
 * 如果 ok 为 true，表示返回的是正常的结果，该结果如果不为空，那么应该在 body 之中；
 * 如果 ok 为 false，表示返回的是非正常的结果，如果有错误信息，应该保存在 problem 之中。
 */
export interface Return {
    problem?: Problem
    body?: unknown
    status: number
    ok: boolean
}
