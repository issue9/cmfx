// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { cloneElement, fieldAccessor, TextField } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function() {
    const txt = fieldAccessor('name', 'text');

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [paletteS, palette] = paletteSelector();

    const prefix = <div class="bg-red-500 flex items-center">prefix</div>;
    const suffix = <div class="bg-red-500 flex items-center">suffix</div>;

    return <div>
        {paletteS}
        {readonlyS}
        {roundedS}
        {disabledS}
        {layoutS}
        <button class="palette--primary" onClick={() => {
            txt.setError(txt.getError() ? undefined : 'error');
        }}>toggle error</button>

        <div class="flex flex-col gap-2 w-80">
            <TextField hasHelp layout={layout()} placeholder='placeholder' palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="label"
                palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="prefix"
                prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
                rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="prefix+suffix"
                prefix={cloneElement(prefix)} suffix={cloneElement(suffix)} palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />

            <TextField hasHelp layout={layout()} placeholder='placeholder' label="onsearch" class="w-100"
                prefix={cloneElement(prefix)} suffix={cloneElement(suffix)} palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt}
                onSearch={v => {
                    if (!v) return [];
                    return ['abc@gmail.com', 'def@qq.com', 'ghi@126.com'].filter(item => item.includes(v));
                }}
            />
        </div>
    </div>;
}
