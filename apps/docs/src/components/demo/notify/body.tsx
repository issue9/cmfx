// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Alert } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector } from '@docs/components/base';

export function typeSelector() {
	return arraySelector('types', Alert.types, 'error');
}

export default function (props: MountProps): JSX.Element {
	const [Type, typ] = typeSelector();
	const text = 'Alert Message Alert Message\nAlert Message Alert Message \n 使用 \\n 换行';

	return (
		<div class="flex w-full flex-col gap-3">
			<Portal mount={props.mount}>
				<Type />
			</Portal>
			<Alert type={typ()} title="Alert Title" body="Alert Message" />

			<Alert type={typ()} title="Alert Title" body={text} />

			<Alert
				closeable
				type={typ()}
				icon={false}
				title="Alert Title"
				body="Alert Message Alert Message\nAlert Message Alert Message \n 使用 \\n 换行"
			/>
		</div>
	);
}
