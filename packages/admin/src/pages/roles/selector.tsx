// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, useREST } from '@cmfx/components';
import { createSignal, type JSX, onMount } from 'solid-js';

import type { Role } from './roles';

type P = Choice.Props<string>;

interface SProps extends Omit<Extract<P, { multiple?: false }>, 'options'> {}

interface MProps extends Omit<Extract<P, { multiple: true }>, 'options'> {}

export type Props = SProps | MProps;

export function Selector(props: Props): JSX.Element {
	const [roles, setRoles] = createSignal<Array<Choice.Option<string>>>([]);
	const [rest, handleProblem] = useREST();

	onMount(async () => {
		const r = await rest.get<Array<Role>>('/roles');
		if (!r.ok) {
			await handleProblem(r.body);
			return;
		}

		const rs: Array<Choice.Option<string>> = [];
		for (const o of r.body!) {
			rs.push({ type: 'item', value: o.id!, label: o.name });
		}
		setRoles(rs);
	});

	return <Choice options={roles()} {...props} />;
}
