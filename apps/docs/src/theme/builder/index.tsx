// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, useLocale, useOptions } from '@cmfx/components';
import { joinClass, useTheme } from '@cmfx/themes';
import { createEffect, type JSX, onCleanup, onMount, type Setter } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';

import { floatingWidth } from '@docs/utils';
import { Demo } from './demo';
import { params } from './params';
import styles from './style.module.css';
import { convertSchemeVar2Color } from './utils';

export function Builder(props: { setDrawer: Setter<Drawer.Ref | undefined> }): JSX.Element {
	let drawerRef: Drawer.Ref;
	onMount(() => {
		props.setDrawer(drawerRef);
	});
	onCleanup(() => props.setDrawer(undefined));

	const l = useLocale();
	const [act] = useOptions();

	const t = useTheme();
	const scheme = createStore(convertSchemeVar2Color(unwrap(t.scheme)));

	createEffect(() => {
		act.setTitle(l.t('_d.theme.builder'));
	});

	return (
		<Drawer
			class={styles.builder}
			floating={floatingWidth}
			ref={el => {
				drawerRef = el;
				el.main().style.overflow = 'unset';
			}}
			palette="secondary"
			mainClass={joinClass('surface')}
			main={<Demo s={scheme} />}
		>
			{params(scheme)}
		</Drawer>
	);
}
