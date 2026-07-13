// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ConfirmButton, Dialog, Divider, Form, InputText, Table } from '@cmfx/components';
import type { Locale } from '@cmfx/core';
import type { JSX } from 'solid-js';
import { produce } from 'solid-js/store';
import IconAdd from '~icons/material-symbols/add-circle-rounded';
import IconDelete from '~icons/material-symbols/delete';
import IconEdit from '~icons/material-symbols/edit';
import IconVars from '~icons/tabler/variable';

import type { SchemeStore } from '@docs/theme/utils';
import styles from './style.module.css';

export function cssVarsParams(l: Locale, s: SchemeStore): JSX.Element {
	let dlg: Dialog.Ref;
	type Var = { name: string; value: string };
	const [F, Field, api] = Form.create<Var>({ initValue: { name: '', value: '' } });

	return (
		<div class={styles.param}>
			<Divider>
				<IconVars class="me-1" />
				{l.t('_d.theme.cssVars')}
			</Divider>

			<Table class={styles.vars}>
				<thead>
					<tr>
						<th class={styles.name}>{l.t('_d.theme.name')}</th>
						<th class={styles.value}>{l.t('_d.theme.value')}</th>
						<th>{l.t('_d.theme.action')}</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(s[0]?.vars ?? {}).map(([name, value]) => (
						<tr>
							<td>{name}</td>
							<td>{value}</td>
							<td class="flex gap-1">
								<Button
									square
									title={l.t('_d.theme.edit')}
									onclick={() => {
										api.setValue({ name, value });
										dlg.root().showModal();
									}}
								>
									<IconEdit />
								</Button>
								<ConfirmButton
									square
									title={l.t('_d.theme.delete')}
									onclick={() =>
										s[1](
											'vars' as never,
											produce(d => delete d[name]),
										)
									}
								>
									<IconDelete />
								</ConfirmButton>
							</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan={3}>
							<Button
								class="w-full"
								palette="primary"
								onclick={() => {
									api.setValue({ name: '', value: '' });
									dlg.root().showModal();
								}}
							>
								<IconAdd class="me-1" />
								{l.t('_d.theme.add')}
							</Button>
						</td>
					</tr>
				</tfoot>
			</Table>

			<Dialog
				ref={el => (dlg = el)}
				mount={document.body}
				header={
					<Dialog.Toolbar close movable>
						{l.t('_d.theme.cssVars')}
					</Dialog.Toolbar>
				}
				footer={
					<Dialog.Actions
						accept={async () => {
							const name = api.createFieldAccessor('name');
							const value = api.createFieldAccessor('value');
							// biome-ignore lint/suspicious/noExplicitAny: any
							s[1]('vars', name.getValue() as never, value.getValue() as any);
							api.reset();
							return undefined;
						}}
						cancel={async () => {
							api.reset();
							return undefined;
						}}
					/>
				}
			>
				<F inDialog class="gap-1">
					<Field name="name" label={l.t('_d.theme.name')}>
						<InputText />
					</Field>

					<Field name="value" label={l.t('_d.theme.value')}>
						<InputText />
					</Field>
				</F>
			</Dialog>
		</div>
	);
}
