// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, DialogRef, Form, FormAPI, FormRef, Password, TextField, useLocale } from '@cmfx/components';
import { Token, zodValidator } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';
import { z } from 'zod';
import IconPasskey from '~icons/material-symbols/passkey';
import IconPassword from '~icons/material-symbols/password-2';
import IconPerson from '~icons/material-symbols/person';

import { handleProblem, useAdmin, useOptions, useREST } from '@admin/app';
import { usernameSchema } from '@admin/schemas';
import { PassportComponents, RefreshFunc } from './passports';
import styles from './style.module.css';

const passwordSchema = z.string().min(2).max(32);

const accountSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
});

/**
 * 密码登录方式
 */
export class Pwd implements PassportComponents {
	#id: string;

	/**
	 * 构造函数
	 *
	 * @param id - 组件的 ID；
	 */
	constructor(id: string) {
		this.#id = id;
	}

	Login(): JSX.Element {
		const l = useLocale();
		const rest = useREST();
		const opt = useOptions();
		const usr = useAdmin();
		const nav = useNavigate();

		let ref!: FormRef;
		const api = new FormAPI<z.infer<typeof accountSchema>, Token>({
			initValue: { username: '', password: '' },
			validator: zodValidator<z.infer<typeof accountSchema>>(accountSchema.clone(), l),
			validOnChange: true,
			submit: async obj => {
				const ret = await rest.post<Token>(`/passports/${this.#id}/login`, obj);
				await usr.login(ret);
				return ret;
			},
			onProblem: async p => {
				if (p.status === 401) {
					api.setError(p.title);
					return;
				}

				await handleProblem(p);
			},
			onSuccess: async () => nav(opt.routes.private.home),
		});

		return (
			<Form class={styles.password} api={api} ref={el => (ref = el)}>
				<ref.Message closable />

				<TextField
					hasHelp
					prefix={<IconPerson class={styles['text-field']} />}
					autocomplete="username"
					placeholder={l.t('_p.current.username')}
					accessor={api.accessor<string>('username')}
				/>
				<Password
					hasHelp
					prefix={<IconPassword class={styles['text-field']} />}
					autocomplete="current-password"
					placeholder={l.t('_p.current.password')}
					accessor={api.accessor<string>('password')}
				/>

				<ref.Submit palette="primary" disabled={api.accessor<string>('username').getValue() === ''}>
					{l.t('_c.ok')}
				</ref.Submit>
				<ref.Reset palette="secondary"> {l.t('_c.reset')} </ref.Reset>
			</Form>
		);
	}

	Actions(_: RefreshFunc): JSX.Element {
		let dialogRef: DialogRef;
		const l = useLocale();
		const rest = useREST();
		const usr = useAdmin();

		const valueSchema = z
			.object({
				old: passwordSchema,
				new: passwordSchema,
			})
			.refine(data => data.old !== data.new, {
				error: () => l.t('_p.current.passwordsMustBeDifferent'),
				abort: true,
				path: ['new'],
			});

		let ref!: FormRef;
		const api = new FormAPI<z.infer<typeof valueSchema>>({
			initValue: { old: '', new: '' },
			validator: zodValidator<z.infer<typeof valueSchema>>(valueSchema.clone(), l),
			validOnChange: true,
			submit: async obj => {
				const r = await rest.put(`/passports/${this.#id}`, obj);
				await usr.refetch();
				return r;
			},
			onProblem: handleProblem,
		});

		return (
			<>
				<Button
					square
					rounded
					title={l.t('_p.current.changePassword')}
					onclick={() => {
						dialogRef.root().showModal();
					}}
				>
					<IconPasskey />
				</Button>

				<Dialog
					movable
					ref={el => {
						dialogRef = el;
					}}
					header={l.t('_p.current.changePassword')}
				>
					<Form class={styles['action-form']} inDialog api={api} ref={el => (ref = el)}>
						<TextField placeholder={l.t('_p.current.oldPassword')} accessor={api.accessor<string>('old')} />
						<TextField placeholder={l.t('_p.current.newPassword')} accessor={api.accessor<string>('new')} />
						<ref.Submit class="ms-auto">{l.t('_c.ok')}</ref.Submit>
					</Form>
				</Dialog>
			</>
		);
	}
}
