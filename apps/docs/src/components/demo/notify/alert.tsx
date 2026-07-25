// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, type MountProps, Notify } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector } from '@docs/components/base';

export function typeSelector() {
	return arraySelector('types', Alert.types, 'success');
}

export default function (props: MountProps): JSX.Element {
	const [Type, typ] = typeSelector();

	return (
		<div class="flex w-full flex-col gap-2">
			<Portal mount={props.mount}>
				<Type />
			</Portal>

			<Alert type={typ()} title="Alert Title" />

			<Alert
				type={typ()}
				title="由 onclose 阻止"
				icon={<IconFace />}
				closeable
				onClose={async () => { await Notify.success('accept！'); return true; }}
			/>

			<Alert closeable type={typ()} title="Alert Title" icon={false} />
		</div>
	);
}
