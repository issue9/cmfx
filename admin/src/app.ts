// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createApp } from 'vue';
import { createVuetify, VuetifyOptions } from 'vuetify';

import { XApp } from '@/pages/XApp';
import { createAdmin, Options } from '@/plugins';

/**
 * 创建 vue 的 app 实例并初始化必要的插件
 *
 * @param o 初始化当前框架需要的参数；
 * @param vo vuetify 的参数；
 * @returns 返回的 vue 的 App 实例
 */
export async function create(o: Options, vo: VuetifyOptions) {
    return createApp(XApp)
        .use(createVuetify(vo))
        .use(await createAdmin(o));
}
