// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useParams } from '@solidjs/router';
import { createMemo, createResource, For } from 'solid-js';

import { useApp } from '@/app';
import { Button, Checkbox, Page } from '@/components';

interface Resource {
    id: string;
    title: string;
    items?: Array<Resource>;
}

interface RoleResource {
    current: Array<string>;
    parent: Array<string>;
}

export default function() {
    const ctx = useApp();
    const ps = useParams<{id: string}>();

    const [resources] = createResource(async () => {
        const ret = await ctx.get<Array<Resource>>('/resources');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return;
        }
        return ret.body;
    });

    const [roleResources] = createResource(async () => {
        const ret = await ctx.get<RoleResource>(`/roles/${ps.id}/resources`);
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return;
        }
        return ret.body;
    });

    const parent = createMemo(() => {
        return roleResources()?.parent ?? [];
    });

    const current = createMemo(() => {
        return roleResources()?.current ?? [];
    });

    return <Page title='_i.page.roles.permission'>
        <div class="p--roles-permissions">
            <For each={resources()}>
                {(res)=>(
                    <details class="p--roles-permission">
                        <summary>{ res.title }</summary>
                        <div class="content">
                            <For each={res.items}>
                                {(item)=>(
                                    <Checkbox label={item.title}
                                        disabled={ !parent().includes(item.id)}
                                        checked={ !!current().includes(item.id)}
                                        onChange={(chk)=>{
                                            if (chk) {
                                                if (!current().includes(item.id)) {
                                                    if (roleResources()!.current === null) {
                                                        roleResources()!.current = [];
                                                    }
                                                    roleResources()!.current.push(item.id);
                                                }
                                                return;
                                            }
                                            if (current()) {
                                                roleResources()!.current = current().filter((v) => v !== item.id)!;
                                            }
                                        }}
                                    />
                                )}
                            </For>
                        </div>
                    </details>
                )}
            </For>

            <div class="flex justify-end gap-2">
                <Button palette='tertiary'>{ctx.t('_i.cancel')}</Button>
                <Button palette='primary'>{ctx.t('_i.ok')}</Button>
            </div>
        </div>
    </Page>;
}
