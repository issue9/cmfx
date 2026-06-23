// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DataTable, InputText, Page, useLocale, useREST } from '@cmfx/components';
import type { Query } from '@cmfx/core';
import { createMemo, type JSX, Show } from 'solid-js';
import IconEdit from '~icons/material-symbols/edit';
import IconLock from '~icons/material-symbols/lock';
import IconLockOpenRight from '~icons/material-symbols/lock-open-right';

import { localeSexes, localeStates, SexSelector, StateSelector } from '@admin/components';
import type { Sex, State } from '@admin/schemas';

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

class QuerySearchConverter implements DataTable.SearchConverter<Q> {
	to(params: DataTable.SearchParams<Q>): Q {
		return {
			page: params.page ? parseInt(params.page, 10) : undefined,
			size: params.size ? parseInt(params.size, 10) : undefined,
			text: params.text || '',
			state: (params.state || ['normal', 'locked']) as Array<State>,
			sex: (params.sex || ['male', 'female', 'unknown']) as Array<Sex>,
		};
	}

	from(query: Q): DataTable.SearchParams<Q> {
		return {
			page: query.page?.toString() || '1',
			size: query.size?.toString() || '20',
			text: query.text,
			state: query.state ? query.state.join(',') : '',
			sex: query.sex ? query.sex.join(',') : '',
		};
	}
}

export function Admins(props: Props): JSX.Element {
	const l = useLocale();
	const [rest, handleProblem] = useREST();

	let ref: DataTable.Ref<Admin>;

	const sexes = createMemo(() => {
		return localeSexes(l);
	});
	const states = createMemo(() => {
		return localeStates(l);
	});

	const [load, DeleteAction] = DataTable.buildREST<Admin, Q>(rest, '/admins', handleProblem);

	return (
		<Page title="_p.admin.adminsManager">
			<DataTable<Admin, Q>
				ref={el => (ref = el)}
				inSearch={new QuerySearchConverter()}
				paging
				load={load}
				systemToolbar
				toolbar={
					<Button type="a" palette="primary" href={`${props.routePrefix}/0`}>
						{l.t('_p.newItem')}
					</Button>
				}
				queryForm={(_, Field) => (
					<>
						<Field name="text">
							<InputText />
						</Field>

						<Field name="state">
							<StateSelector multiple />
						</Field>

						<Field name="sex">
							<SexSelector multiple />
						</Field>
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
						id: 'id',
						cellClass: 'no-print',
						label: l.t('_p.actions'),
						isUnexported: true,
						renderContent: (obj: Admin) => {
							return (
								<div class="flex gap-x-2">
									<Show when={obj?.state !== 'deleted'}>
										<Button
											type="a"
											square
											rounded
											palette="tertiary"
											href={`${props.routePrefix}/${obj!.id}`}
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
												const r = await rest.post(`/admins/${obj!.id}/locked`);
												if (!r.ok) {
													await handleProblem(r.body);
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
												const r = await rest.delete(`/admins/${obj!.id}/locked`);
												if (!r.ok) {
													await handleProblem(r.body);
													return;
												}
												await ref.refresh();
											}}
										>
											<IconLockOpenRight />
										</Button>
									</Show>

									<Show when={obj.state !== 'deleted'}>
										<DeleteAction square rounded id={obj.id} />
									</Show>
								</div>
							);
						},
					},
				]}
			/>
		</Page>
	);
}
