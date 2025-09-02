// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { copy2Clipboard } from '@/kit';
import { BundledLanguage, ThemeRegistrationRaw, codeToHtml } from 'shiki/bundle/full';

import { joinClass } from '@/base';
import styles from './style.module.css';

window.copyShikiCode2Clipboard = copy2Clipboard;

declare global {
    namespace globalThis {
        var copyShikiCode2Clipboard: typeof copy2Clipboard;
    }
}

// 以下变量的定义来源于：
// https://github.com/shikijs/shiki/blob/9260f3fd109eca7bece80c92196f627ccae202d0/packages/core/src/theme-css-variables.ts
const shikiStyle: ThemeRegistrationRaw = {
    name: styles.shiki,
    bg: 'var(--bg)',
    fg: 'var(--fg)',
    settings: [{
        scope: [
            'keyword.operator.accessor',
            'meta.group.braces.round.function.arguments',
            'meta.template.expression',
            'markup.fenced_code meta.embedded.block',
        ],
        settings: {
            foreground: 'var(--fg)',
        },
    },
    {
        scope: 'emphasis',
        settings: {
            fontStyle: 'italic',
        },
    },
    {
        scope: ['strong', 'markup.heading.markdown', 'markup.bold.markdown'],
        settings: {
            fontStyle: 'bold',
        },
    },
    {
        scope: ['markup.italic.markdown'],
        settings: {
            fontStyle: 'italic',
        },
    },
    {
        scope: 'meta.link.inline.markdown',
        settings: {
            fontStyle: 'underline',
            foreground: 'var(--primary-fg)',
        },
    },
    {
        scope: ['string', 'markup.fenced_code', 'markup.inline'],
        settings: {
            foreground: 'var(--primary-fg-low)',
        },
    },
    {
        scope: ['comment', 'string.quoted.docstring.multi'],
        settings: {
            foreground: 'var(--primary-fg-high)',
        },
    },
    {
        scope: [
            'constant.numeric',
            'constant.language',
            'constant.other.placeholder',
            'constant.character.format.placeholder',
            'variable.language.this',
            'variable.other.object',
            'variable.other.class',
            'variable.other.constant',
            'meta.property-name',
            'meta.property-value',
            'support',
        ],
        settings: {
            foreground: 'var(--error-fg)',
        },
    },
    {
        scope: [
            'keyword',
            'storage.modifier',
            'storage.type',
            'storage.control.clojure',
            'entity.name.function.clojure',
            'entity.name.tag.yaml',
            'support.function.node',
            'support.type.property-name.json',
            'punctuation.separator.key-value',
            'punctuation.definition.template-expression',
        ],
        settings: {
            foreground: 'var(--error-fg-low)',
        },
    },
    {
        scope: 'variable.parameter.function',
        settings: {
            foreground: 'var(--error-fg-high)',
        },
    },
    {
        scope: [
            'support.function',
            'entity.name.type',
            'entity.other.inherited-class',
            'meta.function-call',
            'meta.instance.constructor',
            'entity.other.attribute-name',
            'entity.name.function',
            'constant.keyword.clojure',
        ],
        settings: {
            foreground: 'var(--tertiary-fg)',
        },
    },
    {
        scope: [
            'entity.name.tag',
            'string.quoted',
            'string.regexp',
            'string.interpolated',
            'string.template',
            'string.unquoted.plain.out.yaml',
            'keyword.other.template',
        ],
        settings: {
            foreground: 'var(--tertiary-fg-low)',
        },
    },
    {
        scope: [
            'punctuation.definition.arguments',
            'punctuation.definition.dict',
            'punctuation.separator',
            'meta.function-call.arguments',
        ],
        settings: {
            foreground: 'var(--tertiary-fg-high)',
        },
    },
    {
        // [Custom] Markdown links
        scope: [
            'markup.underline.link',
            'punctuation.definition.metadata.markdown',
        ],
        settings: {
            foreground: 'var(--secondary-fg)',
        },
    },
    {
        // [Custom] Markdown list
        scope: ['beginning.punctuation.definition.list.markdown'],
        settings: {
            foreground: 'var(--secondary-fg-low)',
        },
    },
    {
        // [Custom] Markdown punctuation definition brackets
        scope: [
            'punctuation.definition.string.begin.markdown',
            'punctuation.definition.string.end.markdown',
            'string.other.link.title.markdown',
            'string.other.link.description.markdown',
        ],
        settings: {
            foreground: 'var(--secondary-fg-high)',
        },
    },
    {
        // [Custom] Diff
        scope: [
            'markup.inserted',
            'meta.diff.header.to-file',
            'punctuation.definition.inserted',
        ],
        settings: {
            foreground: 'var(--surface-fg)',
        },
    },
    {
        scope: [
            'markup.deleted',
            'meta.diff.header.from-file',
            'punctuation.definition.deleted',
        ],
        settings: {
            foreground: 'var(--surface-fg-low)',
        },
    },
    {
        scope: [
            'markup.changed',
            'punctuation.definition.changed',
        ],
        settings: {
            foreground: 'var(--surface-fg-high)',
        },
    },
    ],
};

/**
 * 高亮代码
 *
 * @param code - 代码文本；
 * @param lang - 语言名称，默认为 text；
 * @param ln - 起始行号，不需要则为 undefined；
 * @param wrap - 是否自动换行；
 * @param cls - 传递给 pre 标签的 CSS 类名；
 * @returns 高亮后的 HTML 代码；
 *
 * @remarks 用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export async function highlightCode(
    code: string, lang?: BundledLanguage, ln?: number, wrap?: boolean, cls?: string,
): Promise<string> {
    const w = ln !== undefined
        ? code.split('\n').length + ln // 二行代码，但是从 9 开始计算行号，还是得有 2 位长度。
        : 0;

    return await codeToHtml(code, {
        lang: lang || 'text',
        theme: shikiStyle,
        transformers: [
            {
                pre(node) {
                    node.properties.class = joinClass(
                        node.properties.class as string | null | undefined,
                        ln !== undefined ? styles.ln : '',
                        wrap ? styles.wrap : '',
                        cls,
                    );
                    node.properties.style += `;--line-number-start: ${ln};--line-number-width: ${w.toString().length}ch`;

                    if (lang) { // 显示语言标签
                        node.children.unshift({
                            type: 'element',
                            tagName: 'i',
                            properties: { class: styles.lang },
                            children: [{ type: 'text', value: lang }]
                        });
                    }

                    node.children.push({ // 复制按钮
                        type: 'element',
                        tagName: 'button',
                        properties: {
                            class: styles.action,
                            onclick:`window.copyShikiCode2Clipboard(this, '${code.replace(/'/g, '\\\'').replace(/\n/g, '\\\n')}')`
                        },
                        children: [
                            {
                                // 图标：material-symbols:content-copy
                                type: 'element',
                                tagName: 'svg',
                                properties: {
                                    width: '24',
                                    height: '24',
                                    viewBox: '0 0 24 24'
                                },
                                children: [
                                    {
                                        type: 'element',
                                        tagName: 'path',
                                        properties: {
                                            fill: 'currentColor',
                                            d: 'M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z'
                                        },
                                        children: []
                                    },
                                ]
                            },
                        ]
                    });
                }
            }
        ]
    });
}
