// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page } from '@cmfx/components';
import { useParams } from '@solidjs/router';
import { Component, createSignal, For, JSX, onMount, Show } from 'solid-js';

import { user } from '@/components';
import { use, useLocale } from '@/context';
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
    const [api, act, opt] = use();
    const l = useLocale();
    const id = parseInt(useParams().id);
    const [member, setMember] = createSignal<Member>({
        id: 0,
        no: '',
        nickname: '',
        sex: 'unknown',
        state: 'normal'
    });

    const [passports, setPassports] = createSignal<Array<user.Passport>>([]);

    onMount(async () => {
        const r = await api.get<Member>(`/members/${id}`);
        if (!r.ok) {
            await act.outputProblem(r.body);
            return;
        }

        const mem = r.body!;
        if (!mem.avatar) {
            mem.avatar = opt.logo;
        }
        setMember(r.body!);

        const r2 = await api.get<Array<user.Passport>>('/passports');
        if (!r2.ok) {
            await act.outputProblem(r2.body);
            return;
        }
        setPassports(r2.body!);
    });

    return <Page title='_p.member.view' class="max-w-lg p--member-view">
        <div class="info">
            <img class="avatar" src={ member().avatar } alt="avatar" />

            <div class="item">
                <dl><dt class="mr-2">{l.t('_p.id')}</dt><dd>{ member().id }</dd></dl>
                <dl><dt class="mr-2">{l.t('_p.no')}</dt><dd>{ member().no }</dd></dl>
            </div>

            <div class="item">
                <dl><dt class="mr-2">{l.t('_p.created')}</dt><dd>{ l.datetime(member().created) }</dd></dl>
                <dl><dt class="mr-2">{l.t('_p.member.birthday')}</dt><dd>{l.datetime(member().birthday) }</dd></dl>
            </div>

            <div class="item">
                <dl><dt class="mr-2">{l.t('_p.nickname')}</dt><dd>{ member().nickname }</dd></dl>
                <dl><dt class="mr-2">{l.t('_p.sex')}</dt><dd>{ l.t(user.sexes.find((v)=>v[0]===member().sex)![1]) }</dd></dl>
            </div>

            <div class="item">
                <dl><dt class="mr-2">{l.t('_p.state')}</dt><dd>{ l.t(user.states.find((v)=>v[0]===member().state)![1]) }</dd></dl>
                <dl>
                    <dt class="mr-2">{l.t('_p.member.passports')}</dt>
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