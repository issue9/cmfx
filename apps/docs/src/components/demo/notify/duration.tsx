// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector } from '@docs/components/base';

export function typeSelector() {
	return arraySelector('types', Alert.types, 'error');
}

export default function (props: MountProps): JSX.Element {
	const [Type, typ] = typeSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Type />
			</Portal>
			<Alert closeable type={typ()} title="Alert Title" body="Alert Message" duration={5000} />
		</>
	);
}
