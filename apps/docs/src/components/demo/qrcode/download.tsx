// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
	Button,
	MountProps,
	QRCode,
	QRCodeCornerDotType,
	QRCodeCornerSquareType,
	QRCodeDotType,
	QRCodeRef,
} from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, paletteSelector } from '@docs/components/base';

const dotTypes = ['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'] as const;
const cornerDotTypes = ['dot', 'square'] as const;
const cornerSquareTypes = ['dot', 'square', 'extra-rounded'] as const;

export function typeSelector(preset: QRCodeDotType = 'square') {
	return arraySelector('type', dotTypes, preset);
}

export function cornerTypeSelector(preset: QRCodeCornerDotType = 'square') {
	const corners = new Map(cornerDotTypes.map(v => [v, v]));
	corners.set('' as any, 'undefined' as any);
	return arraySelector('corner type', corners, preset);
}

export function cornerSquareTypeSelector(preset: QRCodeCornerSquareType = 'square') {
	const corners = new Map(cornerSquareTypes.map(v => [v, v]));
	corners.set('' as any, 'undefined' as any);
	return arraySelector('corner square type', corners, preset);
}

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Type, t] = typeSelector();
	const [Ctype, ctype] = cornerTypeSelector();
	const [Cstype, cstype] = cornerSquareTypeSelector();

	let ref: QRCodeRef;

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Type />
				<Ctype />
				<Cstype />
			</Portal>

			<QRCode
				ref={el => {
					ref = el;
				}}
				padding={10}
				type={t()}
				cornerDotType={ctype()}
				cornerSquareType={cstype()}
				palette={palette()}
				value="https://example.com"
			/>
			<div class="w-full flex justify-between mt-5">
				<Button onclick={() => ref.download()}>png</Button>
				<Button onclick={() => ref.download('f1', 'jpeg')}>jpeg</Button>
				<Button onclick={() => ref.download('f1', 'svg')}>svg</Button>
			</div>
		</>
	);
}
