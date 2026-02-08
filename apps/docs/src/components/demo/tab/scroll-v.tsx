// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tab, TabItem } from '@cmfx/components';
import { createSignal } from 'solid-js';

export default function () {
	const items: Array<TabItem> = [
		{ id: 'k1', label: 'K1' },
		{ id: 'k2', label: 'K22222222' },
		{ id: 'k3', label: 'K3' },
		{ id: 'k4', label: 'K4' },
		{ id: 'k5', label: 'K5' },
		{ id: 'k6', label: 'K6' },
	];
	const [tab, setTab] = createSignal<string>('k1');

	return (
		<div>
			<Tab layout="vertical" palette="primary" items={structuredClone(items)} onChange={(e) => setTab(e)} class="h-40">
				<p>TabPanel:{tab()}</p>
			</Tab>
		</div>
	);
}
