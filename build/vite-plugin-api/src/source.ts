// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Node, Signature } from 'ts-morph';

/**
 * 获取节点 n 的源代码表示形式
 */
export function getNodeSource(n?: Node): string {
	if (!n) {
		return '';
	}

	const sf = n.getSourceFile();
	const txt = n.getType().getText(sf);
	if (!txt.includes('import(')) {
		return txt;
	}

	const alias = sf.getTypeAliasOrThrow(n.getType().getText());
	return alias.getTypeNodeOrThrow().getText();
}

/**
 * 获取函数签名的源代码
 */
export function getFuncSigSource(sig: Signature): string {
	return trimSource(sig.getDeclaration().getText());
}

const exportDeclare = 'export declare ';

function trimSource(source: string): string {
	source = source.trim();
	source = source.startsWith(exportDeclare) ? source.slice(exportDeclare.length) : source;
	return source.endsWith(';') ? source.slice(0, -1) : source;
}
