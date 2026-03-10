// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';

import { AvailableEnumType, Layout, RefProps } from '@components/base';
import { Button } from '@components/button/button';
import styles from '@components/button/common/style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from '@components/button/common/types';
import { ButtonGroup } from '@components/button/group';
import { Dropdown } from '@components/menu';

export interface Ref extends Dropdown.RootRef {
	/**
	 * 返回按按钮组的组件实例
	 */
	group(): ButtonGroup.RootRef;
}

/**
 * 单选下拉菜单的属性
 */
export interface SingleProps<T extends AvailableEnumType = string>
	extends Omit<Extract<Dropdown.RootProps<T>, { multiple?: false }>, 'trigger' | 'ref'> {}

/**
 * 多选下拉菜单的属性
 */
export interface MultipleProps<T extends AvailableEnumType = string>
	extends Omit<Extract<Dropdown.RootProps<T>, { multiple: true }>, 'trigger' | 'ref'> {}

interface Base extends ParentProps, Omit<BaseProps, 'hotkey'>, RefProps<Ref> {
	/**
	 * 按钮的布局
	 */
	layout?: Layout;
}

export type Props<T extends AvailableEnumType = string> = (Base & SingleProps<T>) | (Base & MultipleProps<T>);

export const presetProps: Readonly<Partial<Props>> = {
	...presetBaseProps,
	layout: 'horizontal',
} as const;

export function Root<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
	props = mergeProps(presetProps, props) as Props<T>;

	let dropdownRef: Dropdown.RootRef;
	let arrowRef: Button.RootRef;
	let groupRef: ButtonGroup.RootRef;

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
		<Dropdown.Root
			// biome-ignore lint/suspicious/noExplicitAny: 应该是安全的
			{...(dropProps as any)}
			ref={el => {
				dropdownRef = el;
			}}
			trigger="custom"
		>
			<ButtonGroup.Root
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
							group: () => el,
						});
					}
				}}
			>
				{props.children}
				<Button.Root
					class={styles.split}
					square
					ref={el => {
						arrowRef = el;
					}}
					onclick={() => {
						dropdownRef.toggle();
					}}
				>
					<IconArrowDown />
				</Button.Root>
			</ButtonGroup.Root>
		</Dropdown.Root>
	);
}
