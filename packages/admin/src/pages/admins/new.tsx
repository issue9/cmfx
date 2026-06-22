// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Form, InputPassword, InputText, Notify, Page, useLocale } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import type { JSX } from 'solid-js';
import * as z from 'zod';
import IconArrowBack from '~icons/material-symbols/arrow-back-ios';

import { useREST } from '@admin/app';
import { SexSelector } from '@admin/components';
import { roles } from '@admin/pages/roles';
import { sexSchema } from '@admin/schemas';

interface Props {
	/**
	 * 返回上一页的地址
	 */
	backURL: string;
}

const adminSchema = z.object({
	sex: sexSchema,
	name: z.string().min(1),
	nickname: z.string().min(1),
	roles: z.array(z.string().min(1)),
	username: z.string().min(1),
	password: z.string().min(1),
});

export function New(props: Props): JSX.Element {
	const l = useLocale();
	const [rest, handleProblem] = useREST();

	const [F, Field] = Form.create<z.infer<typeof adminSchema>>({
		initValue: { sex: 'unknown', name: '', nickname: '', username: '', password: '', roles: [] },
		submit: async obj => {
			return await rest.post('/admins', obj);
		},
		onProblem: handleProblem,
		onSuccess: async () => {
			await Notify.notify(l.t('_p.admin.addSuccessful'), undefined, 'success');
			useNavigate()(-1);
		},
	});

	return (
		<Page title="_p.admin.admin" class="max-w-2xl">
			<F>
				<Field name="username" label={l.t('_p.current.username')}>
					<InputText />
				</Field>

				<Field name="name" label={l.t('_p.admin.name')}>
					<InputText />
				</Field>

				<Field name="nickname" label={l.t('_p.nickname')}>
					<InputText />
				</Field>

				<Field name="password" label={l.t('_p.current.password')}>
					<InputPassword autocomplete="new-password" />
				</Field>

				<Field name="roles" label={l.t('_p.roles.roles')}>
					<roles.Selector multiple />
				</Field>

				<Field name="sex" label={l.t('_p.sex')}>
					<SexSelector />
				</Field>

				<div class="flex w-full justify-between gap-5">
					<Button type="a" href={props.backURL} palette="secondary">
						<IconArrowBack />
						{l.t('_c.cancel')}
					</Button>
					<Button type="submit" palette="primary">
						{l.t('_c.ok')}
					</Button>
				</div>
			</F>
		</Page>
	);
}
