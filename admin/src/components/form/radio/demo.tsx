// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal } from 'solid-js';

import { Color } from '@/components/base';
import { colorsWithUndefined } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import XGroup from './radio';

export default function() {
    const f = FieldAccessor('name', 'primary');
    const [disable, setDisable] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [vertical, setVertical] = createSignal(false);
    const [icon, setIcon] = createSignal(true);

    const options: Array<[string|undefined,string]> = [];

    colorsWithUndefined.forEach((item) => {
        options.push([item, item ? item : 'undefined']);
    });

    return <div class="w-80">
        <fieldset class="border-2 my-4 box-border">
            <legend>设置</legend>

            <label class="mr-4">
                <input type="checkbox" checked={readonly()} onChange={(e) => setReadonly(e.target.checked)} />readonly
            </label>

            <label class="mr-4">
                <input type="checkbox" checked={disable()} onChange={(e) => setDisable(e.target.checked)} />disabled
            </label>

            <label class="mr-4">
                <input type="checkbox" checked={vertical()} onChange={(e) => setVertical(e.target.checked)} />vertical
            </label>

            <label class="mr-4">
                <input type="checkbox" checked={icon()} onChange={(e) => setIcon(e.target.checked)} />icon
            </label>

            <br />

            <button class="button filled scheme--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </fieldset>

        <XGroup label='test' icon={icon()} vertical={vertical()} color={f.getValue() as Color} disabled={disable()} readonly={readonly()} accessor={f} options={options} />
    </div>;
}
