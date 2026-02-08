// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, MountProps, notifyTypes } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector, paletteSelector } from '@docs/components/base';

export function typeSelector() {
	return arraySelector('types', notifyTypes, 'error');
}

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Type, typ] = typeSelector();
	const [Closable, closable] = boolSelector('closable', true);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Type />
				<Closable />
			</Portal>
			<Alert
				closable={closable()}
				palette={palette()}
				type={typ()}
				title="Alert Title"
				body="Alert Message"
				duration={5000}
			/>
		</>
	);
}
