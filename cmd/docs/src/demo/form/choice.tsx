// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceOption, fieldAccessor, TextField } from '@cmfx/components';

import { boolSelector, Demo, layoutSelector, paletteSelector, Stage } from '../base';

export default function() {
    const fa = fieldAccessor<string|undefined>('choice', '1');
    const options: Array<ChoiceOption> = [
        { type: 'item', value: '1', label: <div>abc</div> },
        { type: 'item', value: '2', label: <div style="color:green">green</div > },
        { type: 'item', value: '3', label: <div style="color:red">red<br />red</div> },
    ];


    const mfa = fieldAccessor<Array<number>>('choice', [1,2]);
    const multipleOptions: Array<ChoiceOption> = [
        { type: 'item', value: 1, label: <div>abc</div> },
        { type: 'item', value: 2, label: <div style="color:green">green</div > },
        { type: 'divider' },
        {
            type: 'group', label: 'Group', items: [
                { type: 'item', value: 3, label: <div style="color:red">red<br />red</div> },
                { type: 'item', value: 4, label: <div style="color:yellow">yellow</div> },
                { type: 'item', value: 5, label: <div style="color:blue">blue</div> },
                { type: 'item', value: 6, label: <div style="color:red">red2</div> },
                { type: 'item', value: 7, label: <div style="color:red">red3</div> },
                { type: 'item', value: 8, label: <div style="color:red">red4</div>, items: [
                    { type: 'item', value: 81, label: <div style="color:red">red41</div> },
                    { type: 'item', value: 82, label: <div style="color:red">red42</div> },
                    { type: 'item', value: 83, label: <div style="color:red">red43</div> },
                ] },
                { type: 'item', value: 9, label: <div style="color:red">red5</div> },
            ]
        }
    ];

    const tf = fieldAccessor('textfield', '');

    const [paletteS, palette] = paletteSelector();
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            {roundedS}
            {layoutS}

            <button class="palette--primary" onClick={() => {
                fa.setError(fa.getError() ? undefined : 'error');
                mfa.setError(mfa.getError() ? undefined : 'error');
            }}>toggle error</button>
        </>
    }>
        <Stage title="label" class="flex flex-row gap-5">
            <Choice hasHelp layout={layout()} tabindex={0} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} label="label+tabindex" accessor={fa} options={options} />
            <TextField layout={layout()} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={tf} />
        </Stage>

        <Stage title="multiple" class="flex flex-row gap-5">
            <Choice layout={layout()} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={mfa} multiple options={multipleOptions} />
            <TextField layout={layout()} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={tf} />
        </Stage>
    </Demo>;
}
