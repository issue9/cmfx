// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { useLocale } from '@cmfx/cdk';
import { Nav, Page } from '@cmfx/components';
import type { Type } from '@cmfx/vite-plugin-api';
import { A, useCurrentMatches } from '@solidjs/router';
import { For, type JSX } from 'solid-js';
import IconGithub from '~icons/lineicons/github';

import { APIDoc } from '@docs/apidoc';
import { LocalizedMDXDoc, type LocalizedMDXDocProps } from '@docs/mdx';
import pkg from '../../../package.json' with { type: 'json' };
import styles from './style.module.css';

// 演示文件的基地址
const baseURL = `${pkg.repository.url}/tree/master/${pkg.repository.directory}/src/components/demo/`;

export interface Props {
	/**
	 * 演示文件相对于 apps/docs/src/components/demo 的目录
	 */
	dir: string;

	docs: LocalizedMDXDocProps['docs'];
}

/**
 * 组件展示组件
 */
export default function Stages(props: Props): JSX.Element {
	const l = useLocale();

	const route = useCurrentMatches()();
	const title = route[route.length - 1].route.info?.title;

	let articleRef!: HTMLElement;
	let navRef!: Nav.Ref;
	const url = baseURL + props.dir;

	return (
		<Page class={styles['stages-page']} title={title}>
			<article class={styles.root} ref={el => (articleRef = el)}>
				<h1>
					{l.t(title)}
					<A class={styles.edit} href={url} title={l.t('_d.stages.editOnGithub')}>
						<IconGithub />
					</A>
				</h1>
				<LocalizedMDXDoc onSwitch={() => navRef?.refresh()} docs={props.docs} />
			</article>

			<Nav
				min={5}
				ref={el => (navRef = el)}
				class={styles.nav}
				target={articleRef}
				query=":is(h2,h3,h4):not(table *)"
			/>
		</Page>
	);
}

export function APIs(props: { types: Array<Type> }): JSX.Element {
	return <For each={props.types}>{api => <APIDoc api={api} />}</For>;
}
