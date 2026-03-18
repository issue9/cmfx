// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX, ParentProps } from 'solid-js';
import { createEffect, createSignal, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import IconMenu from '~icons/material-symbols/menu';
import IconMenuOpen from '~icons/material-symbols/menu-open';

import type { BaseProps, BaseRef, RefProps } from '@components/base';
import { joinClass } from '@components/base';
import { ToggleButton as TB } from '@components/button';
import { Transition } from '@components/transition';
import styles from './style.module.css';

export interface Ref extends BaseRef<HTMLDivElement> {
	/**
	 * 返回侧边栏的元素
	 */
	aside(): HTMLElement;

	/**
	 * 返回组件主区域的元素
	 */
	main(): HTMLElement;

	/**
	 * 显示侧边栏
	 */
	show(): void;

	/**
	 * 隐藏侧边栏
	 */
	hide(): void;

	/**
	 * 切换侧边栏的状态
	 */
	toggle(): void;

	/**
	 * 获取侧边栏的显示状态
	 *
	 * @returns true 表示显示状态；
	 */
	visible(): boolean;
}

export type ToggleButtonProps = Omit<TB.RootProps, 'onToggle' | 'value' | 'on' | 'off'> & {
	/**
	 * 侧边栏在显示状态下的按钮图标
	 *
	 * @reactive
	 * @defaultValue <IconMenuOpen />
	 */
	on?: JSX.Element;

	/**
	 * 侧边栏在隐藏状态下的按钮图标
	 *
	 * @reactive
	 * @defaultValue <IconMenu />
	 */
	off?: JSX.Element;

	drawer?: Ref;
};

/**
 * 生成一个用于显示和隐藏侧边栏的按钮组件
 */
export function ToggleButton(p: ToggleButtonProps): JSX.Element {
	const [hidden, setHidden] = createSignal(!!p.drawer); // 按钮的显示状态

	const ob = new ResizeObserver(e => {
		setHidden(getComputedStyle(e[0].target).getPropertyValue('position') !== 'absolute');
	});
	onCleanup(() => ob.disconnect());

	createEffect(() => {
		const ref = p.drawer;

		if (ref) {
			ob.observe(ref.aside());
		} else {
			ob.disconnect();
		}
	});

	p = mergeProps({ on: <IconMenuOpen />, off: <IconMenu /> }, p);
	const [_, btnProps] = splitProps(p, ['class', 'palette', 'drawer']);

	return (
		<TB.Root
			{...(btnProps as TB.RootProps)}
			value={p.drawer?.visible()}
			class={joinClass(p.palette, hidden() ? 'hidden' : undefined, p.class)}
			onToggle={async (): Promise<boolean | undefined> => {
				if (!p.drawer) {
					return;
				}

				p.drawer.toggle();
				return p.drawer.visible();
			}}
		/>
	);
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 侧边栏的初始状态
	 */
	initValue?: boolean;

	/**
	 * 侧边栏是以浮动的形式出现
	 *
	 * @remarks
	 * 如果是 true 或是 false 表示始终保持一种状态，
	 * 其它的值表示在整个页面小于此值时才变为浮动状态。
	 * 除 boolean 以外的取值与窗口查询的值相对应，比如 2xl 对应的是 `@2xl`。
	 *
	 * @reactive
	 * @defaultValue false
	 */
	floating?: boolean | '3xs' | 'xs' | 'sm' | 'md' | 'lg' | '2xl' | '4xl' | '6xl' | '8xl';

	/**
	 * 位置，默认值为 start
	 *
	 * @reactive
	 * @defaultValue 'start'
	 */
	pos?: 'start' | 'end';

	/**
	 * 主元素区的内容
	 */
	main: JSX.Element;

	/**
	 * 内容区的样式
	 *
	 * @reactive
	 */
	mainClass?: string;

	/**
	 * 侧边栏的样式
	 *
	 * @reactive
	 */
	asideClass?: string;
}

const presetProps: Readonly<Partial<Props>> = {
	pos: 'start',
	floating: false,
};

export function Root(props: Props) {
	props = mergeProps(presetProps, props);
	let rootRef: HTMLDivElement;
	let asideRef: HTMLElement;

	const [visible, setVisible] = createSignal(!!props.initValue);

	onMount(() => {
		const handleClick = (e: MouseEvent) => {
			if (props.floating === undefined || !visible()) {
				return;
			}

			const node = e.target as HTMLElement;
			if (rootRef.contains(node) && !asideRef.contains(node)) {
				setVisible(false);
			}
		};

		document.addEventListener('click', handleClick);
		onCleanup(() => {
			document.removeEventListener('click', handleClick);
		});
	});

	return (
		<div
			class={joinClass(props.palette, props.pos === 'end' ? styles.end : '', styles.drawer, props.class)}
			style={props.style}
			ref={el => {
				rootRef = el;
			}}
		>
			<aside
				ref={el => (asideRef = el)}
				classList={{
					[props.asideClass ?? '']: !!props.asideClass,
					'cmfx-drawer-floating-aside': props.floating === true,
					'@max-3xs/drawer:cmfx-drawer-floating-aside': props.floating === '3xs',
					'@max-xs/drawer:cmfx-drawer-floating-aside': props.floating === 'xs',
					'@max-sm/drawer:cmfx-drawer-floating-aside': props.floating === 'sm',
					'@max-md/drawer:cmfx-drawer-floating-aside': props.floating === 'md',
					'@max-lg/drawer:cmfx-drawer-floating-aside': props.floating === 'lg',
					'@max-2xl/drawer:cmfx-drawer-floating-aside': props.floating === '2xl',
					'@max-4xl/drawer:cmfx-drawer-floating-aside': props.floating === '4xl',
					'@max-6xl/drawer:cmfx-drawer-floating-aside': props.floating === '6xl',
					'@max-8xl/drawer:cmfx-drawer-floating-aside': props.floating === '8xl',

					'cmfx-drawer-hidden-aside': props.floating === true && !visible(),
					'@max-3xs/drawer:cmfx-drawer-hidden-aside': props.floating === '3xs' && !visible(),
					'@max-xs/drawer:cmfx-drawer-hidden-aside': props.floating === 'xs' && !visible(),
					'@max-sm/drawer:cmfx-drawer-hidden-aside': props.floating === 'sm' && !visible(),
					'@max-md/drawer:cmfx-drawer-hidden-aside': props.floating === 'md' && !visible(),
					'@max-lg/drawer:cmfx-drawer-hidden-aside': props.floating === 'lg' && !visible(),
					'@max-2xl/drawer:cmfx-drawer-hidden-aside': props.floating === '2xl' && !visible(),
					'@max-4xl/drawer:cmfx-drawer-hidden-aside': props.floating === '4xl' && !visible(),
					'@max-6xl/drawer:cmfx-drawer-hidden-aside': props.floating === '6xl' && !visible(),
					'@max-8xl/drawer:cmfx-drawer-hidden-aside': props.floating === '8xl' && !visible(),
				}}
			>
				{props.children}
			</aside>
			<main
				class={props.mainClass}
				ref={el => {
					if (props.ref) {
						props.ref({
							root: () => rootRef,
							main: () => el,
							aside: () => asideRef,
							show: () => setVisible(true),
							hide: () => setVisible(false),
							toggle: () => setVisible(!visible()),
							visible: () => visible(),
						});
					}
				}}
			>
				<Transition>{props.main}</Transition>
			</main>
		</div>
	);
}
