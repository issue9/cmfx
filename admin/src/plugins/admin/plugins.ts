// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { App, inject, InjectionKey } from 'vue';

import { buildOptions, Options } from './options';
import { Admin} from '@/plugins/admin/admin.ts';


/**
 * 创建 Admin 插件的安装对象
 *
 * @param o 需要的参数
 */
export async function createAdmin(o: Options) {
    const opt = await buildOptions(o);
    return {
        install(app: App) { // NOTE: 不能是异步
            app.provide(key, new Admin(opt));
        }
    };
}

/**
 * 获取由 createAdmin 创建的插件
 */
export function useAdmin(): Admin {
    const inst = inject(key);
    if (!inst) {
        throw '未配置 useAdmin';
    }
    return inst;
}

const key = Symbol.for('plugin-cmfx-admin') as InjectionKey<Admin>;
