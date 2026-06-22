// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { DataTable, handleProblem, Label, Page, useLocale } from '@cmfx/components';
import { createMemo, type JSX } from 'solid-js';
import IconSubtitle from '~icons/material-symbols/subtitles-gear';
import IconTask from '~icons/material-symbols/task';

import { useREST } from '@admin/app';
import type { MessagesKey } from '@admin/messages';
import styles from './style.module.css';

interface Service {
	jobs: Array<Job>;
	services: Array<Task>;
}

type State = 'stopped' | 'running' | 'failed';

interface Task {
	err?: string;
	state: State;
	title: string;
}

interface Job extends Task {
	next: string;
	prev: string;
}

export const stateMap: Array<[State, MessagesKey]> = [
	['stopped', '_p.system.serviceStates.stopped'],
	['running', '_p.system.serviceStates.running'],
	['failed', '_p.system.serviceStates.failed'],
] as const;

/**
 * 服务列表页面
 */
export function Services(): JSX.Element {
	const reest = useREST();
	const l = useLocale();
	const f = createMemo(() => {
		return l.datetimeFormat().format;
	});

	const items = createMemo(async () => {
		const ret = await reest.get<Service>('/system/services');
		if (!ret.ok) {
			await handleProblem(ret.body);
			return;
		}
		return ret.body;
	});

	const states = createMemo(() => {
		return stateMap.map(v => ({ type: 'item', value: v[0], label: l.t(v[1]) }));
	});

	return (
		<Page title="_p.system.serviceViewer" class={styles.services}>
			<fieldset>
				<Label icon={<IconSubtitle />} tag="legend">
					{l.t('_p.system.services')}
				</Label>
				<DataTable
					load={async () => (await items())?.services}
					columns={[
						{ id: 'title', label: l.t('_p.system.title') },
						{
							id: 'state',
							label: l.t('_p.system.serviceState'),
							content: (_, v) => {
								return states().find(val => val.value === v)?.label;
							},
						},
						{ id: 'err', label: l.t('_p.system.error') },
					]}
				/>
			</fieldset>

			<br />

			<fieldset>
				<Label icon={<IconTask />} tag="legend">
					{l.t('_p.system.jobs')}
				</Label>
				<DataTable
					load={async () => (await items())?.jobs}
					columns={[
						{ id: 'title', label: l.t('_p.system.title') },
						{
							id: 'state',
							label: l.t('_p.system.serviceState'),
							content: (_, v) => {
								return states().find(val => val.value === v)?.label;
							},
						},
						{ id: 'err', label: l.t('_p.system.error') },
						{
							id: 'next',
							label: l.t('_p.system.next'),
							content: (_, val) => {
								return val ? f()(new Date(val)) : '';
							},
						},
						{
							id: 'prev',
							label: l.t('_p.system.prev'),
							content: (_, val) => {
								return val ? f()(new Date(val)) : '';
							},
						},
					]}
				/>
			</fieldset>
		</Page>
	);
}
