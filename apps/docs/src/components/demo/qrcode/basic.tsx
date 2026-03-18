// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, QRCode } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, paletteSelector } from '@docs/components/base';

const dotTypes = ['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'] as const;
const cornerDotTypes = ['dot', 'square'] as const;
const cornerSquareTypes = ['dot', 'square', 'extra-rounded'] as const;

export function typeSelector(preset: QRCode.DotType = 'square') {
	return arraySelector('type', dotTypes, preset);
}

export function cornerTypeSelector(preset: QRCode.CornerDotType = 'square') {
	const corners = new Map(cornerDotTypes.map(v => [v, v]));
	return arraySelector('corner type', corners, preset, true);
}

export function cornerSquareTypeSelector(preset: QRCode.CornerSquareType = 'square') {
	const corners = new Map(cornerSquareTypes.map(v => [v, v]));
	return arraySelector('corner square type', corners, preset, true);
}

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Type, t] = typeSelector();
	const [Ctype, ctype] = cornerTypeSelector();
	const [Cstype, cstype] = cornerSquareTypeSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Type />
				<Ctype />
				<Cstype />
			</Portal>

			<QRCode.Root
				type={t()}
				cornerDotType={ctype()}
				cornerSquareType={cstype()}
				palette={palette()}
				value="https://example.com"
			/>
		</>
	);
}
