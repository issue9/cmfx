// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate, useParams } from '@solidjs/router';
import { createEffect, createResource, createSignal, For, JSX } from 'solid-js';

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

export function Permission(): JSX.Element {
    const ctx = useApp();
    const ps = useParams<{id: string}>();
    const nav = useNavigate();
    const [parent, setParent] = createSignal<Array<string>>([], {equals: false});
    const [current, setCurrent] = createSignal<Array<string>>([], {equals: false});
    const [resources, setResources] = createSignal<Array<Resource>>([], {equals: false});

    const [roleResource] = createResource(async () => {
        const ret = await ctx.api.get<RoleResource>(`/roles/${ps.id}/resources`);
        if (!ret.ok) {
            await ctx.outputProblem(ret.body);
            return;
        }
        return  ret.body;
    });

    createEffect(async () => {
        if (roleResource.state === 'ready') {
            const b = roleResource();
            setParent(b ? (b.parent ?? []) : []);
            setCurrent(b ? (b.current ?? []) : []);

            const ret = await ctx.api.get<Array<Resource>>('/resources');
            if (!ret.ok) {
                await ctx.outputProblem(ret.body);
                return;
            }
            setResources(ret.body!);
        }
    });

    const save = async()=>{
        const ret = await ctx.api.put(`/roles/${ps.id}/resources`, current());
        if (!ret.ok) {
            await ctx.outputProblem(ret.body);
            return;
        }
        nav(-1);
    };

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
                                        checked={ current().includes(item.id)}
                                        onChange={(chk)=>{
                                            if (chk) {
                                                if (!current().includes(item.id)) {
                                                    setCurrent((prev)=>[...prev, item.id]);
                                                }
                                            } else {
                                                setCurrent((prev)=>prev.filter((v)=>v!==item.id));
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
                <Button palette='secondary' onClick={()=>nav(-1)}>{ctx.locale().t('_i.cancel')}</Button>
                <Button palette='primary' onClick={()=>save()}>{ctx.locale().t('_i.ok')}</Button>
            </div>
        </div>
    </Page>;
}
