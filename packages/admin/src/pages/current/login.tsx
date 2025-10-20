// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, fieldAccessor, joinClass, Page } from '@cmfx/components';
import { Navigate, useSearchParams } from '@solidjs/router';
import { createSignal, For, JSX, Match, onMount, Show, Switch } from 'solid-js';

import { user } from '@/components';
import { useAdmin, useLocale } from '@/context';
import { PassportComponents } from './passports';
import styles from './style.module.css';

export interface Props {
    /**
     * 登录页面底部的链接
     */
    footer?: Array<Link>;

    passports: Map<string, PassportComponents>;
}

interface Link {
    title: string;
    link?: string;
}

/**
 * 登录页面
 */
export function Login(props: Props): JSX.Element {
    const [, act, opt] = useAdmin();

    return <Switch>
        <Match when={act.isLogin()}><Navigate href={opt.routes.private.home} /></Match>
        <Match when={!act.isLogin()}><LoginBox {...props} /></Match>
    </Switch>;
}

function LoginBox(props: Props): JSX.Element {
    const [api, act] = useAdmin();
    const l = useLocale();
    const [q,setQ] = useSearchParams<{ type: string }>();

    api.cache('/passports');

    const [passports, setPassports] = createSignal<Array<[string,string]>>([]);
    const passport = fieldAccessor('passport', q.type ?? 'password');
    passport.onChange(n => setQ({ type: n }));

    onMount(async () => {
        const r = await api.get<Array<user.Passport>>('/passports');
        if (!r.ok) {
            await act.outputProblem(r.body);
            return;
        }
        setPassports(r.body!.map(v => [v.id, v.desc]));
    });

    return <Page title="_p.current.login" class={joinClass(undefined, styles.login)}>
        <div class={styles.form}>
            <div class={styles.title}>
                <p class="text-2xl">{l.t('_p.current.login')}</p>
                <Choice accessor={passport} options={passports()
                    .map(v => ({ type: 'item', value: v[0], label: l.t(v[1]) }))}
                />
            </div>
            {props.passports.get(passport.getValue())?.Login()}
        </div>

        <Show when={props.footer && props.footer.length > 0}>
            <footer>
                <For each={props.footer}>
                    {item => (
                        <Switch fallback={<p innerHTML={item.title} />}>
                            <Match when={item.link}>
                                <a href={item.link} innerHTML={item.title} />
                            </Match>
                        </Switch>
                    )}
                </For>
            </footer>
        </Show>
    </Page>;
}
