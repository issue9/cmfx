// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Scheme } from '@/components/base';
import { SchemeSelector } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import Number from './number';
import TextField from './textfiled';

export default function() {
    const txt = FieldAccessor('name', 'text', true);
    const num = FieldAccessor('name', 5, true);

    const [disable, setDisable] = createSignal(false);
    const [rounded, setRounded] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [scheme, setScheme] = createSignal<Scheme>();

    const prefix = () => (<div class="bg-red-500 flex items-center">prefix</div>);

    const suffix = () => (<div class="bg-red-500 flex items-center">suffix</div>);

    const icon = () => (<span class="material-symbols-outlined flex items-center">face</span>);

    return <div class="flex flex-col flex-wrap px-5">
        <div class="flex gap-2">
            <SchemeSelector get={scheme} set={setScheme} />
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
            </fieldset>
            <br />

            <button class="button filled scheme--primary" onClick={() => txt.setError(txt.getError() ? undefined : 'error')}>toggle error</button>
        </div>

        <div class="flex gap-10 mt-5">
            <div class="flex flex-col gap-2 w-80">
                <TextField scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField label="label" scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField label="prefix" prefix={prefix} scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField label="prefix+suffix" prefix={prefix} suffix={suffix} scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField label="prefix+icon suffix" prefix="prefix" suffix={icon} scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <Number label="prefix+icon suffix" icon="face" scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={num} />
            </div>

            <div class="flex flex-col gap-2 w-80">
                <Number scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={num} />
                <Number label="icon" icon="face" scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={num} />
                <Number label="range:[1,10]" icon="face" min={1} max={10} scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={num} />
            </div>
        </div>
    </div>;
}
