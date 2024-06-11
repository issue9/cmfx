// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';
import { Composer, I18n } from 'vue-i18n';
import { Router } from 'vue-router';
import { createVuetify } from 'vuetify';

import { XApp } from '@/pages/XApp';
import { createAdmin, Options } from '@/plugins';

/**
 * 创建 vue 的 app 实例并初始化必要的插件
 *
 * @param o 初始化当前框架需要的参数；
 * @param vuetify vuetify 实例；
 * @param i18n 本地化的 i18n 实例；
 * @returns 返回的 vue 的 App 实例
 */
export async function create(o: Options, router: Router, vuetify: ReturnType<typeof createVuetify>, i18n: I18n) {
    return createApp(XApp)
        .use(i18n)
        .use(router)
        .use(vuetify)
        .use(await createAdmin(o, i18n.global as Composer));
}
