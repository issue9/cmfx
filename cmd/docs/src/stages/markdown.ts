// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MarkedExtension, Marked } from 'marked';

const markedParser = new Marked({ async: false }, markedCode());

function markedCode(): MarkedExtension {
    return {
        walkTokens(token) {
            if (token.type !== 'codespan') { return; }

            Object.assign(token, {
                type: 'html',
                block: true,
                text: `<code>${token.text}</code>`
            });
        }
    };
}

/**
 * 解析 markdown 内容为普通的 html
 */
export function markdown(text: string): string {
    return markedParser.parse(text, { async: false });
}
