// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tab } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';

export default function (): JSX.Element {
	const items: Array<Tab.Item> = [
		{ id: 'k1', label: 'K1' },
		{ id: 'k2', label: 'K2222222' },
		{ id: 'k3', label: 'K3' },
		{ id: 'k4', label: 'K4' },
		{ id: 'k5', label: 'K5' },
		{ id: 'k6', label: 'K6' },
	];
	const [tab, setTab] = createSignal('k1');

	return (
		<Tab.Root class="w-50" layout="horizontal" palette="primary" items={items} onChange={e => setTab(e)}>
			<p>TabPanel:{tab()}</p>
		</Tab.Root>
	);
}
