// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { ContextNotFoundError, type Layout, useLocale } from '@cmfx/cdk';
import { Appbar, AppLayout, Button, Dropdown, Menu, useOptions as useXOptions } from '@cmfx/components';
import type { JSX, ParentProps, Signal } from 'solid-js';
import { createContext, createEffect, createSignal, ErrorBoundary, For, onMount, useContext } from 'solid-js';

import { buildItems } from '@admin/app/options';
import { useAdmin } from './admin';
import { errorHandler } from './errors';
import { useOptions } from './options';
import styles from './style.module.css';

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
		throw new ContextNotFoundError('@cmfx/admin.layoutContext');
	}
	return l;
}

export function AdminLayout(props: ParentProps): JSX.Element {
	const [, origin] = useXOptions();
	const config = origin.config;
	const l = useLocale();

	const opt = useOptions();
	const layout = createSignal(config.get<Layout>(layoutKey) ?? opt.layout);
	const float = createSignal(config.get<boolean>(floatKey) ?? opt.float);
	const width = createSignal(config.get<number>(widthKey) ?? opt.width);

	createEffect(() => {
		config.set(layoutKey, layout[0]());
		config.set(floatKey, float[0]());
		config.set(widthKey, width[0]());
	});

	const ctx = {
		layout: () => layout,
		float: () => float,
		width: () => width,
		reset() {
			layout[1](opt.layout);
			float[1](opt.float);
			width[1](opt.width);
		},
	};

	let menuRef: Menu.Ref;
	onMount(() => {
		if (menuRef) {
			menuRef.scrollSelectedIntoView();
		}
	});

	const [items, change] = buildItems(l, opt.menus);

	return (
		<ErrorBoundary fallback={errorHandler}>
			<layoutContext.Provider value={ctx}>
				<AppLayout
					palette="surface"
					asidePalette="secondary"
					toolbarPalette="secondary"
					layout={layout[0]()}
					float={float[0]()}
					width={width[0]()}
					brand={<Appbar.Brand href={opt.routes.private.home} title={opt.title} logo={opt.logo} />}
					actions={
						<>
							<For each={opt.toolbar}>{Item => <Item />}</For>
							<UserMenu />
						</>
					}
					aside={
						<Menu class={styles.menu} ref={el => (menuRef = el)} layout="inline" items={items} onChange={change} />
					}
				>
					{props.children}
				</AppLayout>
			</layoutContext.Provider>
		</ErrorBoundary>
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
