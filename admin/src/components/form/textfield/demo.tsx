// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { FieldAccessor } from '@/components/form';
import { colors } from 'admin/dev/components';
import XTextField from './textfiled';

export default function() {
    const f = FieldAccessor('name', '5');
    const [disable, setDisable] = createSignal(false);
    const [rounded, setRounded] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [icon, setIcon] = createSignal(false);

    return <div class="w-80">
        <fieldset class="border-2 my-4 box-border">
            <legend>设置</legend>

            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setReadonly(e.target.checked)} />readonly
            </label>

            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setRounded(e.target.checked)} />rounded
            </label>

            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setDisable(e.target.checked)} />disabled
            </label>

            <br />

            <button class="button--filled scheme--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
            <button class="button--filled scheme--primary" onClick={() => setIcon(!icon())}>toggle icon</button>
        </fieldset>

        <For each={colors}>
            {(item) => (
                <XTextField icon={icon() ? 'face' : ''} color={item} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={f} />
            )}
        </For>
    </div>;
}
