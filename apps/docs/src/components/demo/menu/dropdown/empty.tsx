// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Dropdown } from '@cmfx/components';

export default function () {
	return (
		<div>
			<Dropdown.Root items={[]}>
				<div class="h-full w-full bg-primary-bg text-primary-fg">click</div>
			</Dropdown.Root>
		</div>
	);
}
