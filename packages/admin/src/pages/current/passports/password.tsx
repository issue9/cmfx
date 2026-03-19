// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, Form, FormAPI, Password, TextField, useLocale } from '@cmfx/components';
import { type Token, zodValidator } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import type { JSX } from 'solid-js';
import { z } from 'zod';
import IconPasskey from '~icons/material-symbols/passkey';
import IconPassword from '~icons/material-symbols/password-2';
import IconPerson from '~icons/material-symbols/person';

import { handleProblem, useAdmin, useOptions, useREST } from '@admin/app';
import { usernameSchema } from '@admin/schemas';
import type { PassportComponents, RefreshFunc } from './passports';
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
	readonly #id: string;

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

		let ref!: Form.RootRef;
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
			<Form.Root class={styles.password} api={api} ref={el => (ref = el)}>
				<ref.Message closable />

				<TextField.Root
					hasHelp
					prefix={<IconPerson class={styles['text-field']} />}
					autocomplete="username"
					placeholder={l.t('_p.current.username')}
					accessor={api.accessor<string>('username')}
				/>
				<Password.Root
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
			</Form.Root>
		);
	}

	Actions(_: RefreshFunc): JSX.Element {
		let dialogRef: Dialog.RootRef;
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

		let ref!: Form.RootRef;
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
				<Button.Root
					square
					rounded
					title={l.t('_p.current.changePassword')}
					onclick={() => {
						dialogRef.root().showModal();
					}}
				>
					<IconPasskey />
				</Button.Root>

				<Dialog.Root
					ref={el => dialogRef = el}
					header={<Dialog.Toolbar movable close>{l.t('_p.current.changePassword')}</Dialog.Toolbar>}
				>
					<Form.Root class={styles['action-form']} inDialog api={api} ref={el => (ref = el)}>
						<TextField.Root placeholder={l.t('_p.current.oldPassword')} accessor={api.accessor<string>('old')} />
						<TextField.Root placeholder={l.t('_p.current.newPassword')} accessor={api.accessor<string>('new')} />
						<ref.Submit class="ms-auto">{l.t('_c.ok')}</ref.Submit>
					</Form.Root>
				</Dialog.Root>
			</>
		);
	}
}
