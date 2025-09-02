// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceProps, FieldOptions } from '@cmfx/components';
import { createSignal, JSX, onMount } from 'solid-js';

import { useAdmin } from '@/context';
import { Role } from './roles';

export type Props<M extends boolean> = Omit<ChoiceProps<string, M>, 'options'>;

export function Selector<M extends boolean>(props: Props<M>): JSX.Element {
    const [roles, setRoles] = createSignal<FieldOptions<string>>([]);
    const [api, act] = useAdmin();

    onMount(async () => {
        const r = await api.get<Array<Role>>('/roles');
        if (!r.ok) {
            await act.outputProblem(r.body);
            return;
        }

        const rs: FieldOptions<string> = [];
        for (const o of r.body!) {
            rs.push([o.id!, o.name]);
        }
        setRoles(rs);
    });

    return <Choice options={ roles() } {...props} />;
}
