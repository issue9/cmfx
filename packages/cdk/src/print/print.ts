// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import styles from './style.module.css';

/**
 * 打印指定元素的内容
 *
 * @param elem - 该元素会被打印；
 * @param cls - 额外的 CSS 类；
 *
 * @remarks
 * 这会通过 cloneNode 创建新的节点，cls 只会应用在新节点上。
 */
export function printElement(elem: HTMLElement, cls?: string): void {
	const node = document.createElement('div');
	node.className = styles.printable;

	const p = elem.cloneNode(true) as HTMLElement;
	if (cls) {
		p.classList.add(cls);
	}

	node.appendChild(p);

	document.body.appendChild(node);
	window.print();
	node.remove();
}

/**
 * 添加该类的元素在打印时会被隐藏
 */
export const noPrint = styles['no-print'];
