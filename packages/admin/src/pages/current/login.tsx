// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, BaseProps, Choice, ChoiceOption, fieldAccessor,
    joinClass, Mode, modes, Page, Transition, useLocale, useOptions
} from '@cmfx/components';
import { I18n } from '@cmfx/core';
import { Navigate, useSearchParams } from '@solidjs/router';
import { createResource, ErrorBoundary, For, JSX, Match, Show, Switch } from 'solid-js';

import { handleProblem, useAdmin, useOptions as useAdminOptions, useREST } from '@admin/app';
import { errorHandler } from '@admin/app/context';
import { Passport } from '@admin/components';
import { PassportComponents } from './passports';
import styles from './style.module.css';

export interface Props extends BaseProps {
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
    const opt = useAdminOptions();
    const usr = useAdmin();
    const [, xo] = useOptions();

    return <Switch>
        <Match when={usr.loading()}>{xo.loading({})}</Match>
        <Match when={usr.info()}><Navigate href={opt.routes.private.home} /></Match>
        <Match when={!usr.info()}><LoginBox {...props} /></Match>
    </Switch>;
}

function LoginBox(props: Props): JSX.Element {
    const api = useREST();
    const l = useLocale();
    const [q, setQ] = useSearchParams<{ type: string }>();
    const [, opt] = useOptions();

    api.api().cache('/passports');

    const passport = fieldAccessor('passport', q.type ?? 'password');
    passport.onChange(n => setQ({ type: n }));

    const [passports] = createResource<Array<ChoiceOption>>(async () => {
        const r = await api.get<Array<Passport>>('/passports');
        if (!r.ok) {
            await handleProblem(r.body!);
            return [];
        }
        return r.body!.map(v => ({ type: 'item', value: v.id, label: v.desc }));
    });

    return <Page backtop={false} title="_p.current.login" class={joinClass(props.palette, styles.login, props.class)}>
        <Appbar class={styles.toolbar} title={opt.title} logo={opt.logo} actionsClass={styles.actions}
            actions={<Actions />}
        />

        <ErrorBoundary fallback={errorHandler}>
            <div class={styles.form}>
                <div class={styles.title}>
                    <p>{l.t('_p.current.login')}</p>
                    <Choice accessor={passport} options={!passports.loading ? passports()! : []} />
                </div>
                <div>
                    <Transition>
                        {props.passports.get(passport.getValue())?.Login()}
                    </Transition>
                </div>
            </div>
        </ErrorBoundary>

        <Show when={props.footer && props.footer.length > 0}>
            <footer>
                <For each={props.footer}>
                    {item =>
                        <Switch fallback={<p innerHTML={item.title} />}>
                            <Match when={item.link}>
                                <a href={item.link} innerHTML={item.title} />
                            </Match>
                        </Switch>
                    }
                </For>
            </footer>
        </Show>
    </Page>;
}

function Actions(): JSX.Element {
    const l = useLocale();
    const [accessor] = useOptions();

    const localeFA = fieldAccessor<string>('locale', I18n.matchLanguage(accessor.getLocale()));
    localeFA.onChange(v => accessor.setLocale(v));

    const modeFA = fieldAccessor<Mode>('mode', accessor.getMode());
    modeFA.onChange(m => accessor.setMode(m));

    return <>
        <Choice accessor={localeFA}
            options={l.locales.map(v => ({ type: 'item', value: v[0], label: v[1] }))}
        />

        <Choice accessor={modeFA}
            options={modes.map(v => ({ type: 'item', value: v, label: l.t(`_c.settings.${v}`) }))}
        />
    </>;
}
