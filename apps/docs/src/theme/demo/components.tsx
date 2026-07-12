// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card, DataTable, DatePicker, Form, InputPassword, InputText, Menu } from '@cmfx/components';
import type { JSX } from 'solid-js';

import styles from './style.module.css';

interface Item {
	id: number;
	name: string;
	address: string;
}

export function Components(): JSX.Element {
	const items = (): Promise<Array<Item>> => {
		return Promise.resolve([
			{ id: 1, name: 'name1', address: 'address1' },
			{
				id: 3,
				name: 'name3',
				address: '这是一行很长的数据，这是一行很长的数据，这是一行很长的数据，这是一行很长的数据。',
			},
			{ id: 2, name: 'name2', address: 'address2' },
		]);
	};

	const columns: Array<DataTable.Column<Item>> = [
		{ id: 'id', label: 'id' },
		{ id: 'name', label: 'name' },
		{ id: 'address', label: 'address' },
		{
			label: 'action',
			renderLabel: 'ACTIONS',
			isUnexported: true,
			renderContent: () => {
				return <button type="button">...</button>;
			},
		},
	];

	const [F, Field] = Form.create({
		initValue: {
			username: '',
			password: '',
		},
	});

	return (
		<div class={styles.components}>
			<DataTable class="w-full! transition-all" load={items} columns={columns} />

			<DatePicker class="transition-all" value={new Date()} />

			<Card
				class="transition-all"
				header="注册用户"
				footerClass="flex justify-between"
				footer={
					<>
						<Button palette="primary">重置</Button>
						<Button palette="primary">注册</Button>
					</>
				}
			>
				<F layout="vertical">
					<Field name="username" label="用户名">
						<InputText placeholder="请输入用户名" />
					</Field>
					<Field name="password" label="密码">
						<InputPassword placeholder="请输入密码" />
					</Field>
				</F>
			</Card>

			<Menu
				class="min-w-50 rounded-md border border-palette-fg-low transition-all"
				layout="inline"
				items={[
					{ type: 'item', label: 'Item 1', value: '1' },
					{ type: 'item', label: 'Item 2', value: '2' },
					{ type: 'item', label: 'Item 3', value: '3' },
					{
						type: 'group',
						label: 'group',
						items: [
							{ type: 'item', label: 'Item 1', value: '41' },
							{ type: 'item', label: 'Item 2', value: '42' },
						],
					},
				]}
			/>
		</div>
	);
}
