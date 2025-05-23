// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, FieldAccessor, Page, translateEnums2Options } from '@cmfx/components';
import { Navigate, useSearchParams } from '@solidjs/router';
import { createSignal, For, JSX, Match, onMount, Show, Switch } from 'solid-js';

import { user } from '@/components';
import { use, useLocale } from '@/context';
import { PassportComponents } from './passports';

export interface Props {
    /**
     * 用以指定登录页面的 background-image 属性
     */
    bg?: string;

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
    const [, act, opt] = use();

    return <Switch>
        <Match when={act.isLogin()}><Navigate href={opt.routes.private.home} /></Match>
        <Match when={!act.isLogin()}><LoginBox {...props} /></Match>
    </Switch>;
}

function LoginBox(props: Props): JSX.Element {
    const [api, act] = use();
    const l = useLocale();
    const [q,setQ] = useSearchParams<{ type: string }>();

    api.cache('/passports');

    const [passports, setPassports] = createSignal<Array<[string,string]>>([]);
    const passport = FieldAccessor('passport', q.type ?? 'password');
    passport.onChange((n) => setQ({ type: n }));

    onMount(async () => {
        const r = await api.get<Array<user.Passport>>('/passports');
        if (!r.ok) {
            await act.outputProblem(r.body);
            return;
        }
        setPassports(r.body!.map((v)=>[v.id,v.desc]));
    });

    return <Page title="_i.current.login" class="p--login" style={{ 'background-image': props.bg }}>
        <div class="form">
            <div class="title">
                <p class="text-2xl">{l.t('_i.current.login')}</p>
                <Choice class='min-w-40' accessor={passport} options={translateEnums2Options<string>(passports(), l)} />
            </div>
            {props.passports.get(passport.getValue())?.Login()}
        </div>

        <Show when={props.footer && props.footer.length > 0}>
            <footer>
                <For each={props.footer}>
                    {(item) => (
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
