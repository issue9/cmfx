// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, paletteSelector } from '@docs/components/base';

export function typeSelector() {
	return arraySelector('types', Alert.types, 'error');
}

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Type, typ] = typeSelector();
	const text = 'Alert Message Alert Message\nAlert Message Alert Message \n 使用 \\n 换行';

	return (
		<div class="flex w-full flex-col gap-3">
			<Portal mount={props.mount}>
				<Palette />
				<Type />
			</Portal>
			<Alert palette={palette()} type={typ()} title="Alert Title" body="Alert Message" />

			<Alert palette={palette()} type={typ()} title="Alert Title" body={text} />

			<Alert
				onCancel={true}
				palette={palette()}
				type={typ()}
				icon={false}
				title="Alert Title"
				body="Alert Message Alert Message\nAlert Message Alert Message \n 使用 \\n 换行"
			/>
		</div>
	);
}
