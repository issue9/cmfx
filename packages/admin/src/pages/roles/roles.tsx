// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DataTable, Dialog, Form, InputText, Page, TextArea, useLocale } from '@cmfx/components';
import type { Query, Return } from '@cmfx/core';
import type { JSX } from 'solid-js';
import { unwrap } from 'solid-js/store';
import IconEdit from '~icons/material-symbols/edit';
import IconPasskey from '~icons/material-symbols/passkey';

import { handleProblem, useREST } from '@admin/app';
import styles from './style.module.css';

export type Role = {
	id?: string;
	name: string;
	description: string;
	parent?: string;
};

interface Props {
	/**
	 * 路由基地址
	 */
	routePrefix: string;
}

export function Roles(props: Props): JSX.Element {
	const l = useLocale();
	const rest = useREST();
	let tableRef: DataTable.Ref<Role>;
	let dialogRef: Dialog.Ref;

	const [F, Field, formAPI] = Form.create<Role>({
		initValue: {
			name: '',
			description: '',
		},
	});

	rest.api().cache('/roles', '/roles/*');

	const [load, DeleteAction] = DataTable.buildREST<Role, Query, false>(rest, '/roles', handleProblem);

	// 保存数据
	const save = async (): Promise<undefined> => {
		let ret: Return<Role>;

		const obj = unwrap(formAPI.getValue());
		const id = obj.id;
		delete obj.id;
		if (id) {
			ret = await rest.put(`/roles/${id}`, obj);
		} else {
			ret = await rest.post('/roles', obj);
		}

		if (!ret.ok) {
			await handleProblem(ret.body!);
			return;
		}
		await tableRef.refresh();
	};

	const edit = (id: string) => {
		if (id) {
			const curr = tableRef.items().find(v => v.id === id);
			formAPI.setValue({
				id: id,
				name: curr!.name,
				description: curr!.description,
				parent: curr!.parent,
			});
		} else {
			formAPI.setValue({
				id: id,
				name: '',
				description: '',
				parent: '',
			});
		}

		dialogRef.root().showModal();
	};

	return (
		<Page title="_p.roles.rolesManager" class={styles.roles}>
			<Dialog
				ref={el => (dialogRef = el)}
				header={formAPI.getValue().name ? l.t('_p.editItem') : l.t('_p.newItem')}
				footer={
					<>
						<Dialog.CancelButton value="cancel" onclick={save}>
							{l.t('_c.cancel')}
						</Dialog.CancelButton>
						<Dialog.AcceptButton value="accept">{l.t('_c.ok')}</Dialog.AcceptButton>
					</>
				}
			>
				<F inDialog>
					<Field name="name">
						<InputText />
					</Field>
					<Field name="description">
						<TextArea />
					</Field>
				</F>
			</Dialog>

			<DataTable
				ref={el => (tableRef = el)}
				load={load}
				systemToolbar
				columns={[
					{ id: 'id', label: l.t('_p.id') },
					{ id: 'name', label: l.t('_p.roles.name') },
					{ id: 'description', label: l.t('_p.roles.description') },
					{
						cellClass: 'no-print',
						label: l.t('_p.actions'),
						renderContent: (row => (
							<div class="flex gap-x-2">
								<Button square rounded palette="tertiary" onclick={() => edit(row.id!)} title={l.t('_p.editItem')}>
									<IconEdit />
								</Button>
								<Button
									square
									rounded
									palette="tertiary"
									type="a"
									href={`${props.routePrefix}/${row.id}/permission`}
									title={l.t('_p.roles.editPermission')}
								>
									<IconPasskey />
								</Button>
								<DeleteAction id={row.id!} />
							</div>
						)) as DataTable.Column<Role>['renderContent'],
					},
				]}
				toolbar={
					<Button palette="primary" onclick={() => edit('')}>
						{l.t('_p.newItem')}
					</Button>
				}
			/>
		</Page>
	);
}
