// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, QRCode, QRCodeCornerDotType, QRCodeCornerSquareType, QRCodeDotType } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, paletteSelector } from '@docs/components/base';

const dotTypes: Array<QRCodeDotType> = ['dots' , 'rounded' , 'classy' , 'classy-rounded' , 'square' , 'extra-rounded'] as const;
const cornerDotTypes: Array<QRCodeCornerDotType> = ['dot', 'square'] as const;
const cornerSquareTypes: Array<QRCodeCornerSquareType> = ['dot', 'square', 'extra-rounded'] as const;

export function typeSelector(preset: QRCodeDotType = 'square') {
    return arraySelector('type', dotTypes, preset);
}

export function cornerTypeSelector(preset: QRCodeCornerDotType = 'square') {
    const corners = new Map<QRCodeCornerDotType, string>(cornerDotTypes.map(v => [v, v]));
    corners.set('' as any, 'undefined');
    return arraySelector('corner type', corners, preset);
}

export function cornerSquareTypeSelector(preset: QRCodeCornerSquareType = 'square') {
    const corners = new Map<QRCodeCornerSquareType, string>(cornerSquareTypes.map(v => [v, v]));
    corners.set('' as any, 'undefined');
    return arraySelector('corner square type', corners, preset);
}

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector();
    const [Type, t] = typeSelector();
    const [Ctype, ctype] = cornerTypeSelector();
    const [Cstype, cstype] = cornerSquareTypeSelector();

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Type />
            <Ctype />
            <Cstype />
        </Portal>

        <QRCode type={t()} cornerDotType={ctype()} cornerSquareType={cstype()} palette={palette()} value="https://example.com" />
    </>;
}
