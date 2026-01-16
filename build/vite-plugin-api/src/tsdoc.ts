// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    DocCodeSpan, DocComment, DocLinkTag, DocMemberReference, DocNode, DocPlainText, StandardTags,
    TSDocConfiguration, TSDocParser, TSDocTagDefinition, TSDocTagSyntaxKind
} from '@microsoft/tsdoc';
import { JSDocableNode } from 'ts-morph';

export const reactiveTag = '@reactive';

export function newTSDocParser(): TSDocParser {
    const reactiveTagDef = new TSDocTagDefinition({
        tagName: reactiveTag,
        syntaxKind: TSDocTagSyntaxKind.ModifierTag
    });

    const conf = new TSDocConfiguration();

    conf.addTagDefinition(reactiveTagDef);
    conf.setSupportForTag(reactiveTagDef, true);

    conf.addTagDefinition(StandardTags.defaultValue);
    conf.setSupportForTag(StandardTags.defaultValue, true);

    return new TSDocParser(conf);
}

export function getTsdoc(parser: TSDocParser, decl: JSDocableNode): DocComment | undefined {
    const txt = decl.getJsDocs()[0]?.getFullText();
    return parser.parseString(txt ?? '').docComment;
}

export function getCustomDoc(tag: string, doc?: DocComment): string | undefined {
    const blk = doc?.customBlocks.find(blk => blk.blockTag.tagNameWithUpperCase === tag.toUpperCase());
    return comment2String(blk);
}

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
