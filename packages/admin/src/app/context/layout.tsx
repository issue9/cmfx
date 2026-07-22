// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Layout } from '@cmfx/components';
import { Appbar, Button, Drawer, Dropdown, Menu, useOptions as useComponentOptions, useLocale } from '@cmfx/components';
import { ContextNotFoundError } from '@cmfx/core';
import { joinClass, type Palette } from '@cmfx/themes';
import type { JSX, ParentProps, Signal } from 'solid-js';
import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	ErrorBoundary,
	For,
	Match,
	onCleanup,
	onMount,
	Switch,
	useContext,
} from 'solid-js';

import { buildItems } from '@admin/app/options';
import { useAdmin } from './admin';
import { errorHandler } from './errors';
import { useOptions } from './options';
import styles from './style.module.css';

const sidePalette: Palette = 'secondary'; // 侧边栏和顶部工具栏的背景色
const bgPalette: Palette = 'surface'; // 背景板的色盘

/**
 * 在 Storage 中保存的配置项名称
 */
const layoutKey = 'layout';
const floatKey = 'float';
const widthKey = 'width';

interface LayoutContext {
	/**
	 * 提供修改布局方向的接口
	 */
	layout(): Signal<Layout>;

	/**
	 * 提供修改是否为浮动状态的接口
	 */
	float(): Signal<boolean>;

	/**
	 * 提供修改页面最大宽度的接口
	 */
	width(): Signal<number>;

	reset(): void;
}

const layoutContext = createContext<LayoutContext>();

/**
 * 提供修改面板布局的接口
 */
export function useLayout(): LayoutContext {
	const l = useContext(layoutContext);
	if (!l) {
		throw new ContextNotFoundError('layoutContext');
	}
	return l;
}

export function AppLayout(props: ParentProps): JSX.Element {
	const [, origin] = useComponentOptions();
	const config = origin.config;

	const opt = useOptions();
	const layout = createSignal(config.get<Layout>(layoutKey) ?? opt.layout);
	const float = createSignal(config.get<boolean>(floatKey) ?? opt.float);
	const width = createSignal(config.get<number>(widthKey) ?? opt.width);

	createEffect(() => {
		// 监视 layout 变化，并写入配置对象。
		config.set(layoutKey, layout[0]());
		config.set(floatKey, float[0]());
		config.set(widthKey, width[0]());
	});

	const ctx = {
		layout() {
			return layout;
		},
		float() {
			return float;
		},
		width() {
			return width;
		},
		reset() {
			layout[1](opt.layout);
			float[1](opt.float);
			width[1](opt.width);
		},
	};

	return (
		<layoutContext.Provider value={ctx}>
			<Switch fallback={<Horizontal {...props} />}>
				<Match when={layout[0]() === 'vertical'}>
					<Vertical {...props} />
				</Match>
			</Switch>
		</layoutContext.Provider>
	);
}

function Horizontal(props: ParentProps): JSX.Element {
	const opt = useOptions();
	const l = useLocale();
	const layout = useLayout();

	let menuRef: Menu.Ref;
	const [drawerRef, setDrawerRef] = createSignal<Drawer.Ref>();

	onMount(() => {
		if (menuRef) {
			menuRef.scrollSelectedIntoView();
		}
	});

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
		const w = layout.width();
		if (!w[0]() || w[0]() === window.screen.width) {
			return;
		}
		return {
			width: `${w[0]()}px`,
			margin: '0 auto',
		} as JSX.CSSProperties;
	});

	const cls = createMemo(() => {
		const f = layout.float()[0]();
		return joinClass(bgPalette, styles.app, styles.horizontal, f ? styles.float : undefined);
	});

	const [items, change] = buildItems(l, opt.menus);

	return (
		<Drawer
			class={cls()}
			floating={opt.floatingMinWidth}
			ref={setDrawerRef}
			style={style()}
			asideClass={joinClass(sidePalette, styles.aside)}
			mainClass={joinClass(layout.float()[0]() ? bgPalette : sidePalette, styles.main)}
			main={
				<ErrorBoundary fallback={errorHandler}>
					<div class="contents">
						<Appbar
							ref={el => (toolbar = el)}
							class={styles.toolbar}
							palette={sidePalette}
							actions={
								<>
									<For each={opt.toolbar}>{Item => <Item />}</For>
									<UserMenu />
								</>
							}
						>
							<Drawer.ToggleButton drawer={drawerRef()} />
						</Appbar>
						<main class={joinClass(bgPalette, styles.content)}>{props.children}</main>
					</div>
				</ErrorBoundary>
			}
		>
			<Appbar
				ref={el => (asideBar = el)}
				logo={<Appbar.Image src={opt.logo} alt={opt.title} />}
				title={opt.title}
				href={opt.routes.private.home}
				class={styles.toolbar}
			/>
			<Menu class={styles.menu} ref={el => (menuRef = el)} layout="inline" items={items} onChange={change} />
		</Drawer>
	);
}

function Vertical(props: ParentProps): JSX.Element {
	const opt = useOptions();
	const l = useLocale();
	const layout = useLayout();

	let menuRef: Menu.Ref;
	const [drawerRef, setDrawerRef] = createSignal<Drawer.Ref>();

	onMount(() => {
		if (menuRef) {
			menuRef.scrollSelectedIntoView();
		}
	});

	const style = createMemo(() => {
		const w = layout.width();
		if (!w[0]() || w[0]() === window.screen.width) {
			return;
		}
		return {
			width: `${w[0]()}px`,
			margin: '0 auto',
		} as JSX.CSSProperties;
	});

	const cls = createMemo(() => {
		const f = layout.float()[0]();
		return joinClass(f ? bgPalette : sidePalette, styles.app, styles.vertical, f ? styles.float : undefined);
	});

	const [items, change] = buildItems(l, opt.menus);

	return (
		<div class={cls()} style={style()}>
			<Appbar
				logo={<Appbar.Image src={opt.logo} alt={opt.title} />}
				title={opt.title}
				class={styles.toolbar}
				palette={sidePalette}
				href={opt.routes.private.home}
				actions={
					<>
						<For each={opt.toolbar}>{Item => <Item />}</For>
						<UserMenu />
					</>
				}
			>
				<Drawer.ToggleButton drawer={drawerRef()} />
			</Appbar>

			<main class={styles.main}>
				<Drawer
					floating={opt.floatingMinWidth}
					ref={setDrawerRef}
					asideClass={joinClass(sidePalette, styles.aside)}
					mainClass={joinClass(bgPalette, styles.content)}
					main={<ErrorBoundary fallback={errorHandler}>{props.children}</ErrorBoundary>}
				>
					<Menu ref={el => (menuRef = el)} layout="inline" items={items} onChange={change} />
				</Drawer>
			</main>
		</div>
	);
}

/**
 * 用户名及其下拉菜单
 */
function UserMenu(): JSX.Element {
	const opt = useOptions();
	const usr = useAdmin();
	const l = useLocale();

	const [items, change] = buildItems(l, opt.userMenus);

	return (
		<Dropdown trigger="hover" items={items} onChange={change}>
			<Button kind="flat" class="ps-1">
				<img alt="avatar" class={styles.avatar} src={usr.info()?.avatar} />
				{usr.info()?.name}
			</Button>
		</Dropdown>
	);
}
