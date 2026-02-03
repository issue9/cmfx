// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, DrawerRef, joinClass, Menu, MenuRef, useLocale } from '@cmfx/components';
import { RouteDefinition } from '@solidjs/router';
import { onCleanup, onMount, ParentProps, Setter } from 'solid-js';

import { floatingWidth } from '@docs/utils';
import { buildMenus, default as overview, routes } from './overview';
import styles from './style.module.css';

export { buildMenus } from './overview';

/**
 * 组件预览的路由定义
 */
export function buildRoute(prefix: string, setDrawer: Setter<DrawerRef | undefined>): RouteDefinition {
	if (!prefix.endsWith('/')) {
		prefix += '/';
	}

	return {
		path: prefix,
		component: (props: ParentProps) => {
			const l = useLocale();

			let menuRef: MenuRef;
			let ref: DrawerRef;

			onMount(() => {
				setDrawer(ref);
				menuRef.scrollSelectedIntoView();
			});
			onCleanup(() => setDrawer(undefined));

			return (
				<Drawer
					visible
					floating={floatingWidth}
					ref={el => {
						ref = el;
					}}
					palette="secondary"
					mainClass={joinClass('surface', styles.main)}
					main={props.children}
				>
					<Menu
						ref={el => {
							menuRef = el;
						}}
						class="min-w-65"
						layout="inline"
						items={buildMenus(l, prefix)}
					/>
				</Drawer>
			);
		},
		children: [
			{ path: '/', component: () => overview(prefix) }, // 指向 overview
			...routes,
		],
	};
}
