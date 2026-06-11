// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { printElement } from '@cmfx/core';
import type { JSX } from 'solid-js';
import { mergeProps, splitProps } from 'solid-js';
import IconPrint from '~icons/material-symbols/print';

import type { BaseRef, RefProps } from '@components/base';
import { Button } from '@components/button/button';
import { useLocale } from '@components/context';

export interface PrintButtonRef extends BaseRef<Button.Ref<false>> {
	/**
	 * 调用当前组件的打印方法
	 */
	print(): void;
}

export interface PrintButtonProps
	extends Omit<Button.NormalProps, 'onclick' | 'children' | 'ref' | 'square' | 'title'>,
		RefProps<PrintButtonRef> {
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
}

/**
 * 打印指定内容的按钮
 */
export function PrintButton(props: PrintButtonProps): JSX.Element {
	props = mergeProps(Button.presetProps as PrintButtonProps, props);
	const [, p] = splitProps(props, ['ref', 'element', 'printClass']);

	const l = useLocale();

	const print = () => printElement(props.element(), props.printClass);

	return (
		<Button
			onclick={print}
			square
			{...p}
			ref={el => {
				el.root().ariaLabel = l.t('_c.print');

				if (props.ref) {
					props.ref({
						root: () => el,
						print: print,
					});
				}
			}}
		>
			<IconPrint />
		</Button>
	);
}
