// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tab, Transition } from '@cmfx/components';
import { createSignal, type JSX, Match, Switch } from 'solid-js';

export default function (): JSX.Element {
	const items: Array<Tab.Item> = [
		{ id: 'k1', label: 'K1' },
		{ id: 'k2', label: 'K2222222' },
		{ id: 'k3', label: 'K3', disabled: true },
		{ id: 'k4', label: 'K4' },
	];
	const [tab, setTab] = createSignal('k1');

	return (
		<Tab.Root layout="vertical" palette="primary" items={items} onChange={setTab}>
			<Transition>
				<Switch>
					<Match when={tab() === 'k1'}>
						<div>Panel for K1</div>
					</Match>
					<Match when={tab() === 'k2'}>
						<div>Panel for K2</div>
					</Match>
					<Match when={tab() === 'k3'}>
						<div>Panel for K3</div>
					</Match>
					<Match when={tab() === 'k4'}>
						<div>Panel for K4</div>
					</Match>
				</Switch>
			</Transition>
		</Tab.Root>
	);
}
