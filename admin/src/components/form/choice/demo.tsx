// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { boolSelector, Demo, paletteSelector } from '@/components/base/demo';
import { FieldAccessor, Options, TextField } from '@/components/form';
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

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            {roundedS}

            <button class="c--button c--button-fill palette--primary" onClick={() => {
                fa.setError(fa.getError() ? undefined : 'error');
                mfa.setError(mfa.getError() ? undefined : 'error');
            }}>toggle error</button>
        </>
    }>
        <Choice tabindex={0} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} label="label+tabindex" accessor={fa} options={options} />
        <Choice placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={mfa} multiple options={multipleOptions} />
        <Choice disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={mfa} multiple options={multipleOptions} />
        <TextField placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={tf} />
    </Demo>;
}
