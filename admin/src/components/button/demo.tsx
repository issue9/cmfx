// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { ButtonType, buttonTypes, colors, XButton, XIconButton } from 'admin/dev/components';

export default function() {
    const [disable, setDisable] = createSignal(false);
    const [rounded, setRounded] = createSignal(false);
    const [t, setT] = createSignal<ButtonType>('filled');

    const Buttons = ()=> <>
        <div class="flex items-center gap-2 my-4">
            <For each={colors}>
                {(c)=>(
                    <XButton disabled={disable()} rounded={rounded()} t={t()} color={c}>{c}</XButton >
                )}
            </For>
            <XButton disabled={disable()} rounded={rounded()} t={t()} color="primary" leftIcon="face" rightIcon="face">icon button</XButton>
        </div>
    </>;

    const IconButtons = () => <>
        <div class="flex items-center gap-2">
            <For each={colors}>
                {(c)=>(
                    <XIconButton disabled={disable()} rounded={rounded()} t={t()} color={c}>sync</XIconButton>
                )}
            </For>
            <button class="button--filled scheme--tertiary rounded-full">对比按钮</button>
        </div>
    </>;

    return <div class="m-10">
        <fieldset class="border-2">
            <legend>设置</legend>
            <For each={buttonTypes}>
                {(item)=>(
                    <label class="mr-4">
                        <input class="mr-1" type="radio" name="type" value={item} onClick={()=>setT(item)} checked={t()===item} />{item}
                    </label >
                )}
            </For>

            <label class="mr-4">
                <input type="checkbox" onChange={(e)=>setRounded(e.target.checked)} />rounded
            </label>

            <label class="mr-4">
                <input type="checkbox" onChange={(e)=>setDisable(e.target.checked)} />disabled
            </label>
        </fieldset>

        <h1 class="my-4">button</h1>
        <Buttons />

        <h1 class="my-4">icon-button</h1>
        <IconButtons />
    </div>;
}
