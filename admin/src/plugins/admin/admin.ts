// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Fetcher, Method, Return } from '@/utils/fetch';

import { MenuItem, Options, setLogo, setTitle } from './options';

export class Admin {
    readonly #fetcher: Fetcher;
    readonly #footer: Array<MenuItem>;
    readonly #menus: Array<MenuItem>;
    readonly #titleSeparator: string;

    #siteTitle: string;
    #logo: string;
    #pageTitle = '';

    /**
     * 构造函数
     *
     * @param o 用于初始化的参数
     */
    constructor(o: Required<Options>) {
        this.#fetcher = new Fetcher(o.baseURL, o.apis.login, o.mimetype, navigator.languages[0]);
        this.#footer = o.footer;
        this.#menus = o.menus;
        this.#titleSeparator = o.titleSeparator;

        this.#siteTitle = o.title;
        this.#logo = o.logo;
    }

    get pageTitle(): string { return this.#pageTitle; }
    set pageTitle(title: string) {
        this.#pageTitle = title;

        if (title) {
            title += this.#titleSeparator;
        }
        document.title = title + this.siteTitle;
    }

    get siteTitle(): string { return this.#siteTitle; }
    set siteTitle(title: string) {
        this.#siteTitle = title;
        (async () => { await setTitle(title); })();
    }

    get logo(): string { return this.#logo; }
    set logo(logo: string) {
        this.#logo = logo;
        (async () => { await setLogo(logo); })();
    };

    get menus(): Array<MenuItem> { return this.#menus; }

    get footer(): Array<MenuItem> { return this.#footer; }

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

    async upload(path: string, obj: FormData, withToken = true): Promise<Return> {
        return await this.#fetcher.upload(path, obj, withToken);
    }

    async fetchWithArgument(path: string, method: Method, token?: string, ct?: string, body?: BodyInit): Promise<Return> {
        return await this.#fetcher.withArgument(path, method, token, ct, body);
    }

    async fetch(path: string, req?: RequestInit): Promise<Return> {
        return await this.#fetcher.fetch(path, req);
    }
}