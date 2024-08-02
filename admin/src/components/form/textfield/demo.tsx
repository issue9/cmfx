// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { boolSelector, paletteSelector } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import Number from './number';
import Password from './password';
import TextField from './textfiled';

export default function() {
    const txt = FieldAccessor('name', 'text', true);
    const pwd = FieldAccessor('name', 'pwd', true);
    const num = FieldAccessor('name', 5, true);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [paletteS, palette] = paletteSelector();

    const prefix = () => (<div class="bg-red-500 flex items-center">prefix</div>);

    const suffix = () => (<div class="bg-red-500 flex items-center">suffix</div>);

    const icon = () => (<span class="material-symbols-outlined flex items-center">face</span>);

    return <div class="flex flex-col flex-wrap px-5">
        <div class="flex gap-2">
            {paletteS}
            <fieldset class="border-2 my-4 box-border">
                <legend>设置</legend>
                {readonlyS}
                {roundedS}
                {disabledS}
            </fieldset>
            <br />

            <button class="c--button button-style--fill palette--primary" onClick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</button>
        </div>

        <div class="flex gap-10 mt-5">
            <div class="flex flex-col gap-2 w-80">
                <TextField placeholder='placeholder' palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField placeholder='placeholder' label="label" palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField placeholder='placeholder' label="prefix" prefix={prefix} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField placeholder='placeholder' label="prefix+suffix" prefix={prefix} suffix={suffix} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField placeholder='placeholder' label="prefix+icon suffix" prefix={icon} suffix={icon} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            </div>

            <div class="flex flex-col gap-2 w-80">
                <Number placeholder='placeholder' palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
                <Number placeholder='placeholder' label="icon" icon="face" palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
                <Number placeholder='placeholder' label="range:[1,10]" icon="face" min={1} max={10} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
                <Password placeholder='placeholder' label="password" icon="face" palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={pwd} />
            </div>
        </div>
    </div>;
}
