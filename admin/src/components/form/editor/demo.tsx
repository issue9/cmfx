// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { boolSelector, Demo, paletteSelector } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import Editor from './editor';

export default function () {
    const txt = FieldAccessor('name', '<p style="color:red">red</p><br />line2', true);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [paletteS, palette] = paletteSelector();

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}

            <button class="c--button c--button-fill palette--primary" onClick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</button>
        </>
    } stages={
        <>
            <Editor label='label' class="min-h-[200px] w-full" palette={palette()} readonly={readonly()} disabled={disabled()} accessor={txt} />
            <pre>{txt.getValue()}</pre>
        </>
    } />;
}
