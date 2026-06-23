// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, InputText, useLocale, useREST } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { z } from 'zod';

import styles from './style.module.css';

const generalSchema = z.object({
	name: z.string(),
	shortName: z.string(),
	logo: z.string(),
	description: z.string(),
});

type General = z.infer<typeof generalSchema>;

export function General(): JSX.Element {
	const l = useLocale();
	const [rest] = useREST();

	const [F, Field] = Form.create<General>({
		initValue: {
			name: '',
			shortName: '',
			logo: '',
			description: '',
		},
		load: async () => {
			return await rest.get('/system/settings/general');
		},
		submit: async values => {
			return await rest.put('/system/settings/general', values);
		},
	});

	return (
		<F layout="vertical">
			<Field label={l.t('_p.system.settings.name')} name="name">
				<InputText />
			</Field>

			<Field label={l.t('_p.system.settings.shortName')} name="shortName">
				<InputText />
			</Field>

			<Field label={l.t('_p.system.settings.description')} name="description">
				<InputText />
			</Field>

			<Field label={l.t('_p.system.settings.logo')} name="logo">
				<InputText />
			</Field>

			<footer class={styles.actions}>
				<Form.Reset>{l.t('_c.reset')}</Form.Reset>
				<Form.Submit>{l.t('_c.ok')}</Form.Submit>
			</footer>
		</F>
	);
}
