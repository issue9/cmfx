// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { ButtonStyle, buttonStyles, colors, XButton, XButtonGroup, XIconButton } from '@/components';

export default function() {
    const [disable, setDisable] = createSignal(false);
    const [rounded, setRounded] = createSignal(false);
    const [t, setT] = createSignal<ButtonStyle>('filled');

    const Buttons = ()=> <>
        <div class="flex items-center gap-2 my-4">
            <For each={colors}>
                {(c)=>(
                    <XButton disabled={disable()} rounded={rounded()} style={t()} color={c}>{c}</XButton >
                )}
            </For>
            <XButton disabled={disable()} rounded={rounded()} style={t()} color="primary">
                <span class="material-symbols-outlined mr-1">face</span>icon button
            </XButton>
        </div>
    </>;

    const IconButtons = () => <>
        <div class="flex items-center gap-2">
            <For each={colors}>
                {(c)=>(
                    <XIconButton disabled={disable()} rounded={rounded()} style={t()} color={c}>sync</XIconButton>
                )}
            </For>
            <button class="button filled scheme--tertiary rounded-full">对比按钮</button>
        </div>
    </>;


    const buttons = [
        {text:'button1', action: ()=>{}},
        {text:'button2', action: ()=>{}},
        {text:'button3', action: ()=>{}},
    ];
    const ButtonGroups = () => <div class="flex flex-col items-center gap-y-2">
        <For each={colors}>
            {(c)=>(
                <>
                    <XButtonGroup buttons={buttons} rounded={rounded()} color={c} style={t()} disabled={disable()} />
                    <br />
                </>
            )}
        </For>
    </div>;

    return <div class="m-10">
        <fieldset class="border-2">
            <legend>设置</legend>
            <For each={buttonStyles}>
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

        <h1 class="my-4">button-group</h1>
        <ButtonGroups />
    </div>;
}
