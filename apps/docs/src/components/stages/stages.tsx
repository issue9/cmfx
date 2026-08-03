// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Nav, Page, useLocale, useOptions } from '@cmfx/components';
import type { Type } from '@cmfx/vite-plugin-api';
import { A, useCurrentMatches } from '@solidjs/router';
import { type Component, createMemo, For, type JSX } from 'solid-js';
import IconGithub from '~icons/lineicons/github';

import { APIDoc } from '@docs/apidoc';
import { type FileObject, fileObject2Map } from '@docs/utils';
import pkg from '../../../package.json' with { type: 'json' };
import styles from './style.module.css';

// 演示文件的基地址
const baseURL = `${pkg.repository.url}/tree/master/${pkg.repository.directory}/src/components/demo/`;

export interface Props {
	/**
	 * 演示文件相对于 apps/docs/src/components/demo 的目录
	 */
	dir: string;

	doc: FileObject<Component>;
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

	const [, origin] = useOptions();

	const comp = createMemo(() => {
		const articles = fileObject2Map(props.doc);
		const locales = Array.from(articles.keys());

		requestAnimationFrame(() => navRef.refresh());

		return articles.size > 1 // >1 表示有多种语言
			? articles.get(l.match(locales, origin.locale))
			: articles.values().next().value;
	});

	return (
		<Page class={styles['stages-page']} title={title}>
			<article class={styles.root} ref={el => (articleRef = el)}>
				<h1>
					{l.t(title)}
					<A class={styles.edit} href={url} title={l.t('_d.stages.editOnGithub')}>
						<IconGithub />
					</A>
				</h1>

				{comp()}
			</article>

			<Nav minHeaderCount={5} ref={el => (navRef = el)} class={styles.nav} target={articleRef} query="h2,h3,h4" />
		</Page>
	);
}

export function APIs(props: { types: Array<Type> }): JSX.Element {
	return <For each={props.types}>{api => <APIDoc api={api} />}</For>;
}
