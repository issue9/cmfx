// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { boolSelector, Demo, paletteSelector, Stage } from '@components/base/demo';
import { TextField } from '@components/form';
import { FieldAccessor, Options } from '@components/form/field';
import { Choice } from './choice';

export default function() {
    const fa = FieldAccessor<string|undefined>('choice', '1', true);
    const options: Options<string> = [
        ['1', <div>abc</div>],
        ['2', <div style="color:green">green</div >],
        ['3', <div style="color:red">red<br/>red</div>],
    ];


    const mfa = FieldAccessor<Array<number>>('choice', [1,2]);
    const multipleOptions: Options<number> = [
        [1, <div>abc</div>],
        [2, <div style="color:green">green</div >],
        [3, <div style="color:red">red<br/>red</div>],
        [4, <div style="color:yellow">yellow</div>],
        [5, <div style="color:blue">blue</div>],
        [6, <div style="color:red">red2</div>],
        [7, <div style="color:red">red3</div>],
        [8, <div style="color:red">red4</div>],
        [9, <div style="color:red">red5</div>],
    ];

    const tf = FieldAccessor('textfield', '');

    const [paletteS, palette] = paletteSelector();
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [horizontalS, horizontal] = boolSelector('horizontal', true);

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            {roundedS}
            {horizontalS}

            <button class="c--button c--button-fill palette--primary" onClick={() => {
                fa.setError(fa.getError() ? undefined : 'error');
                mfa.setError(mfa.getError() ? undefined : 'error');
            }}>toggle error</button>
        </>
    }>
        <Stage title="label" class="flex flex-row gap-5">
            <Choice horizontal={horizontal()} tabindex={0} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} label="label+tabindex" accessor={fa} options={options} />
            <TextField horizontal={horizontal()} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={tf} />
        </Stage>

        <Stage title="multiple" class="flex flex-row gap-5">
            <Choice horizontal={horizontal()} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={mfa} multiple options={multipleOptions} />
            <Choice horizontal={horizontal()} disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={mfa} multiple options={multipleOptions} />
            <TextField horizontal={horizontal()} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={tf} />
        </Stage>
    </Demo>;
}
