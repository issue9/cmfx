// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, joinClass, Menu, useLocale } from '@cmfx/components';
import type { RouteDefinition } from '@solidjs/router';
import { onCleanup, onMount, type ParentProps, type Setter } from 'solid-js';

import { floatingWidth } from '@docs/utils';
import { buildMenus, default as overview, routes } from './overview';
import styles from './style.module.css';

export { buildMenus } from './overview';

/**
 * 组件预览的路由定义
 */
export function buildRoute(prefix: string, setDrawer: Setter<Drawer.RootRef | undefined>): RouteDefinition {
	if (!prefix.endsWith('/')) {
		prefix += '/';
	}

	return {
		path: prefix,
		component: (props: ParentProps) => {
			const l = useLocale();

			let menuRef: Menu.RootRef;
			let ref: Drawer.RootRef;

			onMount(() => {
				setDrawer(ref);
				menuRef.scrollSelectedIntoView();
			});
			onCleanup(() => setDrawer(undefined));

			return (
				<Drawer.Root
					initValue
					floating={floatingWidth}
					ref={el => (ref = el)}
					palette="secondary"
					mainClass={joinClass('surface', styles.main)}
					main={props.children}
				>
					<Menu.Root ref={el => (menuRef = el)} class="min-w-65" layout="inline" items={buildMenus(l, prefix)} />
				</Drawer.Root>
			);
		},
		children: [
			{ path: '/', component: () => overview(prefix) }, // 指向 overview
			...routes,
		],
	};
}
