// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { getOwner, type JSX, runWithOwner } from 'solid-js';
import { render } from 'solid-js/web';

import { Button } from '@components/button';
import { ClipboardAPI } from '@components/clipboard';
import styles from './style.module.css';

/**
 * 装饰器的类型
 *
 * @param pre - 代码高亮的对象，装饰器最终会被放在此元素上；
 * @remarks
 * 这是对代码高亮对象 pre 的各种修改，比如添加按钮，或是改变颜色等。
 */
export type Decorate = (pre: HTMLPreElement) => JSX.Element;

/**
 * 获取的有已经注册的装饰器
 *
 * @remarks
 * 默认情况下，支持以下装饰器：
 * - toolbar 在顶部显示一个工具栏；
 * - copyButton 在右上角显示一个复制按钮；
 * - border 为代码组件显示边框；
 */
const decorates = new Map<string, Decorate>();

/**
 * 注册装饰器
 * @param name - 装饰器的名称；
 * @param decorate - 装饰器的实例；
 */
export function registerDecorate(name: string, decorate: Decorate): void {
	if (decorates.has(name)) {
		throw new Error(`${name} 已经存在`);
	}

	decorates.set(name, decorate);
}

/**
 * 获取装饰器的名称列表
 */
export function getDecorates(): Array<string> {
	return Array.from(decorates.keys());
}

/**
 * 为 elem 及其子元素中的所有 shiki 代码块添加指定的组件
 *
 * @remarks
 * 装饰器根据 {@link highlight} 的 decorate 参数而定。
 */
export function withDecorate(elem: HTMLElement): void {
	// 当前元素匹配
	if (elem.matches('[data-code]')) {
		mount(elem as HTMLPreElement);
		return;
	}

	const elems = elem.querySelectorAll('[data-code]');
	for (const elem of elems) {
		mount(elem as HTMLPreElement);
	}
}

/**
 * 根据 pre 上的 data-decorate 属性挂载相应的装饰器
 */
function mount(pre: HTMLPreElement) {
	const names = pre.dataset.decorate;
	if (!names) {
		return;
	}

	const owner = getOwner();

	for (const name of names.split(',')) {
		const d = decorates.get(name);
		if (d) {
			runWithOwner(owner, () => render(() => d(pre), pre));
		}
	}
}

/************************* 注册装饰器 **********************************/

registerDecorate('copy-button', pre => {
	let clipboardRef: ClipboardAPI.RootRef;

	return (
		<Button.Root class={styles.copy} square kind="flat" onclick={() => clipboardRef.writeText(pre.dataset.code ?? '')}>
			<ClipboardAPI.Root ref={el => (clipboardRef = el)} />
		</Button.Root>
	);
});

registerDecorate('toolbar', pre => {
	let clipboardRef: ClipboardAPI.RootRef;

	// 不需要考虑组件卸载之后如何改回原始的情况。
	// 因为生成的代码就已经固定了 decorate 属性，不会动态切换。
	pre.style.flexDirection = 'column-reverse';

	return (
		<header class={styles.toolbar}>
			<span>{pre.dataset.lang}</span>
			<div class={styles.actions}>
				<Button.Root
					class={styles.btn}
					square
					kind="flat"
					onclick={() => clipboardRef.writeText(pre.dataset.code ?? '')}
				>
					<ClipboardAPI.Root ref={el => (clipboardRef = el)} />
				</Button.Root>
			</div>
		</header>
	);
});

registerDecorate('border', pre => {
	pre.style.border = '1px solid var(--palette-border)';
	return '';
});
