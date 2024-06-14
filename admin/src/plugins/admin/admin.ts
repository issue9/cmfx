// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { I18n } from 'vue-i18n';

import { build as buildFetch, Method, Return } from '@/utils/fetch';

import { Options, setLogo, setTitle } from './options';
import { MenuItem } from './page';

type Fetcher = Awaited<ReturnType<typeof buildFetch>>;

export class Admin {
    readonly #fetcher: Fetcher;
    readonly #footer?: Array<MenuItem>;
    readonly #menus: Array<MenuItem>;
    readonly #titleSeparator: string;
    readonly #i18n: I18n;

    #siteTitle: string;
    #logo: string;
    #pageTitle = '';

    /**
     * 构造函数
     */
    constructor(o: Required<Options>, f: Fetcher, i18n: I18n) {
        this.#fetcher = f;
        this.#footer = o.page.footer;
        this.#menus = o.page.menus;
        this.#titleSeparator = o.titleSeparator;
        this.#i18n = i18n;

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

    get footer(): Array<MenuItem> { return this.#footer ?? []; }

    set locale(v: string) { this.#fetcher.locales.current = v; }
    get locale(): string { return this.#fetcher.locales.current; }

    /**
     * 返回支持的语言
     */
    get supportedLanguages() { return this.#fetcher.locales.supportedNames(); }

    get i18n(): I18n { return this.#i18n; }

    //--------------------- 以下是对 Fetcher 各个方法的转发 ----------------------------

    async isLogin(): Promise<boolean> { return await this.#fetcher.isLogin(); }

    async logout() { await this.#fetcher.logout(); }

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
