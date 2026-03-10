// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Page } from '@cmfx/components';
import { JSX, ParentProps } from 'solid-js';

import styles from './style.module.css';

export function Dashboard(props: ParentProps): JSX.Element {
	return (
		<Page.Root title="_p.current.dashboard" class={styles.dashboard}>
			{props.children}
		</Page.Root>
	);
}
