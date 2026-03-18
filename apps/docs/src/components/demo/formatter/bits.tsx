// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Formatter, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector } from '@docs/components/base';

export default function Bytes(props: MountProps): JSX.Element {
	const [Unit, unit] = arraySelector('unit', Formatter.bitUnits, 'kilobit');
	const [Minute, minute] = boolSelector('/minute', false);

	return (
		<>
			<Portal mount={props.mount}>
				<Unit />
				<Minute />
			</Portal>
			<Formatter.Bits value={12345678} unit={unit()} per={minute() ? 'minute' : undefined} />
		</>
	);
}
