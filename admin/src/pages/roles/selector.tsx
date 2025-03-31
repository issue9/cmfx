// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, onMount } from 'solid-js';

import { Choice, ChoiceProps, Options, useApp } from '@/components';
import { Role } from './roles';

export type Props<M extends boolean> = Omit<ChoiceProps<string, M>, 'options'>;

export function Selector<M extends boolean>(props: Props<M>): JSX.Element {
    const [roles, setRoles] = createSignal<Options<string>>([]);
    const ctx = useApp();

    onMount(async () => {
        const r = await ctx.api.get<Array<Role>>('/roles');
        if (!r.ok) {
            await ctx.outputProblem(r.body);
            return;
        }

        const rs: Options<string> = [];
        for (const o of r.body!) {
            rs.push([o.id!, o.name]);
        }
        setRoles(rs);
    });

    return <Choice options={ roles() } {...props} />;
}
