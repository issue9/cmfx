// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Markdown, Nav, Page, useLocale, useOptions } from '@cmfx/components';
import type { Type } from '@cmfx/vite-plugin-api';
import { A, useCurrentMatches } from '@solidjs/router';
import { createEffect, createSignal, For, type JSX, Show } from 'solid-js';
import IconGithub from '~icons/lineicons/github';

import { APIDoc } from '@docs/apidoc';
import type { APIFileObject, TextFileObject } from '@docs/utils';
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
	 * 演示页面的底部内容
	 */
	footer?: TextFileObject;

	/**
	 * 演示页面的顶部内容
	 */
	header?: TextFileObject;

	/**
	 * API 内容
	 */
	api?: APIFileObject;

	doc?: TextFileObject;
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

	const [footer, setFooter] = createSignal<string>('');
	if (props.footer) {
		const arr = Object.entries(props.footer).map(([k, v]) => [k.replace(/^\.\/FOOTER\./, '').replace(/\.md$/, ''), v]);
		const obj = Object.fromEntries(arr);

		createEffect(() => {
			const loc = l.match(Object.keys(obj), origin.locale);
			setFooter(obj[loc]);

			requestIdleCallback(() => navRef.refresh());
		});
	}

	const [header, setHeader] = createSignal<string>('');
	if (props.header) {
		const arr = Object.entries(props.header).map(([k, v]) => [k.replace(/^\.\/HEADER\./, '').replace(/\.md$/, ''), v]);
		const obj = Object.fromEntries(arr);

		createEffect(() => {
			const loc = l.match(Object.keys(obj), origin.locale);
			setHeader(obj[loc]);

			requestIdleCallback(() => navRef.refresh());
		});
	}

	const [api, setAPI] = createSignal<Array<Type>>();
	if (props.api) {
		const arr = Object.entries(props.api).map(([k, v]) => [k.replace(/^\.\/api\./, '').replace(/\.json$/, ''), v]);
		const obj = Object.fromEntries(arr);

		createEffect(() => {
			const loc = l.match(Object.keys(obj), origin.locale);
			setAPI(obj[loc]);

			requestIdleCallback(() => navRef.refresh());
		});
	}

	return (
		<Page.Root class={styles['stages-page']} title={title}>
			<article
				class={styles.root}
				ref={el => {
					articleRef = el;
				}}
			>
				<h2>
					{l.t(title)}
					<A class={styles.edit} href={url} title={l.t('_d.stages.editOnGithub')}>
						<IconGithub />
					</A>
				</h2>

				<Show when={header()}>{d => <Markdown.Root text={d()} />}</Show>

				<Show when={props.stages}>
					{stages => (
						<>
							<h3>{l.t('_d.stages.codeDemo')}</h3>
							<div class={styles.stages}>
								<For each={stages()}>{stage => <Stage {...stage} />}</For>
							</div>
						</>
					)}
				</Show>

				<Show when={api()}>
					{apis => (
						<article class={styles.apis}>
							<h3>{l.t('_d.stages.api')}</h3>
							<For each={apis()}>{api => <APIDoc api={api} />}</For>
						</article>
					)}
				</Show>

				<Show when={footer()}>{f => <Markdown.Root tag="article" text={f()} />}</Show>
			</article>

			<Nav.Root
				minHeaderCount={5}
				ref={el => {
					navRef = el;
				}}
				class={styles.nav}
				target={articleRef}
				query="h3,h4"
			/>
		</Page.Root>
	);
}
