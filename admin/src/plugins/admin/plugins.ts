// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { App, inject, InjectionKey } from 'vue';

import { build } from '@/utils/fetch';

import { Composer } from 'vue-i18n';
import { Admin } from './admin';
import { buildOptions, Options } from './options';

/**
 * 创建 Admin 插件的安装对象
 *
 * @param o 需要的参数
 */
export async function createAdmin(o: Options, i18n: Composer) {
    const opt = await buildOptions(o);
    const f = await build(opt.api.base, opt.api.login, opt.mimetype, navigator.languages[0]);
    return {
        install(app: App) { // NOTE: install 不能是异步
            app.provide(key, new Admin(opt, f, i18n));
        }
    };
}

/**
 * 获取由 createAdmin 创建的插件
 *
 * NOTE: 该方法只能在 setup 中使用。
 */
export function useAdmin(): Admin {
    const inst = inject(key);
    if (!inst) {
        throw '未配置 useAdmin';
    }
    return inst;
}

const key = Symbol.for('plugin-cmfx-admin') as InjectionKey<Admin>;
