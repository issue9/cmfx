// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tab, TabItem } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';

export default function (): JSX.Element {
	const items: Array<TabItem> = [
		{ id: 'k1', label: 'K1' },
		{ id: 'k2', label: 'K22222222' },
		{ id: 'k3', label: 'K3' },
		{ id: 'k4', label: 'K4' },
		{ id: 'k5', label: 'K5' },
		{ id: 'k6', label: 'K6' },
	];
	const [tab, setTab] = createSignal('k1');

	return (
		<Tab layout="vertical" palette="primary" items={items} onChange={e => setTab(e)} class="h-40">
			<p>TabPanel:{tab()}</p>
		</Tab>
	);
}
