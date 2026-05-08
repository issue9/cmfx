// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, InputText, useLocale } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { z } from 'zod';

import { useREST } from '@admin/app';
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
	const rest = useREST();

	const api = new Form.API<General>({
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
		<Form.Root api={api} layout="vertical">
			<InputText.Root label={l.t('_p.system.settings.name')} accessor={api.accessor('name')} />
			<InputText.Root label={l.t('_p.system.settings.shortName')} accessor={api.accessor('shortName')} />
			<InputText.Root label={l.t('_p.system.settings.description')} accessor={api.accessor('description')} />
			<InputText.Root label={l.t('_p.system.settings.logo')} accessor={api.accessor('logo')} />

			<footer class={styles.actions}>
				<Form.Reset>{l.t('_c.reset')}</Form.Reset>
				<Form.Submit>{l.t('_c.ok')}</Form.Submit>
			</footer>
		</Form.Root>
	);
}
