// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { CornerDotType, CornerSquareType, DotType } from 'qr-code-styling';

import { arraySelector, Demo, paletteSelector, Stage } from '@/components/base/demo';
import { QRCode, Ref } from './qrcode';

const dotTypes = ['dots' , 'rounded' , 'classy' , 'classy-rounded' , 'square' , 'extra-rounded'] as const;
const cornerDotTypes = ['dot', 'square'] as const;
const cornerSquareTypes = ['dot', 'square', 'extra-rounded'] as const;

export function typeSelector(preset: DotType = 'square') {
    return arraySelector('type', dotTypes, preset);
}

export function cornerTypeSelector(preset: CornerDotType = 'square') {
    return arraySelector<CornerDotType|undefined>('corner type', [...cornerDotTypes, undefined], preset);
}

export function cornerSquareTypeSelector(preset: CornerSquareType = 'square') {
    return arraySelector<CornerSquareType|undefined>('corner square type', [...cornerSquareTypes, undefined], preset);
}

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [typeS, t] = typeSelector();
    const [ctypeS, ctype] = cornerTypeSelector();
    const [cstypeS, cstype] = cornerSquareTypeSelector();

    let ref: Ref;

    return <Demo settings={
        <>
            {paletteS}
            {typeS}
            {ctypeS}
            {cstypeS}
        </>
    }>

        <Stage title="qrcode">
            <QRCode type={t()} cornerDotType={ctype()} cornerSquareType={cstype()} palette={palette()} value="https://example.com" />
        </Stage>

        <Stage title="padding">
            <QRCode ref={el=>ref=el} padding={10} type={t()} cornerDotType={ctype()} cornerSquareType={cstype()} palette={palette()} value="https://example.com" />
            <button onclick={()=>ref.download()}>png</button>
            <button onclick={()=>ref.download('f1', 'jpeg')}>jpeg</button>
            <button onclick={()=>ref.download('f1', 'svg')}>svg</button>
        </Stage>
    </Demo>;
}