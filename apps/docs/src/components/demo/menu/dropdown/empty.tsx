// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Dropdown, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (_: MountProps): JSX.Element {
	return (
		<div>
			<Dropdown items={[]}>
				<div class="h-full w-full bg-primary-bg text-primary-fg">click</div>
			</Dropdown>
		</div>
	);
}
