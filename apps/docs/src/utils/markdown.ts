// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Highlighter } from '@cmfx/components';
import { Marked, MarkedExtension } from 'marked';

import styles from './style.module.css';

const higlighter = await Highlighter.build('ts', 'tsx', 'js', 'jsx', 'html', 'css', 'go', 'git-commit');

function markedCode(): MarkedExtension {
    return {
        walkTokens(token) {
            switch (token.type) {
            case 'codespan':
                Object.assign(token, {
                    type: 'html',
                    block: true,
                    text: `<code>${token.text}</code>`
                });
                break;
            case 'code':
                Object.assign(token, {
                    type: 'html',
                    block: true,
                    text: higlighter.html(token.text, token.lang, undefined, true, styles['simple-code'], undefined, true)
                });
                break;
            }
        }
    };
}

const markedParser = new Marked({ async: false }, markedCode());

/**
 * 解析 markdown 内容为普通的 html
 *
 * @remarks
 * 支持部分语言的代码高亮
 */
export function markdown(text?: string): string {
    return text ? markedParser.parse(text, { async: false }) : '';
}
