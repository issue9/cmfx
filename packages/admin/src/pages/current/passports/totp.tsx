// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ConfirmButton, Dialog, Form, QRCode, TextField, useLocale } from '@cmfx/components';
import { type Token, zodValidator } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { createSignal, type JSX, Show } from 'solid-js';
import { z } from 'zod';
import IconAddLink from '~icons/material-symbols/add-link';
import IconLinkOff from '~icons/material-symbols/link-off';
import IconPerson from '~icons/material-symbols/person';
import IconPin from '~icons/material-symbols/pin';

import { handleProblem, useAdmin, useOptions, useREST } from '@admin/app';
import { usernameSchema } from '@admin/schemas';
import { encodeBase32 } from './base';
import type { PassportComponents, RefreshFunc } from './passports';
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
		const nav = useNavigate();
		const usr = useAdmin();

		let ref!: Form.RootRef;
		const api = new Form.API<z.infer<typeof accountSchema>, Token>({
			initValue: { username: '', code: '' },
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
			<Form.Root class={styles.totp} ref={el => (ref = el)} api={api}>
				<ref.Message />

				<TextField.Root
					hasHelp
					prefix={<IconPerson class={styles['text-field']} />}
					autocomplete="username"
					placeholder={l.t('_p.current.username')}
					accessor={api.accessor<string>('username')}
				/>
				<TextField.Root
					hasHelp
					prefix={<IconPin class={styles['text-field']} />}
					autocomplete="one-time-code"
					placeholder={l.t('_p.current.verifyCode')}
					accessor={api.accessor<string>('code')}
				/>

				<ref.Submit palette="primary" disabled={api.accessor<string>('username').getValue() === ''}>
					{l.t('_c.ok')}
				</ref.Submit>
				<ref.Reset palette="secondary"> {l.t('_c.reset')} </ref.Reset>
			</Form.Root>
		);
	}

	Actions(f: RefreshFunc, username?: string): JSX.Element {
		const l = useLocale();
		const rest = useREST();
		const opt = useOptions();
		const usr = useAdmin();

		let dialogRef: Dialog.RootRef;
		const [qr, setQR] = createSignal<string>('');

		const requestSchema = z.object({
			code: codeSchema.clone(),
		});

		let ref!: Form.RootRef;
		const api = new Form.API<z.infer<typeof requestSchema>>({
			initValue: { code: '' },
			validator: zodValidator<z.infer<typeof requestSchema>>(requestSchema.clone(), l),
			validOnChange: true,
			submit: async obj => {
				const r = await rest.post(`/passports/${this.#id}`, obj);
				await usr.refetch();
				return r;
			},
			onProblem: handleProblem,
		});

		return (
			<>
				<Show when={username}>
					<ConfirmButton.Root
						palette="error"
						square
						rounded
						title={l.t('_p.current.unbindTOTP')}
						onclick={async () => {
							const r = await rest.delete(`/passports/${this.#id}`);
							if (!r.ok) {
								await handleProblem(r.body!);
								return;
							}
							await f();
						}}
					>
						<IconLinkOff />
					</ConfirmButton.Root>
				</Show>

				<Show when={!username}>
					<Button.Root
						square
						rounded
						title={l.t('_p.current.bindTOTP')}
						onclick={async () => {
							const r = await rest.post<Secret>(`/passports/${this.#id}/secret`);
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
					</Button.Root>

					<Dialog.Root
						ref={el => {
							dialogRef = el;
						}}
						header={l.t('_p.current.bindTOTP')}
					>
						<Form.Root class={styles['action-form']} inDialog api={api} ref={el => (ref = el)}>
							<p title={qr()}>
								<QRCode.Root type="rounded" value={qr()} />
							</p>
							<br />
							<TextField.Root hasHelp placeholder={l.t('_p.current.verifyCode')} accessor={api.accessor('code')} />
							<ref.Submit class="ms-auto">{l.t('_c.ok')}</ref.Submit>
						</Form.Root>
					</Dialog.Root>
				</Show>
			</>
		);
	}
}
