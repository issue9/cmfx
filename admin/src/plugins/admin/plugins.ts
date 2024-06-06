// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { App, inject, InjectionKey, Plugin } from 'vue';
import { Fetcher, Return, Method } from '@/utils/fetch';

import { Options, buildOptions } from './options';
import { Env } from './apis.ts';

export class Admin {
    readonly #fetcher: Fetcher;
    readonly #options: Required<Options>;
    readonly #env: Env;
    #title = '';

    /**
     * 构造函数
     *
     * @param o 用于初始化的参数
     * @param f Fetcher 实例
     * @param env 由 APIs.env 返回的对象
     */
    constructor(o: Required<Options>, f: Fetcher, env: Env) {
        this.#options = o;
        this.#fetcher = f;
        this.#env = env;
    }

    /**
     * 用户在初始化插件时的参数
     */
    get options(): Required<Options> {return this.#options;}

    /**
     * 当前页面的标题
     */
    get title(): string { return this.#title; }

    /**
     * 当前页面的标题
     * @param title
     */
    set title(title: string) {
        this.#title = title;
        
        if (title) {
            title += this.options.titleSeparator;
        }
        document.title = title + this.#env.name;
    }
    
    //--------------------- 以下是对 Fetcher 各个方法的转发 ----------------------------
    
    async get(path: string, withToken = true): Promise<Return> {
        return await this.#fetcher.get(path, withToken);
    }

    async delete(path: string, withToken = true): Promise<Return> {
        return await this.#fetcher.delete(path, withToken);
    }

    async post(path: string, body: unknown, withToken = true): Promise<Return> {
        return await this.#fetcher.post(path, body, withToken);
    }

    async put(path: string, body: unknown, withToken = true): Promise<Return> {
        return await this.#fetcher.put(path, body, withToken);
    }

    async patch(path: string, body: unknown, withToken = true): Promise<Return> {
        return await this.#fetcher.patch(path, body, withToken);
    }

    async upload(path: string, obj: FormData, withToken = true): Promise<Return>{
        return await this.#fetcher.upload(path, obj, withToken);
    }

    async fetchWithArgument(path: string, method: Method, token?: string, ct?: string, body?: BodyInit): Promise<Return> {
        return await this.#fetcher.withArgument(path, method, token, ct, body);
    }

    async fetch(path: string, req?: RequestInit): Promise<Return> {
        return await this.#fetcher.fetch(path, req);
    }
}

/**
 * 构建 Admin 实例
 * 
 * 异步函数，不能直接由构造函数代替。
 */
async function buildAdmin(o: Options): Promise<Admin> {
    const opt = buildOptions(o);
    const f = new Fetcher(o.baseURL, o.apis.login, opt.mimetype, navigator.languages[0]);

    const ret = await f.get(o.apis.env, false);
    if (!ret.ok) {
        throw ret.problem; // TODO
    }

    return new Admin(opt, f, ret.body as Env);
}

/**
 * 创建应用于全局操作的插件
 *
 * @param o 需要的参数
 */
export function createAdmin(o: Options): Plugin<Admin> {
    return {
        async install(app: App) {
            app.provide(adminKey, await buildAdmin(o));
        }
    };
}

/**
 * 获取由 createAdmin 创建的插件
 */
export function useAdmin(): Admin {
    const inst = inject(adminKey);
    if (!inst) {
        throw '未配置 useAdmin';
    }
    return inst;
}

const adminKey = Symbol() as InjectionKey<Admin>;
