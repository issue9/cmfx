// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For } from 'solid-js';

import { boolSelector, colorsWithUndefined } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import TextArea from './textarea';

export default function() {
    const f = FieldAccessor('name', '5', true);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');

    return <div class="w-80 flex flex-col gap-y-2">
        <fieldset class="border-2 my-4 box-border">
            <legend>设置</legend>

            {readonlyS}
            {disabledS}

            <br />

            <button class="c--button button-style--fill palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </fieldset>

        <For each={colorsWithUndefined}>
            {(item) => (
                <TextArea palette={item} title={item?item:'undefined'} disabled={disabled()} readonly={readonly()} accessor={f} />
            )}
        </For>
    </div>;
}
