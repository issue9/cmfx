// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Page, RemoteTable, RemoteTableRef, TextField, useLocale } from '@cmfx/components';
import { Query } from '@cmfx/core';
import { createMemo, JSX, Show } from 'solid-js';
import IconEdit from '~icons/material-symbols/edit';
import IconLock from '~icons/material-symbols/lock';
import IconLockOpenRight from '~icons/material-symbols/lock-open-right';

import { handleProblem, useREST } from '@admin/app';
import { localeSexes, localeStates, SexSelector, StateSelector } from '@admin/components';
import { Sex, State } from '@admin/schemas';

interface Props {
	/**
	 * 路由基地址
	 */
	routePrefix: string;
}

export type Admin = {
	id: number;
	no: string;
	sex: Sex;
	name: string;
	nickname: string;
	avatar?: string;
	created?: string;
	state: State;
};

interface Q extends Query {
	text: string;
	state: Array<State>;
	sex: Array<Sex>;
}

export function Admins(props: Props): JSX.Element {
	const l = useLocale();
	const rest = useREST();

	const q: Q = {
		text: '',
		page: 1,
		state: ['normal', 'locked'],
		sex: ['male', 'female', 'unknown'],
	};

	let ref: RemoteTableRef<Admin>;

	const sexes = createMemo(() => {
		return localeSexes(l);
	});
	const states = createMemo(() => {
		return localeStates(l);
	});

	return (
		<Page title="_p.admin.adminsManager">
			<RemoteTable<Admin, Q>
				rest={rest}
				ref={el => {
					ref = el;
				}}
				inSearch
				paging
				path="/admins"
				queries={q}
				systemToolbar
				toolbar={
					<Button type="a" palette="primary" href={`${props.routePrefix}/0`}>
						{l.t('_p.newItem')}
					</Button>
				}
				queryForm={qa => (
					<>
						<TextField accessor={qa.accessor<string>('text')} />
						<StateSelector multiple accessor={qa.accessor<Array<State>>('state')} />
						<SexSelector multiple accessor={qa.accessor<Array<Sex>>('sex')} />
					</>
				)}
				columns={[
					{ id: 'id', label: l.t('_p.id') },
					{ id: 'no', label: l.t('_p.no') },
					{
						id: 'sex',
						label: l.t('_p.sex'),
						content: (_, v) => {
							return sexes().find(val => val.value === v)?.label;
						},
					},
					{ id: 'name', label: l.t('_p.admin.name') },
					{ id: 'nickname', label: l.t('_p.nickname') },
					{
						id: 'created',
						label: l.t('_p.created'),
						content: (_, v) => l.datetimeFormat().format(new Date(v as string)),
					},
					{
						id: 'state',
						label: l.t('_p.state'),
						content: (_, v) => {
							return states().find(val => val.value === v)?.label;
						},
					},
					{
						id: 'actions',
						cellClass: 'no-print',
						label: l.t('_p.actions'),
						isUnexported: true,
						renderContent: (_, __, obj?: Admin) => {
							return (
								<div class="flex gap-x-2">
									<Show when={obj?.state !== 'deleted'}>
										<Button
											type="a"
											square
											rounded
											palette="tertiary"
											href={`${props.routePrefix}/${obj!['id']}`}
											title={l.t('_p.editItem')}
										>
											<IconEdit />
										</Button>
									</Show>

									<Show when={obj?.state !== 'locked' && obj?.state !== 'deleted'}>
										<Button
											square
											rounded
											palette="error"
											title={l.t('_p.admin.lockUser')}
											onclick={async () => {
												const r = await rest.post(`/admins/${obj!['id']}/locked`);
												if (!r.ok) {
													await handleProblem(r.body!);
													return;
												}
												await ref.refresh();
											}}
										>
											<IconLock />
										</Button>
									</Show>

									<Show when={obj?.state === 'locked'}>
										<Button
											square
											rounded
											palette="tertiary"
											title={l.t('_p.admin.unlockUser')}
											onclick={async () => {
												const r = await rest.delete(`/admins/${obj!['id']}/locked`);
												if (!r.ok) {
													await handleProblem(r.body!);
													return;
												}
												await ref.refresh();
											}}
										>
											<IconLockOpenRight />
										</Button>
									</Show>

									<Show when={obj?.state !== 'deleted'}>{ref.DeleteAction(obj!.id!)}</Show>
								</div>
							);
						},
					},
				]}
			/>
		</Page>
	);
}
