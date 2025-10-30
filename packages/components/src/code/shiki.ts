// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    BundledLanguage, CodeToHastOptions, createHighlighter, ThemeRegistrationRaw, codeToHtml, HighlighterGeneric
} from 'shiki/bundle/full';

import { joinClass } from '@/base';
import { copy2Clipboard } from '@/context';
import styles from './style.module.css';

window.copyShikiCode2Clipboard = copy2Clipboard;

declare global {
    namespace globalThis {
        var copyShikiCode2Clipboard: typeof copy2Clipboard;
    }
}

/**
 * 提供特定语言的代码高亮功能
 *
 * @remarks 与 {@link highlight} 的区别在于：
 *  - Highlighter 提供的高亮方法是同步的，而 {@link highlight} 是异步的；
 *  - Highlighter 在不使用时需要手动清除对象；
 * 用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 *
 * @typeParam L - 表示语言的 ID；
 */
export class Highlighter<L extends BundledLanguage> {
    /**
     * 构造可以高亮指定语言的对象
     *
     * @param langs - 语言 ID 列表；
     */
    static async build<L extends BundledLanguage>(...langs: Array<L>): Promise<Highlighter<L>> {
        const h = await createHighlighter({ themes: [shikiTheme], langs: langs });
        return new Highlighter<L>(h);
    }

    #h: HighlighterGeneric<L, never>;

    private constructor(h: HighlighterGeneric<L, never>) {
        this.#h = h;
    }

    /**
     * 高亮代码
     * @param code - 代码；
     * @param lang - 语言 ID；
     * @param ln - 起始行号，unndefined 表示不显示行号；
     * @param wrap - 是否换行；
     * @param cls - 传递给 pre 标签的 CSS 类名；
     * @param simple - 简单模式，没有复杂按钮，也没有语言名称，对于单行的代码可使用此方式；
     * @returns 高亮处理之后的 html 代码；
     */
    html(code: string, lang: L, ln?: number, wrap?: boolean, cls?: string, simple?: boolean): string {
        return this.#h.codeToHtml(code, buildOptions(code, lang, ln, wrap, cls, simple));
    }

    /**
     * 释放当前对象
     */
    dispose() { this.#h.dispose(); }
}

/**
 * 高亮代码
 *
 * @param code - 代码文本；
 * @param lang - 语言名称，默认为 text；
 * @param ln - 起始行号，不需要则为 undefined；
 * @param wrap - 是否自动换行；
 * @param cls - 传递给 pre 标签的 CSS 类名；
 * @param simple - 简单模式，没有复杂按钮，也没有语言名称，对于单行的代码可使用此方式；
 * @returns 高亮后的 HTML 代码；
 *
 * @remarks 用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export async function highlight(
    code: string, lang?: BundledLanguage, ln?: number, wrap?: boolean, cls?: string, simple?: boolean
): Promise<string> {
    return await codeToHtml(code, buildOptions(code, lang, ln, wrap, cls, simple));
}

// 定义了 shiki 的主题
const shikiTheme: ThemeRegistrationRaw = {
    // 以下变量的定义来源于：
    // https://github.com/shikijs/shiki/blob/9260f3fd109eca7bece80c92196f627ccae202d0/packages/core/src/theme-css-variables.ts
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

function buildOptions<L extends BundledLanguage>(
    code: string, lang?: L, ln?: number, wrap?: boolean, cls?: string, simple?: boolean
): CodeToHastOptions<L, never> {
    // 行号列的宽度，即使只有两行代码，但是从 9 开始计算行号，还是得有 2 位长度。
    const w = ln === undefined ? 0 : code.split('\n').length + ln;
    return {
        lang: lang || 'text',
        theme: shikiTheme,
        transformers: [{
            pre(node) {
                node.properties.class = joinClass(
                    undefined,
                    node.properties.class as string | null | undefined,
                    ln !== undefined ? styles.ln : '',
                    wrap ? styles.wrap : '',
                    cls,
                );
                node.properties.style += `;--line-number-start: ${ln};--line-number-width: ${w.toString().length}ch`;

                if (!simple) {
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
                            onclick: `window.copyShikiCode2Clipboard(this, '${code.replace(/'/g, '\\\'').replace(/\n/g, '\\\n')}')`
                        },
                        children: [{
                            // 图标：material-symbols:content-copy
                            type: 'element',
                            tagName: 'svg',
                            properties: {
                                width: '24',
                                height: '24',
                                viewBox: '0 0 24 24'
                            },
                            children: [{
                                type: 'element',
                                tagName: 'path',
                                properties: {
                                    fill: 'currentColor',
                                    d: 'M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z'
                                },
                                children: []
                            }]
                        }]
                    });
                }
            } // end pre()
        }]
    };
}
