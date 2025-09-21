// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { cloneElement, fieldAccessor, Number, Password, TextField } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, Demo, layoutSelector, paletteSelector } from '../base';

export default function() {
    const txt = fieldAccessor('name', 'text');
    const pwd = fieldAccessor('name', 'pwd');
    const num = fieldAccessor('name', 5);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [paletteS, palette] = paletteSelector();

    const prefix = <div class="bg-red-500 flex items-center">prefix</div>;
    const suffix = <div class="bg-red-500 flex items-center">suffix</div>;

    return <Demo settings={
        <>
            {paletteS}
            {readonlyS}
            {roundedS}
            {disabledS}
            {layoutS}
            <button class="palette--primary" onClick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <div class="flex flex-col gap-2 w-80">
            <TextField hasHelp layout={layout()} placeholder='placeholder' palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="label" palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="prefix" prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="prefix+suffix" prefix={cloneElement(prefix)} suffix={cloneElement(suffix)} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
        </div>

        <div class="flex flex-col gap-2 w-80">
            <Number hasHelp layout={layout()} placeholder='placeholder' palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
            <Number hasHelp layout={layout()} placeholder='placeholder' label="icon" prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
            <Number hasHelp layout={layout()} placeholder='placeholder' label="range:[1,10]" prefix={<IconFace class='self-center' />} min={1} max={10} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
            <Password hasHelp layout={layout()} placeholder='placeholder' label="password" prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={pwd} />
        </div>
    </Demo>;
}
