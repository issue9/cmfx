// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Checkbox, Page, useLocale } from '@cmfx/components';
import { useNavigate, useParams } from '@solidjs/router';
import { createEffect, createResource, createSignal, For, JSX } from 'solid-js';

import { handleProblem, useREST } from '@/app';
import styles from './style.module.css';

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
    const rest = useREST();
    const l = useLocale();
    const ps = useParams<{id: string}>();
    const nav = useNavigate();
    const [parent, setParent] = createSignal<Array<string>>([], {equals: false});
    const [current, setCurrent] = createSignal<Array<string>>([], {equals: false});
    const [resources, setResources] = createSignal<Array<Resource>>([], {equals: false});

    const [roleResource] = createResource(async () => {
        const ret = await rest.get<RoleResource>(`/roles/${ps.id}/resources`);
        if (!ret.ok) {
            if (ret.status === 404) {
                return;
            }

            await handleProblem(ret.body);
            return;
        }

        return  ret.body;
    });

    createEffect(async () => {
        if (roleResource.state === 'ready') {
            const b = roleResource();
            setParent(b ? (b.parent ?? []) : []);
            setCurrent(b ? (b.current ?? []) : []);

            const ret = await rest.get<Array<Resource>>('/resources');
            if (!ret.ok) {
                await handleProblem(ret.body);
                return;
            }
            setResources(ret.body!);
        }
    });

    const save = async()=>{
        const ret = await rest.put(`/roles/${ps.id}/resources`, current());
        if (!ret.ok) {
            await handleProblem(ret.body);
            return;
        }
        nav(-1);
    };

    return <Page title='_p.roles.permission'>
        <div class={styles.permissions}>
            <For each={resources()}>
                {(res)=>(
                    <details class={styles.permission}>
                        <summary>{ res.title }</summary>
                        <div class={styles.content}>
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
                <Button palette='secondary' onclick={()=>nav(-1)}>{l.t('_c.cancel')}</Button>
                <Button palette='primary' onclick={()=>save()}>{l.t('_c.ok')}</Button>
            </div>
        </div>
    </Page>;
}
