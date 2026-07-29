// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Breakpoint, joinClass, nextPalette, type Palette, style2String, type ThemeProps } from '@cmfx/themes';
import type { JSX, ParentProps } from 'solid-js';
import { createMemo, createSignal, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';

import { Appbar } from '@components/appbar';
import type { BaseRef, Layout, RefProps } from '@components/base';
import { useOptions } from '@components/context/options';
import { Drawer } from '@components/drawer';
import styles from './style.module.css';

export interface AppLayoutRef extends BaseRef<HTMLDivElement> {}

export interface AppLayoutProps extends ParentProps, ThemeProps, RefProps<AppLayoutRef> {
	/**
	 * 布局
	 *
	 * @reactive
	 * @defaultValue 'horizontal'
	 */
	layout?: Layout;

	/**
	 * 宽度
	 *
	 * @reactive
	 */
	width?: number;

	/**
	 * 浮动
	 *
	 * @reactive
	 */
	float?: boolean;

	/**
	 * 侧边栏浮动最小宽度
	 *
	 * @reactive
	 */
	floatingMinWidth?: Breakpoint;

	/**
	 * 产品名称区域内容
	 *
	 * @reactive
	 * @defaultValue 根据 options 中的 logo 和 title 生成
	 */
	brand?: JSX.Element;

	/**
	 * 顶部工具栏区域
	 *
	 * @reactive
	 */
	toolbar?: JSX.Element;

	/**
	 * 顶部右侧的操作按钮区域
	 *
	 * @reactive
	 */
	actions?: JSX.Element;

	/**
	 * 侧边栏区域
	 *
	 * @reactive
	 */
	aside?: JSX.Element;

	/**
	 * 侧边栏底部区域
	 *
	 * @reactive
	 */
	extra?: JSX.Element;

	/**
	 * 侧边栏的色盘
	 *
	 * @defaultValue props.palette ? nextPalette(props.palette, 2): 'tertiary'
	 * @reactive
	 */
	asidePalette?: Palette;

	/**
	 * 工具栏的色盘
	 *
	 * @defaultValue props.palette ? nextPalette(props.palette, 1): 'secondary'
	 * @reactive
	 */
	toolbarPalette?: Palette;
}

/**
 * 应用布局组件
 *
 * @remarks
 * 此组件将应用分为以下几个区域：
 *  |----------------------------|
 *  | brand | toolbar  | actions |
 *  |----------------------------|
 *  | aside |                    |
 *  |-------| main               |
 *  | extra |                    |
 *  |----------------------------|
 */
export function AppLayout(props: AppLayoutProps): JSX.Element {
	const [, opt] = useOptions();
	props = mergeProps(
		{
			layout: 'horizontal',
			asidePalette: props.palette ? nextPalette(props.palette, 2) : 'tertiary',
			toolbarPalette: props.palette ? nextPalette(props.palette, 1) : 'secondary',
			brand: <Appbar.Brand logo={opt.logo} title={opt.title} />,
		} satisfies AppLayoutProps,
		props,
	);

	return (
		<Switch fallback={<Horizontal {...props} />}>
			<Match when={props.layout === 'vertical'}>
				<Vertical {...props} />
			</Match>
		</Switch>
	);
}

function Horizontal(props: AppLayoutProps): JSX.Element {
	const [drawerRef, setDrawerRef] = createSignal<Drawer.Ref>();

	// 保证两个顶部工具栏高度相同
	let asideBar: Appbar.Ref;
	let toolbar: Appbar.Ref;
	onMount(() => {
		const ro = new ResizeObserver(entries => {
			// 设置 height，可能因为 aside 的内部元素太小而导致元素的高度无法达到。只能设置 min-height 值达到效果。
			asideBar.root().style.setProperty('min-height', `${entries[0]!.borderBoxSize[0].blockSize.toString()}px`);
		});
		ro.observe(toolbar.root());
		onCleanup(() => ro.disconnect());
	});

	const cls = createMemo(() => {
		const f = props.float;
		return joinClass(props.palette, styles.layout, props.class, styles.horizontal, f ? styles.float : undefined);
	});

	return (
		<Drawer
			class={cls()}
			floating={props.floatingMinWidth}
			ref={el => {
				setDrawerRef(el);
				props.ref?.({ root: el.root });
			}}
			style={calcStyle(props.width, props.style)}
			asideClass={joinClass(props.asidePalette, styles.drawer)}
			mainClass={joinClass(props.palette, styles.main)}
			main={
				<div class="contents">
					<Appbar
						ref={el => (toolbar = el)}
						class={styles.toolbar}
						palette={props.toolbarPalette}
						actions={props.actions}
					>
						<Drawer.ToggleButton drawer={drawerRef()} />
						{props.toolbar}
					</Appbar>
					<main class={joinClass(props.palette, styles.content)}>{props.children}</main>
				</div>
			}
		>
			<Appbar ref={el => (asideBar = el)} brand={props.brand} class={styles.toolbar} />
			<div class={styles.aside}>{props.aside}</div>
			<div class={styles.extra}>{props.extra}</div>
		</Drawer>
	);
}

function Vertical(props: AppLayoutProps): JSX.Element {
	const [drawerRef, setDrawerRef] = createSignal<Drawer.Ref>();

	const cls = createMemo(() => {
		const f = props.float;
		return joinClass(props.palette, styles.layout, styles.vertical, props.class, f ? styles.float : undefined);
	});

	return (
		<div class={cls()} style={calcStyle(props.width, props.style)} ref={el => props.ref?.({ root: () => el })}>
			<Appbar brand={props.brand} class={styles.toolbar} palette={props.toolbarPalette} actions={props.actions}>
				<Drawer.ToggleButton drawer={drawerRef()} />
			</Appbar>

			<main class={styles.main}>
				<Drawer
					floating={props.floatingMinWidth}
					ref={setDrawerRef}
					asideClass={joinClass(props.asidePalette, styles.drawer)}
					mainClass={joinClass(props.palette, styles.content)}
					main={props.children}
				>
					<div class={styles.aside}>{props.aside}</div>
					<div class={styles.extra}>{props.extra}</div>
				</Drawer>
			</main>
		</div>
	);
}

function calcStyle(w?: number, style?: JSX.CSSProperties | string) {
	if (!w || w === window.screen.width) {
		return style;
	}

	return style2String(
		{
			width: `${w}px`,
			margin: '0 auto',
		} satisfies JSX.CSSProperties,
		style,
	);
}
