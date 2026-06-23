// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BaseProps, Mode } from '@cmfx/components';
import { Appbar, Choice, joinClass, modes, Page, Transition, useLocale, useOptions, useREST } from '@cmfx/components';
import { I18n } from '@cmfx/core';
import { Navigate, useSearchParams } from '@solidjs/router';
import type { JSX } from 'solid-js';
import { createEffect, createResource, createSignal, ErrorBoundary, For, Match, Show, Switch } from 'solid-js';

import { useAdmin, useOptions as useAdminOptions } from '@admin/app';
import { errorHandler } from '@admin/app/context';
import type { Passport } from '@admin/components';
import type { PassportComponents } from './passports';
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

	return (
		<Switch>
			<Match when={usr.loading()}>{xo.loading({})}</Match>
			<Match when={usr.info()}>
				<Navigate href={opt.routes.private.home} />
			</Match>
			<Match when={!usr.info()}>
				<LoginBox {...props} />
			</Match>
		</Switch>
	);
}

function LoginBox(props: Props): JSX.Element {
	const [rest, handleProblem] = useREST();
	const l = useLocale();
	const [q, setQ] = useSearchParams<{ type: string }>();
	const [, opt] = useOptions();
	const adminOpt = useAdminOptions();

	rest.api().cache('/passports');

	const [passport, setPassport] = createSignal(q.type ?? 'password');
	createEffect(() => {
		setQ({ type: passport() });
	});

	const [passports] = createResource<Array<Choice.Option>>(async () => {
		const r = await rest.get<Array<Passport>>('/passports');
		if (!r.ok) {
			await handleProblem(r.body);
			return [];
		}
		return r.body!.map(v => ({ type: 'item', value: v.id, label: v.desc }));
	});

	return (
		<Page backTop={false} title="_p.current.login" class={joinClass(props.palette, styles.login, props.class)}>
			<Appbar
				class={styles.toolbar}
				title={opt.title}
				logo={<Appbar.Image src={opt.logo} alt={opt.title} />}
				actionsClass={styles.actions}
				href={adminOpt.routes.public.home}
				actions={<Actions />}
			/>

			<ErrorBoundary fallback={errorHandler}>
				<div class={styles.form}>
					<div class={styles.title}>
						<p>{l.t('_p.current.login')}</p>
						<Choice value={passport()} onChange={setPassport} options={!passports.loading ? passports()! : []} />
					</div>
					<div>
						<Transition>{props.passports.get(passport())?.Login()}</Transition>
					</div>
				</div>
			</ErrorBoundary>

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
		</Page>
	);
}

function Actions(): JSX.Element {
	const l = useLocale();
	const [accessor] = useOptions();

	const [localeFA, setLocaleFA] = createSignal<string>(I18n.matchLanguage(accessor.getLocale()));
	createEffect(() => {
		accessor.setLocale(localeFA());
	});

	const [modeFA, setModeFA] = createSignal<Mode>(accessor.getMode());
	createEffect(() => {
		accessor.setMode(modeFA());
	});

	return (
		<>
			<Choice
				value={localeFA()}
				onChange={setLocaleFA}
				options={l.locales.map(v => ({ type: 'item', value: v[0], label: v[1] }))}
			/>

			<Choice
				value={modeFA()}
				onChange={setModeFA}
				options={modes.map(v => ({ type: 'item', value: v, label: l.t(`_c.settings.${v}`) }))}
			/>
		</>
	);
}
