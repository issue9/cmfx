// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { useLocale } from '@cmfx/components';
import { useParams } from '@solidjs/router';
import type { JSX } from 'solid-js';

import type { Message } from '@dashboard/messages';
import styles from './style.module.css';

export default function Test(): JSX.Element {
	const ps = useParams();
	const l = useLocale();
	l.t<Message>('home');
	console.log(ps.id);

	return (
		<div class={styles.test}>
			{l.t<Message>('nest.abc')},{ps.id}
		</div>
	);
}
