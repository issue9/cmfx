// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Formatter, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector } from '@docs/components/base';

export default function Bytes(props: MountProps): JSX.Element {
	const [Unit, unit] = arraySelector('unit', Formatter.byteUnits, 'byte');
	const [Second, second] = boolSelector('/second', false);

	return (
		<>
			<Portal mount={props.mount}>
				<Unit />
				<Second />
			</Portal>
			<Formatter.Bytes value={12345678} unit={unit()} per={second() ? 'second' : undefined} />
		</>
	);
}
