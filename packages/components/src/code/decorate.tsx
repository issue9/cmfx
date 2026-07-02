// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, Show } from 'solid-js';
import { render } from 'solid-js/web';
import IconDown from '~icons/material-symbols/keyboard-arrow-down-rounded';
import IconUp from '~icons/material-symbols/keyboard-arrow-up-rounded';

import { Button, PrintButton, ToggleButton } from '@components/button';
import { ClipboardAPI } from '@components/clipboard';
import styles from './style.module.css';

type Dispose = () => void;

/**
 * 装饰器的类型
 *
 * @param pre - 代码高亮的对象，装饰器最终会被放在此元素上；
 * @returns 返回装饰器组件以及该组件的取消方法；
 * @remarks
 * 这是对代码高亮对象 pre 的各种修改，比如添加按钮，或是改变颜色等。
 */
export type CodeDecorate = (pre: HTMLPreElement) => [elem: JSX.Element, dispose: Dispose];

/**
 * 为 elem 及其子元素中的所有 shiki 代码块添加指定的装饰组件
 *
 * @param elem - 要装饰的元素；
 * @param decorates - 装饰器列表；
 * @remarks
 * 装饰器根据 {@link highlight} 的 decorate 参数而定。
 * 此操作会改变上下文环境，如果需要使用 Context 的相关信息，请使用 runWithOwner 创建上下文环境。
 */
export function withDecorate(elem: HTMLElement, ...decorates: Array<CodeDecorate>): Dispose | undefined {
	if (decorates.length === 0) {
		return;
	}

	const disposes: Array<Dispose> = [];

	if (elem.matches('[data-code]')) {
		// 当前元素匹配
		decorates.forEach(d => {
			const [e, dispose] = d(elem as HTMLPreElement);
			render(() => e, elem);
			disposes.push(dispose);
		});
	} else {
		const elems = elem.querySelectorAll('[data-code]');
		for (const elem of elems) {
			decorates.forEach(d => {
				const [e, dispose] = d(elem as HTMLPreElement);
				render(() => e, elem);
				disposes.push(dispose);
			});
		}
	}

	return () => disposes.map(d => d());
}

/**
 * 在右上角显示一个复制按钮的装饰器
 */
export function copyButtonDecorate(pre: HTMLPreElement): [JSX.Element, Dispose] {
	let clipboardRef: ClipboardAPI.Ref;
	let rootRef: Button.Ref;

	return [
		<Button
			ref={el => (rootRef = el)}
			class={styles.copy}
			square
			kind="flat"
			onclick={() => clipboardRef.writeText(pre.dataset.code ?? '')}
		>
			<ClipboardAPI ref={el => (clipboardRef = el)} />
		</Button>,
		() => rootRef.root().remove(),
	];
}

const toolbarItems = ['copy', 'fit', 'print', 'expand', 'title'] as const;

type ToolbarItem = (typeof toolbarItems)[number];

/**
 * 创建一个用于创建工具栏的装饰器
 *
 * @param buttons - 指定了工具栏上可以显示的按钮，如果为空则表示显示所有，支持以下类型：
 *  - copy 复制按钮；
 *  - fit 显示填充整个窗口窗口的按钮；
 *  - print 显示打印按钮；
 *  - expand 显示收缩展开按钮；
 *  - title 显示标题；
 */
export function createToolbarDecorate(...buttons: Array<ToolbarItem>): CodeDecorate {
	if (buttons.length === 0) {
		buttons = [...toolbarItems];
	}

	return (pre: HTMLPreElement): [JSX.Element, Dispose] => {
		let clipboardRef: ClipboardAPI.Ref;

		const oldFlexDir = pre.style.flexDirection;
		pre.style.flexDirection = 'column-reverse';

		const h = pre.offsetHeight;
		let toolbarRef: HTMLElement;

		const elem = (
			<header class={styles.toolbar} ref={el => (toolbarRef = el)}>
				<Show when={buttons.includes('title')}>
					<span>{pre.dataset.lang}</span>
				</Show>

				<div class={styles.actions}>
					<Show when={buttons.includes('copy')}>
						<Button
							class={styles.btn}
							square
							kind="flat"
							onclick={() => clipboardRef.writeText(pre.dataset.code ?? '')}
						>
							<ClipboardAPI ref={el => (clipboardRef = el)} />
						</Button>
					</Show>

					<Show when={buttons.includes('fit')}>
						<ToggleButton.FitScreen kind="flat" class={styles.btn} container={pre} />
					</Show>

					<Show when={buttons.includes('print')}>
						<PrintButton kind="flat" class={styles.btn} element={() => pre} />
					</Show>

					<Show when={buttons.includes('expand')}>
						<ToggleButton
							off={<IconUp />}
							on={<IconDown />}
							kind="flat"
							class={styles.btn}
							onToggle={async v => {
								pre.style.height = `${v ? toolbarRef.offsetHeight : h + toolbarRef.offsetHeight}px`;
								return v;
							}}
						/>
					</Show>
				</div>
			</header>
		);

		const dispose = () => {
			pre.style.flexDirection = oldFlexDir;
			toolbarRef.remove();
		};

		return [elem, dispose];
	};
}

/**
 * 显示代码框边框的装饰器
 */
export function borderDecorate(pre: HTMLPreElement): [JSX.Element, Dispose] {
	const oldBorder = pre.style.border;
	pre.style.border = '1px solid var(--palette-border)';
	return ['', () => (pre.style.border = oldBorder)];
}
