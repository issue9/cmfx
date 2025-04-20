// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page } from '@cmfx/components';
import { useParams } from '@solidjs/router';
import { Component, createSignal, For, JSX, onMount, Show } from 'solid-js';

import { useAdmin, useOptions } from '@admin/context';
import { Passport, sexesMap, statesMap } from '@admin/pages/common';
import { Member } from './types';


export interface PanelProps {
    /**
     * 传递给组件的当前对象
     */
    member: Member;
}

export interface Props {
    /**
     * 自定义组件的面板
     */
    panels?: Component<PanelProps>;
}

export function View(props: Props): JSX.Element {
    const ctx = useAdmin();
    const opt = useOptions();
    const id = parseInt(useParams().id);
    const [member, setMember] = createSignal<Member>({
        id: 0,
        no: '',
        nickname: '',
        sex: 'unknown',
        state: 'normal'
    });

    const [passports, setPassports] = createSignal<Array<Passport>>([]);

    onMount(async () => {
        const r = await ctx.api.get<Member>(`/members/${id}`);
        if (!r.ok) {
            await ctx.outputProblem(r.body);
            return;
        }

        const mem = r.body!;
        if (!mem.avatar) {
            mem.avatar = opt.logo;
        }
        setMember(r.body!);

        const r2 = await ctx.api.get<Array<Passport>>('/passports');
        if (!r2.ok) {
            await ctx.outputProblem(r2.body);
            return;
        }
        setPassports(r2.body!);
    });

    return <Page title='_i.page.member.view' class="max-w-lg p--member-view">
        <div class="info">
            <img class="avatar" src={ member().avatar } alt="avatar" />

            <div class="item">
                <dl><dt class="mr-2">{ctx.locale().t('_i.page.id')}</dt><dd>{ member().id }</dd></dl>
                <dl><dt class="mr-2">{ctx.locale().t('_i.page.no')}</dt><dd>{ member().no }</dd></dl>
            </div>

            <div class="item">
                <dl><dt class="mr-2">{ctx.locale().t('_i.page.created')}</dt><dd>{ ctx.locale().datetime(member().created) }</dd></dl>
                <dl><dt class="mr-2">{ctx.locale().t('_i.page.member.birthday')}</dt><dd>{ ctx.locale().datetime(member().birthday) }</dd></dl>
            </div>

            <div class="item">
                <dl><dt class="mr-2">{ctx.locale().t('_i.page.nickname')}</dt><dd>{ member().nickname }</dd></dl>
                <dl><dt class="mr-2">{ctx.locale().t('_i.page.sex')}</dt><dd>{ ctx.locale().t(sexesMap.find((v)=>v[0]===member().sex)![1]) }</dd></dl>
            </div>

            <div class="item">
                <dl><dt class="mr-2">{ctx.locale().t('_i.page.state')}</dt><dd>{ ctx.locale().t(statesMap.find((v)=>v[0]===member().state)![1]) }</dd></dl>
                <dl>
                    <dt class="mr-2">{ctx.locale().t('_i.page.member.passports')}</dt>
                    <dd class="flex gap-2">
                        <For each={passports()}>
                            {(item)=>(
                                <Show when={member().passports && member().passports?.find((v)=>v.id===item.id)}>
                                    <span title={item.desc}>{ item.id }</span>
                                </Show>
                            )}
                        </For>
                    </dd>
                </dl>
            </div>
        </div>

        <Show when={props.panels}>
            {props.panels!({ member: member() })}
        </Show>
    </Page>;
}