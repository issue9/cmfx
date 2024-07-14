// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, createSignal, For, Setter } from 'solid-js';

import { Button, ButtonGroup, ButtonStyle, buttonStyles, IconButton } from '@/components';
import { colorsWithUndefined } from '@/components/base/demo';

export function ButtonSettings(props: {get: Accessor<ButtonStyle>, set: Setter<ButtonStyle>}) {
    return <fieldset class="border-2 flex flex-wrap">
        <legend>按钮风格</legend>
        <For each={buttonStyles}>
            {(item) => (
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="type" value={item} onClick={() => props.set(item)} checked={props.get() === item} />{item}
                </label >
            )}
        </For>
    </fieldset>;
}

export default function() {
    const [disable, setDisable] = createSignal(false);
    const [rounded, setRounded] = createSignal(false);
    const [t, setT] = createSignal<ButtonStyle>('filled');

    const Buttons = ()=> <>
        <div class="flex items-center gap-2 my-4">
            <For each={colorsWithUndefined}>
                {(c)=>(
                    <Button disabled={disable()} rounded={rounded()} style={t()} scheme={c}>{c ? c : 'undefined'}</Button>
                )}
            </For>
            <Button disabled={disable()} rounded={rounded()} style={t()} scheme="primary">
                <span class="material-symbols-outlined mr-1">face</span>icon button
            </Button>
        </div>
    </>;

    const IconButtons = () => <>
        <div class="flex items-center gap-2">
            <For each={colorsWithUndefined}>
                {(c)=>(
                    <IconButton title={c?c:'undefined'} disabled={disable()} rounded={rounded()} style={t()} scheme={c}>sync</IconButton >
                )}
            </For>
            <Button rounded scheme='tertiary'>对比按钮</Button>
        </div>
    </>;


    const buttons = [
        {text:'button1', action: ()=>{}},
        {text:'button2', action: ()=>{}},
        {text:'button3', action: ()=>{}},
    ];
    const ButtonGroups = () => <div class="flex flex-col items-center gap-y-2">
        <For each={colorsWithUndefined}>
            {(c)=>(
                <>
                    <ButtonGroup buttons={buttons} rounded={rounded()} scheme={c} style={t()} disabled={disable()} />
                    <br />
                </>
            )}
        </For>
    </div>;

    return <div class="m-10">
        <ButtonSettings get={t} set={setT} />

        <label class="mr-4">
            <input type="checkbox" onChange={(e)=>setRounded(e.target.checked)} />rounded
        </label>

        <label class="mr-4">
            <input type="checkbox" onChange={(e)=>setDisable(e.target.checked)} />disabled
        </label>

        <h1 class="my-4">button</h1>
        <Buttons />

        <h1 class="my-4">icon-button</h1>
        <IconButtons />

        <h1 class="my-4">button-group</h1>
        <ButtonGroups />
    </div>;
}
