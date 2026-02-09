// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceOption, ChoiceProps } from '@cmfx/components';
import { createSignal, JSX, onMount } from 'solid-js';

import { handleProblem, useREST } from '@admin/app';
import { Role } from './roles';

type P = ChoiceProps<string>;

interface SProps extends Omit<Extract<P, { multiple?: false }>, 'options'> {}

interface MProps extends Omit<Extract<P, { multiple: true }>, 'options'> {}

export type Props = SProps | MProps;

export function Selector(props: Props): JSX.Element {
	const [roles, setRoles] = createSignal<Array<ChoiceOption<string>>>([]);
	const api = useREST();

	onMount(async () => {
		const r = await api.get<Array<Role>>('/roles');
		if (!r.ok) {
			await handleProblem(r.body!);
			return;
		}

		const rs: Array<ChoiceOption<string>> = [];
		for (const o of r.body!) {
			rs.push({ type: 'item', value: o.id!, label: o.name });
		}
		setRoles(rs);
	});

	return <Choice options={roles()} {...props} />;
}
