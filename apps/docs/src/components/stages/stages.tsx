// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Markdown, Nav, Page, useLocale, useOptions } from '@cmfx/components';
import type { Type } from '@cmfx/vite-plugin-api';
import { A, useCurrentMatches } from '@solidjs/router';
import { createMemo, For, type JSX } from 'solid-js';
import IconGithub from '~icons/lineicons/github';

import { APIDoc } from '@docs/apidoc';
import { type APIFileObject, fileObject2Map, type TextFileObject } from '@docs/utils';
import pkg from '../../../package.json' with { type: 'json' };
import { default as Stage, type Props as StageProps } from './stage';
import styles from './style.module.css';

// 演示文件的基地址
const baseURL = `${pkg.repository.url}/tree/master/${pkg.repository.directory}/src/components/demo/`;

export interface Props {
	/**
	 * 演示文件相对于 apps/docs/src/components/demo 的目录
	 */
	dir: string;

	/**
	 * 所有展示舞台
	 */
	stages?: Array<StageProps>;

	/**
	 * API 内容
	 */
	api?: APIFileObject;

	doc: TextFileObject;
}

/**
 * 组件展示组件
 */
export default function Stages(props: Props): JSX.Element {
	const l = useLocale();
	const [, origin] = useOptions();

	const route = useCurrentMatches()();
	const title = route[route.length - 1].route.info?.title;

	let articleRef!: HTMLElement;
	let navRef!: Nav.RootRef;
	const url = baseURL + props.dir;

	// 文档内容
	const text = createMemo<string>(() => {
		const apis = fileObject2Map(props.doc);
		const locales = Array.from(apis.keys());

		return apis.size > 1 // >1 表示有多种语言
			? apis.get(l.match(locales, origin.locale))
			: apis.values().next().value;
	});

	// 文档中的组件
	const components = createMemo<Markdown.RootProps['components']>(() => {
		const ret: Markdown.RootProps['components'] = {};

		if (props.stages) {
			for (const s of props.stages) {
				ret[`demo-${s.id}`] = () => <Stage {...s} />;
			}
		}

		if (props.api) {
			const apis = fileObject2Map(props.api);
			const locales = Array.from(apis.keys());

			const types: Array<Type> =
				apis.size > 1 // >1 表示有多种语言
					? apis.get(l.match(locales, origin.locale))
					: apis.values().next().value;

			ret.api = () => (
				<article class={styles.apis}>
					<h3>{l.t('_d.stages.api')}</h3>
					<For each={types}>{api => <APIDoc api={api} />}</For>
				</article>
			);
		}

		return ret;
	});

	return (
		<Page.Root class={styles['stages-page']} title={title}>
			<article class={styles.root} ref={el => (articleRef = el)}>
				<h2>
					{l.t(title)}
					<A class={styles.edit} href={url} title={l.t('_d.stages.editOnGithub')}>
						<IconGithub />
					</A>
				</h2>

				<Markdown.Root text={text()} components={components()} onComplete={() => navRef.refresh()} />
			</article>

			<Nav.Root minHeaderCount={5} ref={el => (navRef = el)} class={styles.nav} target={articleRef} query="h3,h4" />
		</Page.Root>
	);
}
