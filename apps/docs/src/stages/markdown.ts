// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Highlighter } from '@cmfx/components';
import { MarkedExtension, Marked } from 'marked';

import styles from './style.module.css';

const higlighter = await Highlighter.build('ts');

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
                    text: higlighter.html(token.text, 'ts', undefined, true, styles['simple-code'], true)
                });
                break;
            }
        }
    };
}

const markedParser = new Marked({ async: false }, markedCode());

/**
 * 解析 markdown 内容为普通的 html
 */
export function markdown(text: string): string {
    return markedParser.parse(text, { async: false });
}
