// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Nav, Page, useLocale } from '@cmfx/components';
import type { JSX } from 'solid-js';

import { LocalizedMDXDoc } from '@docs/mdx';
import styles from '@docs/mdx/style.module.css';

export function Contribute(): JSX.Element {
	const l = useLocale();
	let articleRef!: HTMLElement;

	return (
		<Page title={l.t('_d.contribute.contribute')} class={styles.docs}>
			<LocalizedMDXDoc
				class={styles.doc}
				ref={el => (articleRef = el)}
				docs={import.meta.glob('./CONTRIBUTING.md', { eager: true, import: 'default' })}
			/>
			<Nav min={5} class={styles.nav} target={articleRef} query="h2,h3,h4,h5,h6" />
		</Page>
	);
}
