// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DataTable, InputText, Page, useLocale } from '@cmfx/components';
import { noPrint, type Query } from '@cmfx/core';
import { type Component, createMemo, type JSX, Show } from 'solid-js';
import IconLock from '~icons/material-symbols/lock';
import IconLockOpen from '~icons/material-symbols/lock-open-right';
import IconVisibility from '~icons/material-symbols/visibility';

import { useREST } from '@admin/app';
import { localeSexes, localeStates, SexSelector, StateSelector } from '@admin/components';
import type { Sex, State } from '@admin/schemas';
import type { Member } from './types';

export interface ActionProps {
	/**
	 * 当前数据行的 ID
	 */
	id: number;

	/**
	 * 当前数据行
	 */
	member?: Member;

	/**
	 * 对整个表格的引用
	 */
	table?: DataTable.Ref<Member>;
}

interface Props {
	/**
	 * 路由基地址
	 */
	routePrefix: string;

	/**
	 * 操作列中的组件
	 */
	actions?: Component<ActionProps>;
}

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

/**
 * 会员列表组件
 */
export function Members(props: Props): JSX.Element {
	const [rest, handleProblem] = useREST();
	const l = useLocale();

	let ref: DataTable.Ref<Member>;

	const sexes = createMemo(() => {
		return localeSexes(l);
	});
	const states = createMemo(() => {
		return localeStates(l);
	});

	const [load, DeleteAction] = DataTable.buildREST<Member, Q>(rest, '/members', handleProblem);

	return (
		<Page title="_p.member.membersManager">
			<DataTable<Member, Q>
				ref={el => (ref = el)}
				inSearch={new QuerySearchConverter()}
				paging
				load={load}
				systemToolbar
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
					{ id: 'nickname', label: l.t('_p.nickname') },
					{
						id: 'created',
						label: l.t('_p.created'),
						content: (_, v) => l.datetimeFormat().format(new Date(v as string)),
					},
					{
						id: 'state',
						label: l.t('_p.state'),
						content: (_, v) => states().find(val => val.value === v)?.label,
					},
					{
						cellClass: noPrint,
						label: l.t('_p.actions'),
						isUnexported: true,
						renderContent: row => {
							return (
								<div class="flex gap-x-2">
									<Show when={row?.state !== 'deleted'}>
										<Button
											type="a"
											square
											rounded
											palette="tertiary"
											href={`${props.routePrefix}/${row!.id}`}
											title={l.t('_p.member.view')}
										>
											<IconVisibility />
										</Button>
									</Show>

									<Show when={row?.state !== 'locked' && row?.state !== 'deleted'}>
										<Button
											square
											rounded
											palette="error"
											title={l.t('_p.admin.lockUser')}
											onclick={async () => {
												const r = await rest.post(`/members/${row!.id}/locked`);
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

									<Show when={row?.state === 'locked'}>
										<Button
											square
											rounded
											palette="tertiary"
											title={l.t('_p.admin.unlockUser')}
											onclick={async () => {
												const r = await rest.delete(`/members/${row!.id}/locked`);
												if (!r.ok) {
													await handleProblem(r.body);
													return;
												}
												await ref.refresh();
											}}
										>
											<IconLockOpen />
										</Button>
									</Show>

									<Show when={row?.state !== 'deleted'}>
										<DeleteAction square rounded id={row.id} />
									</Show>

									<Show when={props.actions}>{props.actions!({ id: row?.id as number, member: row, table: ref })}</Show>
								</div>
							);
						},
					},
				]}
			/>
		</Page>
	);
}
