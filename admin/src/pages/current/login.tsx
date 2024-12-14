// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate } from '@solidjs/router';
import { createSignal, For, JSX, Match, onMount, Show, Switch } from 'solid-js';

import { useApp, useOptions } from '@/components';
import { buildEnumsOptions, Choice, FieldAccessor, Page } from '@/components';
import { Passport } from '@/pages/common';
import { PassportComponents } from './passport';

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
    const ctx = useApp();
    const opt = useOptions();

    return <Switch>
        <Match when={ctx.isLogin()}><Navigate href={opt.routes.private.home} /></Match>
        <Match when={!ctx.isLogin()}><LoginBox {...props} /></Match>
    </Switch>;
}

function LoginBox(props: Props): JSX.Element {
    const ctx = useApp();

    ctx.api.cache('/passports');

    const [passports, setPassports] = createSignal<Array<[string,string]>>([]);
    const passport = FieldAccessor('passport', 'password');

    onMount(async () => {
        const r = await ctx.api.get<Array<Passport>>('/passports');
        if (!r.ok) {
            await ctx.outputProblem(r.body);
            return;
        }
        setPassports(r.body!.map((v)=>[v.id,v.desc]));
    });

    return <Page title="_i.page.current.login" class="p--login" style={{ 'background-image': props.bg }}>
        <div class="form">
            <div class="title">
                <p class="text-2xl">{ctx.locale().t('_i.page.current.login')}</p>
                <Choice accessor={passport} options={buildEnumsOptions(passports(), ctx)} />
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
