// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, useLocale, useOptions } from '@cmfx/components';
import { joinClass, readScheme } from '@cmfx/themes';
import { createEffect, type JSX, onCleanup, onMount, type Setter } from 'solid-js';
import { createStore } from 'solid-js/store';

import { floatingWidth } from '@docs/utils';
import { Demo } from './demo';
import { Params } from './params';
import styles from './style.module.css';
import { convertSchemeVar2Color } from './utils';

export function Builder(props: { setDrawer: Setter<Drawer.Ref | undefined> }): JSX.Element {
	let drawerRef: Drawer.Ref;
	onMount(() => props.setDrawer(drawerRef));
	onCleanup(() => props.setDrawer());

	const scheme = createStore(convertSchemeVar2Color(readScheme()));
	const l = useLocale();
	const [act] = useOptions();
	createEffect(() => act.setTitle(l.t('_d.theme.builder')));

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
			<Params s={scheme} />
		</Drawer>
	);
}
