// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tab, TabItem } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';

export default function (): JSX.Element {
	const items: Array<TabItem> = [
		{ id: 'k1', label: 'K1' },
		{ id: 'k2', label: 'K22222' },
		{ id: 'k3', label: 'K3' },
		{ id: 'k4', label: 'K4' },
	];
	const [tab, setTab] = createSignal<string>('k1');

	return (
		<Tab palette="primary" items={items} onChange={e => setTab(e)}>
			<p>TabPanel:{tab()}</p>
		</Tab>
	);
}
