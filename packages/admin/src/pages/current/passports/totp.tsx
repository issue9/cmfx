// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ConfirmButton, createForm, Dialog, DialogRef, QRCode, TextField, useLocale } from '@cmfx/components';
import { Token, zodValidator } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { createSignal, JSX, Show } from 'solid-js';
import { z } from 'zod';
import IconAddLink from '~icons/material-symbols/add-link';
import IconLinkOff from '~icons/material-symbols/link-off';
import IconPerson from '~icons/material-symbols/person';
import IconPin from '~icons/material-symbols/pin';

import { handleProblem, useAdmin, useOptions, useREST } from '@admin/app';
import { usernameSchema } from '@admin/schemas';
import { encodeBase32 } from './base';
import { PassportComponents, RefreshFunc } from './passports';
import styles from './style.module.css';

const codeSchema = z.string().min(2).max(32);

const accountSchema = z.object({
	username: usernameSchema,
	code: codeSchema.clone(),
});

// 请求绑定时返回的字段
type Secret = {
	secret: string;
	username: string;
};

/**
 * TOTP 登录方式
 */
export class TOTP implements PassportComponents {
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
		const api = useREST();
		const opt = useOptions();
		const nav = useNavigate();
		const usr = useAdmin();

		const [fapi, Form, actions] = createForm<z.infer<typeof accountSchema>, Token>({
			initValue: { username: '', code: '' },
			validator: zodValidator<z.infer<typeof accountSchema>>(accountSchema.clone(), l),
			validOnChange: true,
			submit: async obj => {
				const ret = await api.post<Token>(`/passports/${this.#id}/login`, obj);
				await usr.login(ret);
				return ret;
			},
			onProblem: async p => {
				if (p.status === 401) {
					fapi.setError(p.title);
					return;
				}

				await handleProblem(p);
			},
			onSuccess: async () => nav(opt.routes.private.home),
		});

		return (
			<Form class={styles.totp}>
				<actions.Message />

				<TextField
					hasHelp
					prefix={<IconPerson class={styles['text-field']} />}
					autocomplete="username"
					placeholder={l.t('_p.current.username')}
					accessor={fapi.accessor<string>('username')}
				/>
				<TextField
					hasHelp
					prefix={<IconPin class={styles['text-field']} />}
					autocomplete="one-time-code"
					placeholder={l.t('_p.current.verifyCode')}
					accessor={fapi.accessor<string>('code')}
				/>

				<actions.Submit palette="primary" disabled={fapi.accessor<string>('username').getValue() === ''}>
					{l.t('_c.ok')}
				</actions.Submit>
				<actions.Reset palette="secondary"> {l.t('_c.reset')} </actions.Reset>
			</Form>
		);
	}

	Actions(f: RefreshFunc, username?: string): JSX.Element {
		const l = useLocale();
		const api = useREST();
		const opt = useOptions();
		const usr = useAdmin();

		let dialogRef: DialogRef;
		const [qr, setQR] = createSignal<string>('');

		const requestSchema = z.object({
			code: codeSchema.clone(),
		});

		const [fapi, Form, actions] = createForm<z.infer<typeof requestSchema>>({
			initValue: { code: '' },
			validator: zodValidator<z.infer<typeof requestSchema>>(requestSchema.clone(), l),
			validOnChange: true,
			submit: async obj => {
				const r = await api.post(`/passports/${this.#id}`, obj);
				await usr.refetch();
				return r;
			},
			onProblem: handleProblem,
		});

		return (
			<>
				<Show when={username}>
					<ConfirmButton
						palette="error"
						square
						rounded
						title={l.t('_p.current.unbindTOTP')}
						onclick={async () => {
							const r = await api.delete(`/passports/${this.#id}`);
							if (!r.ok) {
								await handleProblem(r.body!);
								return;
							}
							await f();
						}}
					>
						<IconLinkOff />
					</ConfirmButton>
				</Show>

				<Show when={!username}>
					<Button
						square
						rounded
						title={l.t('_p.current.bindTOTP')}
						onclick={async () => {
							const r = await api.post<Secret>(`/passports/${this.#id}/secret`);
							if (!r.ok) {
								await handleProblem(r.body!);
								return;
							}

							const s = r.body! as Secret;
							s.secret = encodeBase32(s.secret);
							setQR(`otpauth://totp/${opt.title}:${s.username}?secret=${s.secret}&issuer=${opt.title}`);
							dialogRef.root().showModal();
						}}
					>
						<IconAddLink />
					</Button>

					<Dialog
						ref={el => {
							dialogRef = el;
						}}
						header={l.t('_p.current.bindTOTP')}
					>
						<Form class={styles['action-form']} inDialog>
							<p title={qr()}>
								<QRCode type="rounded" value={qr()} />
							</p>
							<br />
							<TextField hasHelp placeholder={l.t('_p.current.verifyCode')} accessor={fapi.accessor('code')} />
							<actions.Submit class="ms-auto">{l.t('_c.ok')}</actions.Submit>
						</Form>
					</Dialog>
				</Show>
			</>
		);
	}
}
