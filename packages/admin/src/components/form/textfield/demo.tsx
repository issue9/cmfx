// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { cloneElement } from '@admin/components/base';
import { boolSelector, Demo, paletteSelector } from '@admin/components/base/demo';
import { FieldAccessor } from '@admin/components/form/field';
import { Number } from './number';
import { Password } from './password';
import { TextField } from './textfiled';

export default function() {
    const txt = FieldAccessor('name', 'text', true);
    const pwd = FieldAccessor('name', 'pwd', true);
    const num = FieldAccessor('name', 5, true);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [horizontalS, horizontal] = boolSelector('horizontal', true);
    const [paletteS, palette] = paletteSelector();

    const prefix = <div class="bg-red-500 flex items-center">prefix</div>;
    const suffix = <div class="bg-red-500 flex items-center">suffix</div>;

    return <Demo settings={
        <>
            {paletteS}
            {readonlyS}
            {roundedS}
            {disabledS}
            {horizontalS}
            <button class="c--button c--button-fill palette--primary" onClick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <div class="flex flex-col gap-2 w-80">
            <TextField horizontal={horizontal()} placeholder='placeholder' palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField horizontal={horizontal()} placeholder='placeholder' label="label" palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField horizontal={horizontal()} placeholder='placeholder' label="prefix" prefix={cloneElement(prefix)} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField horizontal={horizontal()} placeholder='placeholder' label="prefix+suffix" prefix={cloneElement(prefix)} suffix={cloneElement(suffix)} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
        </div>

        <div class="flex flex-col gap-2 w-80">
            <Number horizontal={horizontal()} placeholder='placeholder' palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
            <Number horizontal={horizontal()} placeholder='placeholder' label="icon" icon="face" palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
            <Number horizontal={horizontal()} placeholder='placeholder' label="range:[1,10]" icon="face" min={1} max={10} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
            <Password horizontal={horizontal()} placeholder='placeholder' label="password" icon="face" palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={pwd} />
        </div>
    </Demo>;
}
