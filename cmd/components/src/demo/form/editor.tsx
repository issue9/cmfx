// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Editor, fieldAccessor } from '@cmfx/components';

import { boolSelector, Demo, layoutSelector, paletteSelector } from '../base';

export default function () {
    const txt = fieldAccessor('name', '<p style="color:red">red</p><br />line2', true);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [paletteS, palette] = paletteSelector();
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            {layoutS}

            <button class="palette--primary" onClick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <Editor help="help  text" layout={layout()} label='label' class="h-[500px] w-full" palette={palette()} readonly={readonly()} disabled={disabled()} accessor={txt} />
        <pre>{txt.getValue()}</pre>
    </Demo>;
}
