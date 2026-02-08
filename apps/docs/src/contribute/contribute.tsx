// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Nav, Page, useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { markdown } from '@docs/utils';
import txt from '../../../../CONTRIBUTING.md?raw';
import styles from './style.module.css';

export function Contribute(): JSX.Element {
	const l = useLocale();

	let articleRef: HTMLElement;

	return (
		<Page title={l.t('_d.contribute.contribute')} class={styles.contribute}>
			<article
				ref={el => {
					articleRef = el;
				}}
				innerHTML={markdown(txt)}
			/>
			<Nav minHeaderCount={5} class={styles.nav} target={articleRef!} query="h2,h3,h4,h5,h6" />
		</Page>
	);
}
