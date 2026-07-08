// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, Label, Page, type Palette, useLocale } from '@cmfx/components';
import { For, type JSX, Show, type VoidComponent } from 'solid-js';
import IconEmail from '~icons/clarity/email-solid';
import IconAutomation from '~icons/material-symbols/automation';
import IconDescription from '~icons/material-symbols/description';
import IconFolderCode from '~icons/material-symbols/folder-code';
import IconHost from '~icons/material-symbols/host';
import IconURL from '~icons/material-symbols/link-rounded';
import IconAbout from '~icons/mdi/about';

import type { About as AboutData, Package } from './plugin';
import { aboutName } from './plugin';
import styles from './style.module.css';

export interface Props {
	/**
	 * 自定义关于页面的描述信息
	 */
	readonly description?: VoidComponent;

	/**
	 * 一些额外信息
	 */
	readonly info?: Info;
}

interface Info {
	name: string;

	version: string;

	lastUpdate: string;

	license?: string;

	homepage?: string;

	author?: Author;
}

interface Author {
	name: string;
	url?: string;
	email?: string;
}

declare global {
	interface Window {
		[aboutName]: AboutData;
	}
}

const boxPalette = 'tertiary' satisfies Palette;

/**
 * 关于页面
 *
 * 此页面需要 {@link https://www.npmjs.com/@cmfx/vite-plugin-about|vite-plugin-about} 插件生成数据。
 */
export function About(props: Props): JSX.Element {
	const l = useLocale();
	const data = window[aboutName];
	const dt = l.datetimeFormat();

	return (
		<Page title="_p.system.about.about" class={styles.about}>
			<Show when={props.description}>
				{description => (
					<fieldset class={joinClass(boxPalette, styles.box)}>
						<Label class="px-1 text-lg" icon={<IconDescription />} tag="legend">
							{l.t('_p.system.about.description')}
						</Label>
						<article>{description()({})}</article>
					</fieldset>
				)}
			</Show>

			<Show when={props.info}>
				{info => (
					<fieldset class={joinClass(boxPalette, styles.box, styles.grid)}>
						<Label class="px-1 text-lg" icon={<IconAbout />} tag="legend">
							{l.t('_p.system.about.info')}
						</Label>

						<dl class={styles.item}>
							<dt>{l.t('_p.system.about.name')}</dt>
							<dd class={styles.value}>{info().name}</dd>
						</dl>

						<dl class={styles.item}>
							<dt>{l.t('_p.system.about.version')}</dt>
							<dd class={styles.value}>{info().version}</dd>
						</dl>

						<dl class={styles.item}>
							<dt>{l.t('_p.system.about.lastUpdate')}</dt>
							<dd class={styles.value}>{dt.format(new Date(info().lastUpdate))}</dd>
						</dl>

						<Show when={info().license}>
							{license => (
								<dl class={styles.item}>
									<dt>{l.t('_p.system.about.license')}</dt>
									<dd class={styles.value}>{license()}</dd>
								</dl>
							)}
						</Show>

						<Show when={info().homepage}>
							{homepage => (
								<dl class={styles.item}>
									<dt>{l.t('_p.system.about.homepage')}</dt>
									<dd class={styles.value}>{homepage()}</dd>
								</dl>
							)}
						</Show>

						<Show when={info().author}>
							{author => (
								<dl class={styles.item}>
									<dt>{l.t('_p.system.about.author')}</dt>
									<dd class={joinClass(undefined, styles.value, styles.author)}>
										<p>{author().name}</p>
										<Show when={author().url}>
											{url => (
												<a href={url()} target="_blank" rel="noopener noreferrer">
													<IconURL />
												</a>
											)}
										</Show>
										<Show when={author().email}>
											{email => (
												<a href={`mailto:${email()}`} target="_blank" rel="noopener noreferrer">
													<IconEmail />
												</a>
											)}
										</Show>
									</dd>
								</dl>
							)}
						</Show>
					</fieldset>
				)}
			</Show>

			<Show when={data.serverDependencies}>
				{c => renderPackage(l.t('_p.system.about.srvDeps'), c(), <IconHost />)}
			</Show>
			<Show when={data.dependencies}>
				{c => renderPackage(l.t('_p.system.about.prodDeps'), c(), <IconAutomation />)}
			</Show>
			<Show when={data.devDependencies}>
				{c => renderPackage(l.t('_p.system.about.devDeps'), c(), <IconFolderCode />)}
			</Show>
		</Page>
	);
}

function renderPackage(title: string, pkgs: Array<Package>, icon?: JSX.Element): JSX.Element {
	return (
		<fieldset class={joinClass(boxPalette, styles.box, styles.grid)}>
			<Label class="px-1 text-lg" icon={icon} tag="legend">
				{title}
			</Label>
			<For each={pkgs}>
				{item => (
					<dl class={styles.item}>
						<dt>{item.name}</dt>
						<dd class={styles.value}>{item.version}</dd>
					</dl>
				)}
			</For>
		</fieldset>
	);
}
