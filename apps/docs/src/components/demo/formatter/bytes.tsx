// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';
import { Formatter, type MountProps } from '@cmfx/components';
import { arraySelector, boolSelector } from '@docs/components/base';
import { Portal } from 'solid-js/web';

export default function Bytes(props: MountProps ): JSX.Element {
	const [Unit, unit] = arraySelector('unit', Formatter.byteUnits, 'byte');
	const [Second, second] = boolSelector('/second', false)

	return <>
	<Portal mount={props.mount}>
		<Unit />
		<Second />
	</Portal>
	 <Formatter.Bytes value={12345678} unit={unit()} per={second() ? 'second' : undefined} />
	</>;
}
