// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Composer, I18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';

import { Locales } from '@/utils/locales';

import { default as cmnHans } from './cmn-Hans';
import { Locale, default as en } from './en';

// 指定了当前框架内置的翻译内容
const locales = new Map<string, Locale>([
    ['en', en],
    ['cmn-Hans', cmnHans]
]);

// vuetify 与标准语言标签的充分一点关联
const vuetifyLocales = new Map<string, string>([
    ['cmn-Hans', 'zhHans'],
    ['zh-CN', 'zhHans'],
    ['zh', 'zhHans'],
    ['chi', 'zhHans'],
    ['zho', 'zhHans'],

    ['cmn-Hant', 'zhHant'],
    ['zh-TW', 'zhHant'],
]);

/**
 * 初始化本地化的相关内容
 */
export async function initLocale(vuetify: ReturnType<typeof createVuetify>, i18n: I18n): Promise<Locales> {
    const global = i18n.global as Composer;

    // 加载框架内置的翻译内容
    locales.forEach((v, k) => {
        global.mergeLocaleMessage(k, { '_internal': v });
    });

    const tags = Object.keys(global.messages.value);
    const index = tags.indexOf(global.fallbackLocale.value as string);
    if (index < 0) {
        throw 'vue-i18n: fallbackLocale 并不存在于 messages 之中';
    }


    const l = new Locales(tags, index, global.locale.value);
    l.afterChange((matched) => {
        vuetify.locale.current.value = getVuetifyLocale(matched);  // 改变 vuetify 的语言
        global.locale.value = matched; // vue-i18n 切换语言
        document.documentElement.lang = matched; // 改变 html.lang
    });

    return l;
}

function getVuetifyLocale(locale: string): string {
    const id = vuetifyLocales.get(locale);
    if (id) {
        return id;
    }
    return locale;
}
