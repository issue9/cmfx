// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Scheme } from '@/components/base';
import { SchemeSelector } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import Number from './number';
import Password from './password';
import TextField from './textfiled';

export default function() {
    const txt = FieldAccessor('name', 'text', true);
    const pwd = FieldAccessor('name', 'pwd', true);
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
                <TextField placeholder='placeholder' scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField placeholder='placeholder' label="label" scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField placeholder='placeholder' label="prefix" prefix={prefix} scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField placeholder='placeholder' label="prefix+suffix" prefix={prefix} suffix={suffix} scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
                <TextField placeholder='placeholder' label="prefix+icon suffix" prefix="prefix" suffix={icon} scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            </div>

            <div class="flex flex-col gap-2 w-80">
                <Number placeholder='placeholder' scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={num} />
                <Number placeholder='placeholder' label="icon" icon="face" scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={num} />
                <Number placeholder='placeholder' label="range:[1,10]" icon="face" min={1} max={10} scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={num} />
                <Password placeholder='placeholder' label="password" icon="face" scheme={scheme()} disabled={disable()} rounded={rounded()} readonly={readonly()} accessor={pwd} />
            </div>
        </div>
    </div>;
}
