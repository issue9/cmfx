// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { QRCode, QRCodeCornerDotType, QRCodeCornerSquareType, QRCodeDotType } from '@cmfx/components';

import { arraySelector, paletteSelector } from '../base';

const dotTypes = ['dots' , 'rounded' , 'classy' , 'classy-rounded' , 'square' , 'extra-rounded'] as const;
const cornerDotTypes = ['dot', 'square'] as const;
const cornerSquareTypes = ['dot', 'square', 'extra-rounded'] as const;

export function typeSelector(preset: QRCodeDotType = 'square') {
    return arraySelector('type', dotTypes, preset);
}

export function cornerTypeSelector(preset: QRCodeCornerDotType = 'square') {
    return arraySelector<QRCodeCornerDotType|undefined>('corner type', [...cornerDotTypes, undefined], preset);
}

export function cornerSquareTypeSelector(preset: QRCodeCornerSquareType = 'square') {
    return arraySelector<QRCodeCornerSquareType|undefined>('corner square type', [...cornerSquareTypes, undefined], preset);
}

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [typeS, t] = typeSelector();
    const [ctypeS, ctype] = cornerTypeSelector();
    const [cstypeS, cstype] = cornerSquareTypeSelector();

    return <div>
        {paletteS}
        {typeS}
        {ctypeS}
        {cstypeS}
        <QRCode type={t()} cornerDotType={ctype()} cornerSquareType={cstype()} palette={palette()} value="https://example.com" />
    </div>;
}
