// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import { Button } from '@components/button';
import { useLockScreen } from './context';

export function Password(): JSX.Element {
	const ctx = useLockScreen();

	return (
		<div>
			<Button onclick={() => ctx.unlock()}>unlock</Button>
		</div>
	);
}
