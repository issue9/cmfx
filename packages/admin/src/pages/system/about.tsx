// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Label, Page, useLocale } from '@cmfx/components';
import { For, JSX, Show, VoidComponent } from 'solid-js';
import IconAutomation from '~icons/material-symbols/automation';
import IconFolderCode from '~icons/material-symbols/folder-code';
import IconHost from '~icons/material-symbols/host';

import type { About as AboutData, Package } from './plugin';
import { aboutName } from './plugin';
import styles from './style.module.css';

interface Props {
	/**
	 * 自定义关于页面的描述信息
	 */
	description?: VoidComponent;
}

declare global {
	interface Window {
		[aboutName]: AboutData;
	}
}

/**
 * 关于页面
 *
 * 此页面需要 {@link https://www.npmjs.com/@cmfx/vite-plugin-about|vite-plugin-about} 插件生成数据。
 */
export function About(props: Props): JSX.Element {
	const l = useLocale();
	const data = window[aboutName];

	return (
		<Page title="_p.system.about" class={styles.about}>
			{props.description?.({})}

			<Show when={data.serverDependencies}>
				{c => {
					return renderPackage(l.t('_p.system.srvDeps'), c(), <IconHost />);
				}}
			</Show>

			<Show when={data.dependencies}>
				{c => {
					return renderPackage(l.t('_p.system.prodDeps'), c(), <IconAutomation />);
				}}
			</Show>

			<Show when={data.devDependencies}>
				{c => {
					return renderPackage(l.t('_p.system.devDeps'), c(), <IconFolderCode />);
				}}
			</Show>
		</Page>
	);
}

function renderPackage(title: string, pkgs: Array<Package>, icon?: JSX.Element): JSX.Element {
	return (
		<fieldset class="palette--tertiary">
			<Label class="px-1 text-lg" icon={icon} tag="legend">
				{title}
			</Label>
			<For each={pkgs}>
				{item => (
					<div class={styles.item}>
						<span>{item.name}</span>
						<span class={styles.version}>{item.version}</span>
					</div>
				)}
			</For>
		</fieldset>
	);
}
