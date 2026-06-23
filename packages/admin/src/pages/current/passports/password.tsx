// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, Form, InputPassword, InputText, useLocale, useREST } from '@cmfx/components';
import { type Token, zodValidator } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import type { JSX } from 'solid-js';
import { z } from 'zod';
import IconPasskey from '~icons/material-symbols/passkey';
import IconPassword from '~icons/material-symbols/password-2';
import IconPerson from '~icons/material-symbols/person';

import { useAdmin, useOptions } from '@admin/app';
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
		const [rest, handleProblem] = useREST();
		const opt = useOptions();
		const usr = useAdmin();
		const nav = useNavigate();

		const [F, Field, api] = Form.create<z.infer<typeof accountSchema>, Token>({
			initValue: { username: '', password: '' },
			validator: zodValidator<z.infer<typeof accountSchema>>(accountSchema.clone(), l),
			validOnChange: true,
			submit: async obj => {
				const ret = await rest.post<Token>(`/passports/${this.#id}/login`, obj);
				await usr.login(ret);
				return ret;
			},
			onProblem: async p => {
				if (p) {
					if (p.status === 401) {
						api.setError(p.title);
						return;
					}
				}
				await handleProblem(p);
			},
			onSuccess: async () => nav(opt.routes.private.home),
		});

		return (
			<F class={styles.password}>
				<Form.Message closable />

				<Field name="username">
					<InputText
						prefix={<IconPerson class={styles['text-field']} />}
						autocomplete="username"
						placeholder={l.t('_p.current.username')}
					/>
				</Field>

				<Field name="password">
					<InputPassword
						prefix={<IconPassword class={styles['text-field']} />}
						autocomplete="current-password"
						placeholder={l.t('_p.current.password')}
					/>
				</Field>

				<Form.Submit palette="primary" disabled={api.getValue().username === ''}>
					{l.t('_c.ok')}
				</Form.Submit>
				<Form.Reset palette="secondary"> {l.t('_c.reset')} </Form.Reset>
			</F>
		);
	}

	Actions(_: RefreshFunc): JSX.Element {
		let dialogRef: Dialog.Ref;
		const l = useLocale();
		const [rest, handleProblem] = useREST();
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

		const [F, Field] = Form.create<z.infer<typeof valueSchema>>({
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
					ref={el => (dialogRef = el)}
					header={
						<Dialog.Toolbar movable close>
							{l.t('_p.current.changePassword')}
						</Dialog.Toolbar>
					}
				>
					<F class={styles['action-form']} inDialog>
						<Field name="old">
							<InputText placeholder={l.t('_p.current.oldPassword')} />
						</Field>

						<Field name="new">
							<InputText placeholder={l.t('_p.current.newPassword')} />
						</Field>

						<Form.Submit class="ms-auto">{l.t('_c.ok')}</Form.Submit>
					</F>
				</Dialog>
			</>
		);
	}
}
