// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, InputText, useLocale } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { z } from 'zod';

import { useREST } from '@admin/app';
import styles from './style.module.css';

const auditSchema = z.object({
	keywords: z.string().array(),
	urlBlacklist: z.string().array(),
});

type Audit = z.infer<typeof auditSchema>;

export function Audit(): JSX.Element {
	const l = useLocale();
	const rest = useREST();

	const [F, Field, api] = Form.create<Audit>({
		initValue: { keywords: [], urlBlacklist: [] },
		load: async () => {
			return await rest.get('/system/settings/audit');
		},
		submit: async values => {
			return await rest.put('/system/settings/audit', values);
		},
	});

	return (
		<F layout="vertical">
			<Field label={l.t('_p.system.settings.keywords')} name="keywords">
				<InputText accessor={Form.array2StringAccessor(',', api.accessor('keywords'))} />
			</Field>

			<Field label={l.t('_p.system.settings.urlBlacklist')} name="urlBlacklist">
				<InputText accessor={Form.array2StringAccessor(',', api.accessor('urlBlacklist'))} />
			</Field>

			<footer class={styles.actions}>
				<Form.Reset>{l.t('_c.reset')}</Form.Reset>
				<Form.Submit>{l.t('_c.ok')}</Form.Submit>
			</footer>
		</F>
	);
}
