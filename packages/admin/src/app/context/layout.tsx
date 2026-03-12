// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Layout, Palette } from '@cmfx/components';
import {
	Appbar,
	Button,
	ContextNotFoundError,
	Drawer,
	Dropdown,
	joinClass,
	Menu,
	useOptions as useComponentOptions,
	useLocale,
} from '@cmfx/components';
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

/**
 * 侧边栏和顶部工具栏的背景色
 */
const bgPalette: Palette = 'tertiary';

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

	let menuRef: Menu.RootRef;
	const [drawerRef, setDrawerRef] = createSignal<Drawer.RootRef>();

	onMount(() => {
		if (menuRef) {
			menuRef.scrollSelectedIntoView();
		}
	});

	// 保证两个顶部工具栏高度相同
	let asideBar: Appbar.RootRef;
	let toolbar: Appbar.RootRef;
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
		return joinClass('surface', styles.app, styles.horizontal, f ? styles.float : undefined);
	});

	return (
		<Drawer.Root
			class={cls()}
			floating={opt.floatingMinWidth}
			ref={setDrawerRef}
			style={style()}
			asideClass={joinClass(bgPalette, styles.aside)}
			mainClass={joinClass(layout.float()[0]() ? 'surface' : bgPalette, styles.main)}
			main={
				<ErrorBoundary fallback={errorHandler}>
					<div class="contents">
						<Appbar.Root
							ref={el => {
								toolbar = el;
							}}
							class={styles.toolbar}
							palette={bgPalette}
							actions={
								<>
									<For each={opt.toolbar}>{Item => <Item />}</For>
									<UserMenu />
								</>
							}
						>
							<Drawer.ToggleButton square drawer={drawerRef()} />
						</Appbar.Root>
						<main class={joinClass('surface', styles.content)}>{props.children}</main>
					</div>
				</ErrorBoundary>
			}
		>
			<Appbar.Root
				ref={el => {
					asideBar = el;
				}}
				logo={opt.logo}
				title={opt.title}
				class={styles.toolbar}
			/>
			<Menu.Root
				class={styles.menu}
				ref={el => {
					menuRef = el;
				}}
				layout="inline"
				items={buildItems(l, opt.menus)}
			/>
		</Drawer.Root>
	);
}

function Vertical(props: ParentProps): JSX.Element {
	const opt = useOptions();
	const l = useLocale();
	const layout = useLayout();

	let menuRef: Menu.RootRef;
	const [drawerRef, setDrawerRef] = createSignal<Drawer.RootRef>();

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
		return joinClass(f ? 'surface' : bgPalette, styles.app, styles.vertical, f ? styles.float : undefined);
	});

	return (
		<div class={cls()} style={style()}>
			<Appbar.Root
				logo={opt.logo}
				title={opt.title}
				class={styles.toolbar}
				palette={bgPalette}
				actions={
					<>
						<For each={opt.toolbar}>{Item => <Item />}</For>
						<UserMenu />
					</>
				}
			>
				<Drawer.ToggleButton square drawer={drawerRef()} />
			</Appbar.Root>

			<main class={styles.main}>
				<Drawer.Root
					floating={opt.floatingMinWidth}
					ref={setDrawerRef}
					asideClass={joinClass(bgPalette, styles.aside)}
					mainClass={joinClass('surface', styles.content)}
					main={<ErrorBoundary fallback={errorHandler}>{props.children}</ErrorBoundary>}
				>
					<Menu.Root
						ref={el => {
							menuRef = el;
						}}
						layout="inline"
						items={buildItems(l, opt.menus)}
					/>
				</Drawer.Root>
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

	return (
		<Dropdown.Root trigger="hover" items={buildItems(l, opt.userMenus)}>
			<Button.Root kind="flat" class="ps-1">
				<img alt="avatar" class={styles.avatar} src={usr.info()?.avatar} />
				{usr.info()?.name}
			</Button.Root>
		</Dropdown.Root>
	);
}
