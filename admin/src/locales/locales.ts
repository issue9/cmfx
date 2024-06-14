// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Composer } from 'vue-i18n';
import { locales } from './list';

/**
 * vuetify 与标准语言标签的充分一点关联
 */
const vuetifyLocales = new Map<string, string>([
    ['cmn-Hans', 'zhHans'],
    ['zh-CN', 'zhHans'],
    ['zh', 'zhHans'],
    ['chi', 'zhHans'],
    ['zho', 'zhHans'],

    ['cmn-Hant', 'zhHant'],
    ['zh-TW', 'zhHant'],
]);

export function getVuetifyLocale(locale: string): string {
    const id = vuetifyLocales.get(locale);
    if (id) {
        return id;
    }
    return locale;
}

export async function loadMessages(c: Composer) {
    for (const locale of locales) {
        const msg = await import(`./${locale}.json`);
        c.mergeLocaleMessage(locale, { '_internal': msg });
    }
}
