// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createApp } from 'vue';
import { createVuetify, VuetifyOptions } from 'vuetify';

import { XApp } from '@/pages/XApp';
import { createAdmin, Options } from '@/plugins';

/**
 * 创建 vue 的 app 实例
 *
 * @param o 当前插件的参数；
 * @param vo vuetify 的参数；
 */
export function create(o: Options, vo: VuetifyOptions) {
    return createApp(XApp)
        .use(createVuetify(vo))
        .use(createAdmin(o))
}
