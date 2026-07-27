// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Breakpoint, joinClass, nextPalette, type Palette, type ThemeProps } from '@cmfx/themes';
import type { JSX, ParentProps } from 'solid-js';
import { createMemo, createSignal, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';

import { Appbar } from '@components/appbar';
import type { BaseRef, Layout, RefProps } from '@components/base';
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
	 * 内容区域的色盘
	 *
	 * @defaultValue props.palette ? nextPalette(props.palette, 1): 'surface'
	 * @reactive
	 */
	mainPalette?: Palette;
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
	props = mergeProps(
		{
			layout: 'horizontal',
			mainPalette: props.palette ? nextPalette(props.palette, 1) : 'surface',
		} as AppLayoutProps,
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
			asideBar.root().style.height = `${entries[0]!.borderBoxSize[0].blockSize.toString()}px`;
		});
		ro.observe(toolbar.root());
		onCleanup(() => ro.disconnect());
	});

	const style = createMemo(() => {
		const w = props.width;
		if (!w || w === window.screen.width) {
			return;
		}
		return {
			width: `${w}px`,
			margin: '0 auto',
		} as JSX.CSSProperties;
	});

	const cls = createMemo(() => {
		const f = props.float;
		return joinClass(props.mainPalette, styles.layout, styles.horizontal, f ? styles.float : undefined);
	});

	return (
		<Drawer
			class={cls()}
			floating={props.floatingMinWidth}
			ref={el => {
				setDrawerRef(el);
				props.ref?.({ root: el.root });
			}}
			style={style()}
			asideClass={joinClass(props.palette, styles.aside)}
			mainClass={joinClass(props.float ? props.mainPalette : props.palette, styles.main)}
			main={
				<div class="contents">
					<Appbar ref={el => (toolbar = el)} class={styles.toolbar} palette={props.palette} actions={props.actions}>
						<Drawer.ToggleButton drawer={drawerRef()} />
						{props.toolbar}
					</Appbar>
					<main class={joinClass(props.mainPalette, styles.content)}>{props.children}</main>
				</div>
			}
		>
			<Appbar ref={el => (asideBar = el)} brand={props.brand} class={styles.toolbar} />
			{props.aside}
			{props.extra}
		</Drawer>
	);
}

function Vertical(props: AppLayoutProps): JSX.Element {
	const [drawerRef, setDrawerRef] = createSignal<Drawer.Ref>();

	const style = createMemo(() => {
		const w = props.width;
		if (!w || w === window.screen.width) {
			return;
		}
		return {
			width: `${w}px`,
			margin: '0 auto',
		} as JSX.CSSProperties;
	});

	const cls = createMemo(() => {
		const f = props.float;
		return joinClass(
			f ? props.mainPalette : props.palette,
			styles.layout,
			styles.vertical,
			props.class,
			f ? styles.float : undefined,
		);
	});

	return (
		<div class={cls()} style={style()} ref={el => props.ref?.({ root: () => el })}>
			<Appbar brand={props.brand} class={styles.toolbar} palette={props.palette} actions={props.actions}>
				<Drawer.ToggleButton drawer={drawerRef()} />
			</Appbar>

			<main class={styles.main}>
				<Drawer
					floating={props.floatingMinWidth}
					ref={setDrawerRef}
					asideClass={joinClass(props.palette, styles.aside)}
					mainClass={joinClass(props.mainPalette, styles.content)}
					main={props.children}
				>
					{props.aside}
					{props.extra}
				</Drawer>
			</main>
		</div>
	);
}
