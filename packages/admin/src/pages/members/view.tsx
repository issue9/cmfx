// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, Page, useLocale } from '@cmfx/components';
import { useParams } from '@solidjs/router';
import { Component, createMemo, createSignal, For, JSX, onMount, Show } from 'solid-js';

import { localeSexes, localeStates, Passport } from '@/components';
import { useAdmin } from '@/context';
import styles from './style.module.css';
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
    const [api, act, opt] = useAdmin();
    const l = useLocale();
    const id = parseInt(useParams().id ?? '0');
    const [member, setMember] = createSignal<Member>({
        id: 0,
        no: '',
        nickname: '',
        sex: 'unknown',
        state: 'normal'
    });

    const [passports, setPassports] = createSignal<Array<Passport>>([]);

    onMount(async () => {
        const r = await api.get<Member>(`/members/${id}`);
        if (!r.ok) {
            await act.handleProblem(r.body);
            return;
        }

        const mem = r.body!;
        if (!mem.avatar) {
            mem.avatar = opt.logo;
        }
        setMember(r.body!);

        const r2 = await api.get<Array<Passport>>('/passports');
        if (!r2.ok) {
            await act.handleProblem(r2.body);
            return;
        }
        setPassports(r2.body!);
    });

    const sexes = createMemo(() => { return localeSexes(l); });
    const states = createMemo(() => { return localeStates(l); });

    return <Page title='_p.member.view' class={joinClass(undefined, 'max-w-lg', styles.view)}>
        <div class={styles.info}>
            <img class={styles.avatar} src={member().avatar} alt="avatar" />

            <div class={styles.item}>
                <dl><dt class="me-2">{l.t('_p.id')}</dt><dd>{member().id}</dd></dl>
                <dl><dt class="me-2">{l.t('_p.no')}</dt><dd>{member().no}</dd></dl>
            </div>

            <div class={styles.item}>
                <dl>
                    <dt class="me-2">{l.t('_p.created')}</dt>
                    <dd>{member().created ? l.datetimeFormat().format(new Date(member().created!)) : ''}</dd>
                </dl>
                <dl>
                    <dt class="me-2">{l.t('_p.member.birthday')}</dt>
                    <dd>{member().birthday ? l.datetimeFormat().format(new Date(member().birthday!)) : ''}</dd>
                </dl>
            </div>

            <div class={styles.item}>
                <dl><dt class="me-2">{l.t('_p.nickname')}</dt><dd>{member().nickname}</dd></dl>
                <dl><dt class="me-2">{l.t('_p.sex')}</dt><dd>{sexes().find(v => v.value === member().sex)?.label}</dd></dl>
            </div>

            <div class={styles.item}>
                <dl><dt class="me-2">{l.t('_p.state')}</dt><dd>{states().find(v => v.value === member().state)?.label}</dd></dl>
                <dl>
                    <dt class="me-2">{l.t('_p.member.passports')}</dt>
                    <dd class="flex gap-2">
                        <For each={passports()}>
                            {(item) => (
                                <Show when={member().passports && member().passports?.find((v) => v.id === item.id)}>
                                    <span title={item.desc}>{item.id}</span>
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
