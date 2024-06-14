// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { App, inject, InjectionKey } from 'vue';
import { Composer, I18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';

import { initLocale } from '@/locales';
import { build as buildFetch, Method, Return } from '@/utils/fetch';

import type { Options } from './options';
import { buildOptions, setLogo, setTitle } from './options';

type VuetifyType = ReturnType<typeof createVuetify>;

type PluginType = Awaited<ReturnType<typeof createPlugin>>;

const pluginKey = Symbol.for('plugin-cmfx-admin') as InjectionKey<PluginType>;

/**
 * 仅在当前框架内部使用，提供了 useAdmin 的所有功能以及一些额外的增强功能。
 *
 * NOTE: 该方法只能在 setup 中使用。
 */
export function useInternal() {
    const inst = inject(pluginKey);
    if (!inst) {
        throw '未配置 createAdmin';
    }
    return inst;
}

/**
 * 获取框架的一些常用操作接口
 *
 * NOTE: 该方法只能在 setup 中使用。
 */
export function useAdmin(): Omit<PluginType, 'menus' | 'footer'> {
    const inst = inject(pluginKey);
    if (!inst) {
        throw '未配置 createAdmin';
    }
    return inst;
}

/**
 * 创建 Admin 插件的安装对象
 */
export async function createAdmin(o: Options, vuetify: VuetifyType, i18n: I18n) {
    const plugin = await createPlugin(o, vuetify, i18n);
    return {
        install(app: App) { app.provide(pluginKey, plugin); }// NOTE: install 不能是异步
    };
}

export async function createPlugin(opt: Options, vuetify: VuetifyType, i18n: I18n) {
    const o = await buildOptions(opt);
    const l = await initLocale(vuetify, i18n);
    const fetcher = await buildFetch(o.api.base, o.api.login, o.mimetype, l);
    const global = i18n.global as Composer;

    let siteTitle = o.title;
    let logo = o.logo;
    let pageTitle = '';

    return {
        get pageTitle() { return pageTitle; },
        set pageTitle(title: string) {
            pageTitle = title;

            if (title) {
                title += o.titleSeparator;
            }
            document.title = title + this.siteTitle;
        },

        get siteTitle() { return siteTitle; },
        set siteTitle(title: string) {
            siteTitle = title;
            (async () => { await setTitle(title); })();
        },

        get logo() { return logo; },
        set logo(l: string) {
            logo = l;
            (async () => { await setLogo(l); })();
        },

        get menus() { return o.page.menus; },

        get footer() { return o.page.footer ?? []; },

        set locale(v: string) { fetcher.locales.current = v; },
        get locale() { return fetcher.locales.current; },

        /**
        * 返回支持的语言
        */
        get supportedLanguages() { return fetcher.locales.supportedNames(); },

        ...{
            t: global.t,
            n: global.n,
            d: global.d
        },

        //--------------------- 以下是对 Fetcher 各个方法的转发 ----------------------------

        async isLogin(): Promise<boolean> { return await fetcher.isLogin(); },

        async logout() { await fetcher.logout(); },

        async get(path: string, withToken = true): Promise<Return> {
            return await fetcher.get(path, withToken);
        },

        async delete(path: string, withToken = true): Promise<Return> {
            return await fetcher.delete(path, withToken);
        },

        async post(path: string, body: unknown, withToken = true): Promise<Return> {
            return await fetcher.post(path, body, withToken);
        },

        async put(path: string, body: unknown, withToken = true): Promise<Return> {
            return await fetcher.put(path, body, withToken);
        },

        async patch(path: string, body: unknown, withToken = true): Promise<Return> {
            return await fetcher.patch(path, body, withToken);
        },

        async upload(path: string, obj: FormData, withToken = true): Promise<Return> {
            return await fetcher.upload(path, obj, withToken);
        },

        async fetchWithArgument(path: string, method: Method, token?: string, ct?: string, body?: BodyInit): Promise<Return> {
            return await fetcher.withArgument(path, method, token, ct, body);
        },

        async fetch(path: string, req?: RequestInit): Promise<Return> {
            return await fetcher.fetch(path, req);
        }
    };
}
