// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Markdown, Nav, Page, useLocale } from '@cmfx/components';
import type { JSX } from 'solid-js';

import txt from '../../../../CONTRIBUTING.md?raw';
import styles from './style.module.css';

export function Contribute(): JSX.Element {
	const l = useLocale();

	let articleRef: Markdown.RootRef;

	return (
		<Page.Root title={l.t('_d.contribute.contribute')} class={styles.contribute}>
			<Markdown.Root ref={el => (articleRef = el)} text={txt} />
			<Nav.Root minHeaderCount={5} class={styles.nav} target={articleRef!.root()} query="h2,h3,h4,h5,h6" />
		</Page.Root>
	);
}
