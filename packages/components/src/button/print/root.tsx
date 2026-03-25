// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { printElement } from '@cmfx/core';
import type { JSX } from 'solid-js';
import { Match, mergeProps, Switch, splitProps } from 'solid-js';
import IconPrint from '~icons/material-symbols/print';

import type { BaseRef, RefProps } from '@components/base';
import { Button } from '@components/button/button';
import { useLocale } from '@components/context';

export interface Ref extends BaseRef<Button.RootRef<false>> {
	/**
	 * 调用当前组件的打印方法
	 */
	print(): void;
}

export const displays = ['icon', 'text', 'all'] as const;

/**
 * 按钮上的显示内容
 */
export type Display = (typeof displays)[number];

export interface Props
	extends Omit<Button.ButtonProps, 'onclick' | 'children' | 'ref' | 'square' | 'title'>,
		RefProps<Ref> {
	/**
	 * 获取要打印的元素
	 */
	element: () => HTMLElement;

	/**
	 * 额外的 CSS 类
	 *
	 * @reactive
	 */
	printClass?: string;

	/**
	 * 按钮上的显示内容
	 *
	 * @reactive
	 * @defaultValue 'all'
	 */
	display?: Display;
}

/**
 * 打印指定内容的按钮
 */
export function Root(props: Props): JSX.Element {
	props = mergeProps({ display: 'icon' as Display }, props);
	const [, p] = splitProps(props, ['ref', 'element', 'printClass', 'display']);

	const l = useLocale();

	const print = () => {
		printElement(props.element(), props.printClass);
	};

	return (
		<Button.Root
			onclick={print}
			square={props.display === 'icon'}
			{...p}
			ref={el => {
				el.root().ariaLabel = l.t('_c.print');
				if (props.display === 'icon' || !props.display) {
					el.root().title = l.t('_c.print');
				}

				if (props.ref) {
					props.ref({
						root: () => el,
						print: print,
					});
				}
			}}
		>
			<Switch fallback={<IconPrint />}>
				<Match when={props.display === 'all'}>
					<IconPrint class="me-1" />
					{l.t('_c.print')}
				</Match>

				<Match when={props.display === 'text'}>{l.t('_c.print')}</Match>
			</Switch>
		</Button.Root>
	);
}
