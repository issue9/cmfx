// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';

import { AvailableEnumType, Layout, RefProps } from '@components/base';
import { Dropdown, DropdownProps, DropdownRef } from '@components/menu/dropdown';
import { Button, Ref as ButtonRef } from './button';
import { ButtonGroup, Ref as ButtonGroupRef } from './group';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export interface Ref extends DropdownRef {
	/**
	 * 返回按按钮组的组件实例
	 */
	group(): ButtonGroupRef;
}

// BUG: 目前在 vite-plugin-api 中无法处理 type = Omit<...> 的内容
interface SProps<T extends AvailableEnumType = string>
	extends Omit<Extract<DropdownProps<T>, { multiple?: false }>, 'trigger' | 'ref'> {}

interface MProps<T extends AvailableEnumType = string>
	extends Omit<Extract<DropdownProps<T>, { multiple: true }>, 'trigger' | 'ref'> {}

interface Base extends ParentProps, Omit<BaseProps, 'hotkey'>, RefProps<Ref> {
	/**
	 * 按钮的布局
	 */
	layout?: Layout;
}

export type Props<T extends AvailableEnumType = string> = (Base & SProps<T>) | (Base & MProps<T>);

export const presetProps: Readonly<Partial<Props>> = {
	...presetBaseProps,
	layout: 'horizontal',
} as const;

export default function Split<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
	props = mergeProps(presetProps, props) as Props<T>;

	let dropdownRef: DropdownRef;
	let arrowRef: ButtonRef;
	let groupRef: ButtonGroupRef;

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
							group: () => el,
						});
					}
				}}
			>
				{props.children}
				<Button
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
				</Button>
			</ButtonGroup>
		</Dropdown>
	);
}
