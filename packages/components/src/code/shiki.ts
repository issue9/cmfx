// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { BundledLanguage, codeToHtml } from 'shiki/bundle/full';

const shikiStyle = {
    name: 'light',
    bg: 'var(--bg)',
    fg: 'var(--fg)',
    settings: [
        {
            scope: ['keyword'],
            settings: { foreground: 'var(--primary-fg)' }
        },
        {
            scope: ['constant'],
            settings: { foreground: 'var(--primary-fg-high)' }
        },
        {
            scope: ['parameter'],
            settings: { foreground: 'var(--secondary-fg)' }
        },
        {
            scope: ['function', 'string-expression'],
            settings: { foreground: 'var(--error-fg)' }
        },
        {
            scope: ['string', 'comment'],
            settings: { foreground: 'var(--tertiary-fg)' }
        },
        {
            scope: ['link', 'punctuation'],
            settings: { foreground: 'var(--surface-fg)' }
        },
    ]
};

/**
 * 高亮代码
 * @param code - 代码文本；
 * @param lang - 语言名称，默认为 text；
 * @returns 高亮后的 HTML 代码
 */
export async function highlightCode(code: string, lang?: BundledLanguage) {
    return await codeToHtml(code, {
        lang: lang || 'text',
        themes: {
            light: structuredClone(shikiStyle),
            dark: structuredClone(shikiStyle),
        },
    });
}
