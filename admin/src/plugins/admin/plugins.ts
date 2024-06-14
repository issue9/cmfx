// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { App, inject, InjectionKey } from 'vue';
import { Composer, I18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';

import { getVuetifyLocale, loadMessages } from '@/locales/locales';
import { build } from '@/utils/fetch';
import { Locales } from '@/utils/locales/locales';

import { Admin } from './admin';
import { buildOptions, Options } from './options';

/**
 * 创建 Admin 插件的安装对象
 *
 * @param o 需要的参数
 */
export async function createAdmin(o: Options, vuetify: ReturnType<typeof createVuetify>, i18n: I18n) {
    const opt = await buildOptions(o);

    const global = i18n.global as Composer;
    await loadMessages(global);
    const tags = Object.keys(global.messages.value);
    const index = tags.indexOf(global.fallbackLocale.value as string); // BUG: index 可能为 -1

    const l = new Locales(tags, index, global.locale.value);
    l.afterChange((matched) => {
        vuetify.locale.current.value = getVuetifyLocale(matched);  // 改变 vuetify 的语言
        i18n.global.locale = matched; // vue-i18n 切换语言
        document.documentElement.lang = matched; // 改变 html.lang
    });

    const f = await build(opt.api.base, opt.api.login, opt.mimetype, l);

    return {
        install(app: App) { // NOTE: install 不能是异步
            app.provide(key, new Admin(opt, f, i18n));
        }
    };
}

/**
 * 仅在当前框架内部使用，提供了 useAdmin 的所有功能以及一些额外的增强功能。
 *
 * NOTE: 该方法只能在 setup 中使用。
 */
export function useInternal() {
    const inst = inject(key);
    if (!inst) {
        throw '未配置 createAdmin';
    }

    return {
        admin: inst as ReturnType<typeof useAdmin>,
        t: inst.i18n.global.t,
        n: inst.i18n.global.n, // TODO 移至 userAdmin
        menus: inst.menus,
        footer: inst.footer
    };
}

/**
 * 获取框架的一些常用操作接口
 *
 * NOTE: 该方法只能在 setup 中使用。
 */
export function useAdmin(): Omit<Admin, 'i18n' | 'menus' | 'footer'> {
    const inst = inject(key);
    if (!inst) {
        throw '未配置 createAdmin';
    }

    return inst;
}

const key = Symbol.for('plugin-cmfx-admin') as InjectionKey<Admin>;
