// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Page, Tab, useLocale } from '@cmfx/components';
import { createSignal, type JSX, Match, Switch } from 'solid-js';

import { Audit } from './audit';
import { General } from './general';
import styles from './style.module.css';

const types = ['general', 'audit'] as const;

type Type = (typeof types)[number];

export function Settings(): JSX.Element {
	const l = useLocale();
	const [val, setVal] = createSignal<Type>('general');

	return (
		<Page title="_p.system.settings">
			<Tab
				class={styles.tab}
				value="general"
				onChange={setVal}
				layout="vertical"
				panelClass={styles.tabpanel}
				items={[
					{ id: 'general', label: l.t('_p.system.settings.general') },
					{ id: 'audit', label: l.t('_p.system.settings.audit') },
				]}
			>
				<Switch fallback={<General />}>
					<Match when={val() === 'audit'}>
						<Audit />
					</Match>
				</Switch>
			</Tab>
		</Page>
	);
}
