// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';
import { Formatter, type MountProps } from '@cmfx/components';
import { arraySelector } from '@docs/components/base';
import { Portal } from 'solid-js/web';

export default function Bytes(props: MountProps ): JSX.Element {
	const [Unit, unit] = arraySelector('unit', Formatter.byteUnits, undefined, true);

	return <>
	<Portal mount={props.mount}>
		<Unit />
	</Portal>
	 <Formatter.Bytes value={12345678} unit={unit()} />
	</>;
}
