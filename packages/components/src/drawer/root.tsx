// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type BaseRef, type Breakpoint, joinClass, type RefProps, type ThemeProps } from '@cmfx/cdk';
import type { JSX, ParentProps } from 'solid-js';
import { createSignal, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import IconMenu from '~icons/material-symbols/menu';
import IconMenuOpen from '~icons/material-symbols/menu-open';

import { ToggleButton as TB } from '@components/button';
import { Transition } from '@components/transition';
import styles from './style.module.css';

export interface DrawerRef extends BaseRef<HTMLDivElement> {
	/**
	 * 返回侧边栏的元素
	 */
	aside(): HTMLElement;

	/**
	 * 返回组件主区域的元素
	 */
	main(): HTMLElement;

	/**
	 * 侧边栏是否处于浮动状态
	 *
	 * @remarks
	 * 只有此值为 true，对侧边栏的显示隐藏等操作才会有效果。
	 */
	isFloating(): boolean;

	/**
	 * 显示侧边栏
	 *
	 * @remarks
	 * 需要 {@link isFloating} 为 true 时才会有效果。
	 */
	show(): void;

	/**
	 * 隐藏侧边栏
	 *
	 * @remarks
	 * 需要 {@link isFloating} 为 true 时才会有效果。
	 */
	hide(): void;

	/**
	 * 切换侧边栏的状态
	 *
	 * @remarks
	 * 需要 {@link isFloating} 为 true 时才会有效果。
	 */
	toggle(): void;

	/**
	 * 获取侧边栏的显示状态
	 *
	 * @remarks
	 * 需要 {@link isFloating} 为 true 时才会有效果。
	 */
	visible(): boolean;
}

export interface DrawerProps extends ThemeProps, ParentProps, RefProps<DrawerRef> {
	/**
	 * 侧边栏的初始状态
	 */
	readonly initValue?: boolean;

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
	floating?: boolean | Breakpoint;

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

const presetProps: Readonly<Partial<DrawerProps>> = {
	pos: 'start',
	floating: false,
} as const;

export function Drawer(props: DrawerProps): JSX.Element {
	props = mergeProps(presetProps, props);
	let rootRef: HTMLDivElement;
	let asideRef: HTMLElement;
	let mainRef: HTMLElement;

	// 侧边栏是否为浮动状态，只有浮动状态下，才会有显示和隐藏功能
	const [isFloating, setIsFloating] = createSignal(false);
	const mainRO = new ResizeObserver(() => {
		setIsFloating(getComputedStyle(asideRef).getPropertyValue('position') === 'absolute');
	});
	onCleanup(() => mainRO.disconnect());
	onMount(() => {
		mainRO.observe(mainRef); // 监听 mainRef 的变化比监视 aside 更合理
		setIsFloating(getComputedStyle(asideRef).getPropertyValue('position') === 'absolute');
	});

	// 侧边栏状态
	const [visible, setVisible] = createSignal(!!props.initValue);
	const setV = (v: boolean) => {
		if (isFloating()) {
			setVisible(v);
		}
	};

	// 注册鼠标事件
	onMount(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (props.floating && e.key === 'Escape') {
				setV(false);
			}
		};

		document.addEventListener('keydown', handleEsc);
		onCleanup(() => document.removeEventListener('keydown', handleEsc));
	});

	return (
		<div
			class={joinClass(props.palette, props.pos === 'end' ? styles.end : '', styles.drawer, props.class)}
			style={props.style}
			ref={el => (rootRef = el)}
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
				onclick={() => setV(false)}
				ref={el => {
					mainRef = el;
					props.ref?.({
						root: () => rootRef,
						main: () => el,
						aside: () => asideRef,
						isFloating: () => isFloating(),
						show: () => setV(true),
						hide: () => setV(false),
						toggle: () => setV(!visible()),
						visible: () => visible(),
					});
				}}
			>
				<Transition>{props.main}</Transition>
			</main>
		</div>
	);
}

export type DrawerToggleButtonProps = Omit<TB.Props, 'onToggle' | 'value' | 'on' | 'off'> & {
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

	/**
	 * 根据此对象处理按钮状态
	 *
	 * @reactive
	 */
	drawer?: DrawerRef;
};

/**
 * 生成一个用于显示和隐藏侧边栏的按钮组件
 */
export function ToggleButton(props: DrawerToggleButtonProps): JSX.Element {
	props = mergeProps({ on: <IconMenuOpen />, off: <IconMenu /> }, props);

	const [_, btnProps] = splitProps(props, ['class', 'palette', 'drawer']);

	return (
		<TB
			{...(btnProps as TB.Props)}
			value={props.drawer?.visible()}
			class={joinClass(props.palette, !props.drawer?.isFloating() ? 'hidden' : '', props.class)}
			onToggle={async (): Promise<boolean | undefined> => {
				if (!props.drawer) {
					return;
				}

				props.drawer.toggle();
				return props.drawer.visible();
			}}
		/>
	);
}
