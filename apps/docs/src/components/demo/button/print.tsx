// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/components';
import { PrintButton } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector, buttonKindSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	let elem: HTMLDivElement;

	const [Kind, kind] = buttonKindSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Palette, palette] = paletteSelector();
	const [Display, display] = arraySelector('display', PrintButton.displays);

	return (
		<div ref={el => (elem = el)}>
			<Portal mount={props.mount}>
				<Kind />
				<Disabled />
				<Rounded />
				<Palette />
				<Display />
			</Portal>

			<PrintButton.Root
				element={() => elem}
				disabled={disabled()}
				rounded={rounded()}
				kind={kind()}
				palette={palette()}
				display={display()}
			/>
		</div>
	);
}
