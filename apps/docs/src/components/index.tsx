// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Menu, useLocale } from '@cmfx/components';
import { joinClass } from '@cmfx/themes';
import type { RouteDefinition } from '@solidjs/router';
import { onCleanup, onMount, type ParentProps, type Setter } from 'solid-js';

import { floatingWidth } from '@docs/utils';
import { buildMenus, default as overview, routes } from './overview';
import styles from './style.module.css';

export { buildMenus } from './overview';

/**
 * 组件预览的路由定义
 */
export function buildRoute(prefix: string, setDrawer: Setter<Drawer.Ref | undefined>): RouteDefinition {
	if (!prefix.endsWith('/')) {
		prefix += '/';
	}

	return {
		path: prefix,
		component: (props: ParentProps) => {
			const l = useLocale();

			let menuRef: Menu.Ref;
			let ref: Drawer.Ref;

			onMount(() => {
				setDrawer(ref);
				menuRef.scrollSelectedIntoView();
			});
			onCleanup(() => setDrawer(undefined));

			return (
				<Drawer
					initValue
					floating={floatingWidth}
					ref={el => (ref = el)}
					palette="secondary"
					mainClass={joinClass('surface', styles.main)}
					main={props.children}
				>
					<Menu ref={el => (menuRef = el)} class="min-w-65" layout="inline" items={buildMenus(l, prefix)} />
				</Drawer>
			);
		},
		children: [
			{ path: '/', component: () => overview(prefix) }, // 指向 overview
			...routes,
		],
	};
}
