// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { paletteSelector } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import Editor from './editor';

export default function () {

    const txt = FieldAccessor('name', '<p style="color:red">red</p><br />line2', true);
    const [disabled, setDisabled] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [paletteS, palette] = paletteSelector();

    return <div class="flex flex-col flex-wrap px-5 gap-5">
        <div class="flex gap-2">
            {paletteS}
            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setReadonly(e.target.checked)} />readonly
            </label>

            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setDisabled(e.target.checked)} />disabled
            </label>

            <button class="c--button button-style--fill palette--primary" onClick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</button>
        </div>

        <Editor label='label' minHeight='200px' palette={palette()} readonly={readonly()} disabled={disabled()} accessor={txt} />

        <pre>{txt.getValue()}</pre>
    </div>;
}
