// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { App, inject, InjectionKey } from 'vue';

import { build } from '@/utils/fetch';
import {Locales} from '@/utils/locales/locales.ts';

import { Admin } from './admin';
import { buildOptions, Options } from './options';

/**
 * 创建 Admin 插件的安装对象
 *
 * @param o 需要的参数
 */
export async function createAdmin(o: Options) {
    const opt = await buildOptions(o);
    const l = new Locales(opt.languages, opt.language);
    const f = await build(opt.api.base, opt.api.login, opt.mimetype, l);
    
    return {
        install(app: App) { // NOTE: install 不能是异步
            app.provide(key, new Admin(opt, f));
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
        t: inst.i18n.t,
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
