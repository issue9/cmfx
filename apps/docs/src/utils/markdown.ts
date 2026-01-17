// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Highlighter } from '@cmfx/components';
import { Source } from '@cmfx/vite-plugin-api';
import { parse, Token } from 'marked';

import styles from './style.module.css';

const higlighter = await Highlighter.build(
    'bash', 'css', 'git-commit', 'go', 'html', 'js', 'json', 'jsx', 'ts', 'tsx', 'yaml'
);

function markdownCode(types?: Array<Source>) {
    return (token: Token) => {
        switch (token.type) {
        case 'codespan':
            Object.assign(token, {
                type: 'html',
                block: true,
                text: `<code>${token.text}</code>`
            });
            break;
        case 'code':
            const lang = token.lang.split(' ');

            let txt = token.text;
            if (lang[1]) {
                if (!types) { throw new Error('参数 types 不能为空'); }

                txt = '';
                const objs = lang[1].split(',');
                for (const obj of objs) {
                    if (txt) { txt += '\n\n'; }
                    txt += types.find(typ => typ.name === obj)?.source;
                }

            }
            Object.assign(token, {
                type: 'html',
                block: true,
                text: higlighter.html(
                    txt, lang[0], undefined, true, styles['simple-code'], undefined, true
                )
            });
            break;
        }
    };
}

/**
 * 解析 markdown 内容为普通的 html
 *
 * @remarks
 * 需要在初始化 higlighter 时指定的语言才会有高亮效果。
 */
export function markdown(text?: string, types?: Array<Source>): string {
    return text ? parse(text, { async: false, walkTokens:  markdownCode(types)}) : '';
}
