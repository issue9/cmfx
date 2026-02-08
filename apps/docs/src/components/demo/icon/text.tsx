// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

export default function () {
	return (
		<>
			<IconFace class="rounded-full bg-palette-bg-low hover:text-palette-fg-high" />
			<IconPerson class="border border-palette-fg-high" />

			<span class="flex w-full items-center border border-red-500 bg-palette-fg-high">
				<IconFace />
				与文字文字平行
				<IconClose />
			</span>
			<span class="flex w-full items-center border border-red-500 text-8xl">
				<IconFace />
				与文字平行 6rem
				<IconClose />
			</span>

			<span class="flex h-12 w-full items-center border border-red-500">
				<IconFace />
				与文字文字平行
				<IconFace />
			</span>
		</>
	);
}
