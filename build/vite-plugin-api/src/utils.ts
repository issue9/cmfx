// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { DocCodeSpan, DocLinkTag, DocMemberReference, DocNode, DocPlainText } from '@microsoft/tsdoc';

/**
 * 将一个 tsdoc 节点转换为文本
 */
export function comment2String(node?: DocNode): string | undefined {
    if (!node) { return undefined; }

    if (node instanceof DocPlainText) { return node.text.trim(); }

    if (node instanceof DocCodeSpan) { return `\`${node.code}\``; }

    if (node instanceof DocMemberReference) { return node.memberIdentifier?.identifier; }

    if (node instanceof DocLinkTag) {
        if (node.linkText) { // url
            return `[${node.linkText}](${node.urlDestination ?? node.linkText})`;
        }

        // 文档内链接，直接返回文本，链接在当前并无实际意义
        const nodes = node.getChildNodes().map(comment2String).filter(v => !!v);
        return nodes.length > 0 ? '`' + nodes.join('').trim() + '`' : undefined;
    }

    const nodes = node.getChildNodes().map(comment2String).filter(v => !!v);
    if (nodes.length <= 0) { return undefined; }
    const s = nodes.join('\n');
    return s.endsWith('\n\n') ? s : s + '\n\n'; // 防止过多的换行符
}
