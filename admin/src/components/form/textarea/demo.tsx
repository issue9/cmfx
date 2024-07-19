// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { colorsWithUndefined } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import TextArea from './textarea';

export default function() {
    const f = FieldAccessor('name', '5');
    const [disable, setDisable] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);

    return <div class="w-80">
        <fieldset class="border-2 my-4 box-border">
            <legend>设置</legend>

            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setReadonly(e.target.checked)} />readonly
            </label>

            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setDisable(e.target.checked)} />disabled
            </label>

            <br />

            <button class="button filled palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </fieldset>

        <For each={colorsWithUndefined}>
            {(item) => (
                <TextArea palette={item} title={item?item:'undefined'} disabled={disable()} readonly={readonly()} accessor={f} />
            )}
        </For>
    </div>;
}
