// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Markdown, Nav, Page, useLocale } from '@cmfx/components';
import type { JSX } from 'solid-js';

import txt from '../../../../CONTRIBUTING.md?raw';
import styles from './style.module.css';

export function Contribute(): JSX.Element {
	const l = useLocale();

	let articleRef: Markdown.Ref;
	let navRef: Nav.Ref;

	return (
		<Page title={l.t('_d.contribute.contribute')} class={styles.contribute}>
			<Markdown ref={el => (articleRef = el)} text={txt} onComplete={() => navRef.refresh()} />
			<Nav
				ref={el => (navRef = el)}
				minHeaderCount={5}
				class={styles.nav}
				target={articleRef!.root()}
				query="h2,h3,h4,h5,h6"
			/>
		</Page>
	);
}
