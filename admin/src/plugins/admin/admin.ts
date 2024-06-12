// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Composer, createI18n } from 'vue-i18n';
import { useLocale } from 'vuetify';

import { locales } from '@/locales/locales';
import { Fetcher, Method, Return } from '@/utils/fetch';

import { Options, setLogo, setTitle } from './options';
import { MenuItem } from './page';

export class Admin {
    readonly #fetcher: Fetcher;
    readonly #footer?: Array<MenuItem>;
    readonly #menus: Array<MenuItem>;
    readonly #titleSeparator: string;
    readonly #i18n: Composer;

    #siteTitle: string;
    #logo: string;
    #pageTitle = '';

    /**
     * 构造函数
     *
     * @param o 用于初始化的参数
     */
    constructor(o: Required<Options>, f: Fetcher) {
        this.#fetcher = f;
        this.#footer = o.page.footer;
        this.#menus = o.page.menus;
        this.#titleSeparator = o.titleSeparator;

        this.#i18n = createI18n({ legacy: false }).global;
        for (const locale of locales) {
            import(`@/locales/${locale}.json`).then((msg) => {
                this.#i18n.setLocaleMessage(locale, msg);
            });
        }

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

    set locale(v: string) {
        this.#fetcher.locale = v;

        document.head.lang = v;

        const { current } = useLocale();
        current.value = v;

        this.#i18n.locale.value = v;
    }
    get locale(): string { return this.#fetcher.locale; }

    get i18n(): Composer { return this.#i18n; }

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
