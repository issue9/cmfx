// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, onMount } from 'solid-js';

import { useApp } from '@/app';
import { Choice, ChoiceProps, Options } from '@/components';
import { Role } from './roles';

export type Props<M extends boolean> = Omit<ChoiceProps<string, M>, 'options'>;

export default function<M extends boolean>(props: Props<M>): JSX.Element {
    const [roles, setRoles] = createSignal<Options<string>>([]);
    const ctx = useApp();

    onMount(async () => {
        const r = await ctx.api.get<Array<Role>>('/roles');
        if (!r.ok) {
            ctx.outputProblem(r.body);
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