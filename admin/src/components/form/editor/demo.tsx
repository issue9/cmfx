// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { boolSelector, paletteSelector } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import Editor from './editor';

export default function () {

    const txt = FieldAccessor('name', '<p style="color:red">red</p><br />line2', true);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [paletteS, palette] = paletteSelector();

    return <div class="flex flex-col flex-wrap px-5 gap-5">
        <div class="flex gap-2">
            {paletteS}
            {disabledS}
            {readonlyS}

            <button class="c--button button-style--fill palette--primary" onClick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</button>
        </div>

        <Editor label='label' minHeight='200px' palette={palette()} readonly={readonly()} disabled={disabled()} accessor={txt} />

        <pre>{txt.getValue()}</pre>
    </div>;
}
