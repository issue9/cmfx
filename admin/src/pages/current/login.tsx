// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate, useNavigate } from '@solidjs/router';
import { createSignal, For, JSX, Match, onMount, Show, Switch } from 'solid-js';

import { useApp, useOptions } from '@/app/context';
import { buildEnumsOptions, Button, Choice, FieldAccessor, Icon, ObjectAccessor, Page, Password, TextField } from '@/components';
import { Account } from '@/core';

interface Props {
    /**
     * 用以指定登录页面的 background-image 属性
     */
    bg?: string;

    /**
     * 登录页面底部的链接
     */
    footer?: Array<Link>;
}

interface Link {
    title: string;
    link?: string;
}

/**
 * 登录页面
 */
export default function (props: Props): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();

    return <Switch>
        <Match when={ctx.isLogin()}><Navigate href={opt.routes.private.home} /></Match>
        <Match when={!ctx.isLogin()}><Login {...props} /></Match>
    </Switch>;
}

export function Login(props: Props): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    const nav = useNavigate();

    const [passports, setPassports] = createSignal<Array<[string,string]>>([]);
    const passport = FieldAccessor('passport', 'password');

    onMount(async () => {
        const r = await ctx.api.get<Array<Passport>>('/passports');
        if (!r.ok) {
            ctx.outputProblem(r.body);
            return;
        }
        setPassports(r.body!.map((v)=>[v.name,v.desc]));
    });

    const f = new ObjectAccessor<Account>({ username: '', password: '' });

    return <Page title="_i.page.current.login" class="p--login" style={{'background-image':props.bg}}>
        <form onReset={()=>f.reset()} onSubmit={async()=>{
            const ret = await ctx.login(f.object(), passport.getValue());
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await ctx.outputProblem(ret);
            }
        }}>
            <div class="title">
                <p class="text-2xl">{ctx.locale().t('_i.page.current.login')}</p>
                <Choice accessor={passport} options={buildEnumsOptions(passports(), ctx)}/>
            </div>

            <TextField prefix={<Icon class="!py-0 !px-1 flex items-center" icon='person' />}
                placeholder={ctx.locale().t('_i.page.current.username')} accessor={f.accessor('username', true)} />

            <Password icon='password_2' placeholder={ctx.locale().t('_i.page.current.password')} accessor={f.accessor('password', true)} />

            <Button palette='primary' disabled={f.accessor('username').getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>

            <Button palette='secondary' disabled={f.isPreset()} type="reset">{ ctx.locale().t('_i.reset') }</Button>
        </form>

        <Show when={props.footer && props.footer.length > 0}>
            <footer>
                <For each={props.footer}>
                    {(item)=>(
                        <Switch fallback={<p innerHTML={item.title} />}>
                            <Match when={item.link}>
                                <a href={ item.link } innerHTML={item.title} />
                            </Match>
                        </Switch>
                    )}
                </For>
            </footer>
        </Show>
    </Page>;
}

interface Passport {
    name: string;
    desc: string;
}
