// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { DialogRef, RemoteTableRef } from '@cmfx/components';
import {
	Button,
	ConfirmButton,
	createForm,
	Dialog,
	fieldAccessor,
	Label,
	RemoteTable,
	TextField,
	useLocale,
} from '@cmfx/components';
import { Token, zodValidator } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { JSX, Show } from 'solid-js';
import { z } from 'zod';
import IconAddLink from '~icons/material-symbols/add-link';
import IconClose from '~icons/material-symbols/close';
import IconCredit from '~icons/material-symbols/credit-card-gear';
import IconDelete from '~icons/material-symbols/delete';
import IconLinkOff from '~icons/material-symbols/link-off';
import IconPerson from '~icons/material-symbols/person';

import { handleProblem, useAdmin, useOptions, useREST } from '@admin/app';
import { usernameSchema } from '@admin/schemas';
import { decodeBase64, encodeBase64 } from './base';
import { PassportComponents, RefreshFunc } from './passports';
import styles from './style.module.css';

type Credential = {
	id: string;
	created: string;
	last: string;
	ua: string;
};

export class Webauthn implements PassportComponents {
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
		const api = useREST();
		const l = useLocale();
		const usr = useAdmin();
		const account = fieldAccessor('account', '');
		const opt = useOptions();
		const nav = useNavigate();

		const accountSchema = z.object({
			account: usernameSchema.clone(),
		});

		const [fapi, Form, actions] = createForm<z.infer<typeof accountSchema>, Token>({
			initValue: { account: '' },
			validator: zodValidator<z.infer<typeof accountSchema>>(accountSchema.clone(), l),
			validOnChange: true,
			submit: async obj => {
				const cro = await api.get<CredentialRequestOptions>(`/passports/${this.#id}/login/${obj}`);
				if (!cro.ok) {
					return cro;
				}

				const publicKey = cro.body!.publicKey!; // 判断非空也是抛出异常，不如直接非空断言
				publicKey.challenge = decodeBase64(publicKey.challenge);
				if (publicKey.allowCredentials) {
					publicKey.allowCredentials = publicKey.allowCredentials.map(c => ({
						...c,
						id: decodeBase64(c.id),
					}));
				}
				const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential;
				const resp = credential.response as AuthenticatorAssertionResponse;

				const pc = {
					id: credential.id,
					rawId: encodeBase64(credential.rawId),
					type: credential.type,
					response: {
						authenticatorData: encodeBase64(resp.authenticatorData),
						clientDataJSON: encodeBase64(resp.clientDataJSON),
						signature: encodeBase64(resp.signature),
						userHandle: resp.userHandle ? encodeBase64(resp.userHandle) : null,
					},
				};
				const token = await api.post<Token>(`/passports/${this.#id}/login/${account.getValue()}`, pc);
				if (!token.ok) {
					return token;
				}

				await usr.login(token);
				return token;
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
			<Form class={styles.webauthn}>
				<TextField
					hasHelp
					prefix={<IconPerson class={styles['text-field']} />}
					autocomplete="username"
					suffix={
						<Show when={account.getValue() !== ''}>
							<IconClose class={styles['text-field']} onClick={() => account.setValue('')} />
						</Show>
					}
					placeholder={l.t('_p.current.username')}
					accessor={account}
				/>
				<actions.Submit palette="secondary" disabled={account.getValue() === ''}>
					{l.t('_c.ok')}
				</actions.Submit>
			</Form>
		);
	}

	Actions(refresh: RefreshFunc): JSX.Element {
		const l = useLocale();
		const api = useREST();
		let dialogRef: DialogRef;
		let tableRef: RemoteTableRef<Credential>;

		return (
			<>
				<Button
					square
					rounded
					title={l.t('_p.current.bindWebauthn')}
					onclick={async () => {
						dialogRef.root().showModal();
					}}
				>
					<IconCredit />
				</Button>

				<Dialog
					class="w-[80%]"
					ref={el => {
						dialogRef = el;
					}}
					header={<Label icon={<IconCredit />}>{l.t('_p.current.webauthnCredentials')}</Label>}
				>
					<div class="overflow-auto">
						<RemoteTable<Credential>
							rest={api}
							ref={el => {
								tableRef = el;
							}}
							queries={{}}
							path={`/passports/${this.#id}/credentials`}
							columns={[
								{ id: 'id', label: l.t('_p.id') },
								{ id: 'ua', label: l.t('_p.current.ua') },
								{
									id: 'last',
									label: l.t('_p.current.lastUsed'),
									content: (_, val) => l.datetimeFormat().format(new Date(val as string)),
								},
								{
									id: 'id',
									label: l.t('_p.actions'),
									renderContent: (_, val) => (
										<ConfirmButton
											square
											rounded
											palette="error"
											title={l.t('_p.current.unbindWebauthn')}
											onclick={async () => {
												const r1 = await api.delete(`/passports/${this.#id}/credentials/${val}`);
												if (!r1.ok) {
													await handleProblem(r1.body!);
													return;
												}

												tableRef.refresh();
												await refresh();
											}}
										>
											<IconDelete />
										</ConfirmButton>
									),
								},
							]}
							toolbar={
								<div class="flex gap-2">
									<Button
										palette="primary"
										rounded
										onclick={async () => {
											const cco = await api.get<CredentialCreationOptions>(`/passports/${this.#id}/register`);
											if (!cco.ok) {
												await handleProblem(cco.body!);
												return;
											}

											const publicKey = cco.body!.publicKey!; // 判断非空也是抛出异常，不如直接非空断言
											publicKey.challenge = decodeBase64(publicKey.challenge);
											if (publicKey.user?.id) {
												publicKey.user.id = decodeBase64(publicKey.user.id);
											}
											const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential;
											const resp = credential.response as AuthenticatorAttestationResponse;
											const pc = {
												id: credential.id,
												rawId: encodeBase64(credential.rawId),
												type: credential.type,
												response: {
													attestationObject: encodeBase64(resp.attestationObject),
													clientDataJSON: encodeBase64(resp.clientDataJSON),
												},
											};

											const reg = await api.post(`/passports/${this.#id}/register`, pc);
											if (!reg.ok) {
												await handleProblem(reg.body!);
												return;
											}

											tableRef.refresh();
											await refresh();
										}}
									>
										<IconAddLink />
										&#160;{l.t('_p.current.bindWebauthn')}
									</Button>

									<ConfirmButton
										palette="secondary"
										rounded
										onclick={async () => {
											const r1 = await api.delete(`/passports/${this.#id}`);
											if (!r1.ok) {
												await handleProblem(r1.body!);
												return;
											}
											await refresh();
										}}
									>
										<IconLinkOff />
										&#160;{l.t('_p.current.unbindAllWebauthn')}
									</ConfirmButton>
								</div>
							}
						/>
					</div>
				</Dialog>
			</>
		);
	}
}
