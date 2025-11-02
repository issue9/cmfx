// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { highlight } from '@cmfx/components';
import type { MarkedExtension } from 'marked';

/**
 * 集成 shiki 的 marked 插件
 */
export function markedShiki(): MarkedExtension {
    return {
        async: true,

        async walkTokens(token) {
            if (token.type !== 'code') { return; }

            const htmlText = await highlight(token.text, token.lang);

            Object.assign(token, {
                type: 'html',
                block: true,
                text: `${htmlText}\n`
            });
        }
    };
}
