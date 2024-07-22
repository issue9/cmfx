// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Palette } from '@/components/base';
import { PaletteSelector } from '@/components/base/demo';
import { FieldAccessor, Options, TextField } from '@/components/form';
import { createSignal } from 'solid-js';
import { default as Choice } from './choice';

export default function() {
    const fa = FieldAccessor<string|undefined>('choice', '1', true);
    const options: Options<string> = [
        ['1', ()=><div>abc</div>],
        ['2', ()=><div style="color:green">green</div >],
        ['3', ()=><div style="color:red">red<br/>red</div>],
    ];


    const mfa = FieldAccessor<Array<number>>('choice', [1,2]);
    const multipleOptions: Options<number> = [
        [1, ()=><div>abc</div>],
        [2, ()=><div style="color:green">green</div >],
        [3, ()=><div style="color:red">red<br/>red</div>],
        [4, ()=><div style="color:yellow">yellow</div>],
        [5, ()=><div style="color:blue">blue</div>],
        [6, ()=><div style="color:red">red2</div>],
        [7, ()=><div style="color:red">red3</div>],
        [8, ()=><div style="color:red">red4</div>],
        [9, ()=><div style="color:red">red5</div>],
    ];

    const tf = FieldAccessor('textfield', '');


    const [palette, setPalette] = createSignal<Palette>();
    const [disable, setDisable] = createSignal(false);
    const [rounded, setRounded] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [icon, setIcon] = createSignal(false);
    return <div class="px-10 py-5 flex flex-col gap-y-10 w-[500px]">
        <div class="flex mb-10 gap-2">
            <PaletteSelector get={palette} set={setPalette} />
            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setReadonly(e.target.checked)} />readonly
            </label>

            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setRounded(e.target.checked)} />rounded
            </label>

            <label class="mr-4">
                <input type="checkbox" onChange={(e) => setDisable(e.target.checked)} />disabled
            </label>

            <button class="button filled palette--primary" onClick={() => {
                fa.setError(fa.getError() ? undefined : 'error');
                mfa.setError(mfa.getError() ? undefined : 'error');
            }}>toggle error</button>
            <button class="button filled palette--primary" onClick={() => setIcon(!icon())}>toggle icon</button>
        </div>

        <Choice placeholder='placeholder' disabled={disable()} rounded={rounded()} readonly={readonly()} expandIcon={icon() ? 'face' : undefined} palette={palette()} label="label" accessor={fa} options={options} />
        <Choice placeholder='placeholder' disabled={disable()} rounded={rounded()} readonly={readonly()} expandIcon={icon() ? 'face' : undefined} palette={palette()} accessor={mfa} multiple options={multipleOptions} />
        <Choice placeholder='placeholder' disabled={disable()} rounded={rounded()} readonly={readonly()} expandIcon={icon() ? 'face' : undefined} palette={palette()} accessor={mfa} multiple options={multipleOptions} />
        <TextField placeholder='placeholder' disabled={disable()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={tf} />
    </div>;
}
