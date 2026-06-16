// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX, ParentProps } from 'solid-js';
import { mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';

import type { AvailableEnumType, Layout, RefProps } from '@components/base';
import { Button } from '@components/button/button';
import styles from '@components/button/common/style.module.css';
import { type Props as BaseProps, presetProps as presetBaseProps } from '@components/button/common/types';
import { ButtonGroup } from '@components/button/group';
import { Dropdown } from '@components/menu';

export interface SplitButtonRef extends Dropdown.Ref {
	/**
	 * 返回按按钮组的组件实例
	 */
	group(): ButtonGroup.Ref;
}

/**
 * 单选下拉菜单的属性
 */
export interface SplitButtonSingleProps<T extends AvailableEnumType = string>
	extends Omit<Extract<Dropdown.Props<T>, { multiple?: false }>, 'trigger' | 'ref'> {}

/**
 * 多选下拉菜单的属性
 */
export interface SplitButtonMultipleProps<T extends AvailableEnumType = string>
	extends Omit<Extract<Dropdown.Props<T>, { multiple: true }>, 'trigger' | 'ref'> {}

interface Base extends ParentProps, Omit<BaseProps, 'hotkey'>, RefProps<SplitButtonRef> {
	/**
	 * 按钮的布局
	 */
	layout?: Layout;
}

export type SplitButtonProps<T extends AvailableEnumType = string> =
	| (Base & SplitButtonSingleProps<T>)
	| (Base & SplitButtonMultipleProps<T>);

export const presetProps: Readonly<Partial<SplitButtonProps>> = {
	...presetBaseProps,
	layout: 'horizontal',
} as const;

export function SplitButton<T extends AvailableEnumType = string>(props: SplitButtonProps<T>): JSX.Element {
	props = mergeProps(presetProps, props) as SplitButtonProps<T>;

	let dropdownRef: Dropdown.Ref;
	let arrowRef: Button.Ref;
	let groupRef: ButtonGroup.Ref;

	// 保证弹出菜单的宽度不小于 ButtonGroup
	onMount(() => {
		dropdownRef.menu().root().style.minWidth = `${groupRef.root().getBoundingClientRect().width}px`;
	});

	const click = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!dropdownRef.menu().root().contains(target) && !arrowRef.root().contains(target)) {
			dropdownRef.hide();
		}
	};
	onMount(() => {
		document.addEventListener('click', click);
	});
	onCleanup(() => {
		document.removeEventListener('click', click);
	});

	const [, dropProps] = splitProps(props, ['children', 'ref', 'kind', 'rounded', 'disabled', 'layout']);
	return (
		<Dropdown
			// biome-ignore lint/suspicious/noExplicitAny: 应该是安全的
			{...(dropProps as any)}
			ref={el => {
				dropdownRef = el;
			}}
			trigger="custom"
		>
			<ButtonGroup
				kind={props.kind}
				rounded={props.rounded}
				layout={props.layout}
				disabled={props.disabled}
				ref={el => {
					groupRef = el;
					if (props.ref) {
						props.ref({
							show: () => dropdownRef.show(),
							hide: () => dropdownRef.hide(),
							toggle: () => dropdownRef.toggle(),
							root: () => dropdownRef.root(),
							menu: () => dropdownRef.menu(),
							trigger: () => dropdownRef.trigger(),
							group: () => el,
						});
					}
				}}
			>
				{props.children}
				<Button class={styles.split} square ref={el => (arrowRef = el)} onclick={() => dropdownRef.toggle()}>
					<IconArrowDown />
				</Button>
			</ButtonGroup>
		</Dropdown>
	);
}
