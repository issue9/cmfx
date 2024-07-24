// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, createSignal, For, JSX, Setter } from 'solid-js';

import { Button, ButtonGroup, IconButton } from '@/components';
import { colorsWithUndefined } from '@/components/base/demo';
import { Style, styles } from './types';

export function styleSelector(v: Style = 'fill'): [JSX.Element, Accessor<Style>, Setter<Style>] {
    const [get, set] = createSignal<Style>(v);

    const elem = <fieldset class="border-2 flex flex-wrap px-2 py-1">
        <legend>风格</legend>
        <For each={styles}>
            {(item)=>(
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="style"
                        value={item} onClick={()=>set(item as any)}
                        checked={get()===item}
                    />{item ? item : 'undefined'}
                </label>
            )}
        </For>
    </fieldset>;

    return [elem, get, set];
}

export default function() {
    const [rounded, setRounded] = createSignal(false);
    const [styleS, style] = styleSelector('fill');
    const [disabled, setDisabled] = createSignal(false);

    const Buttons = ()=> <>
        <div class="flex items-center gap-2 my-4">
            <For each={colorsWithUndefined}>
                {(c)=>(
                    <Button disabled={disabled()} rounded={rounded()} style={style()} palette={c}>{c ? c : 'undefined'}</Button>
                )}
            </For>
            <Button disabled={disabled()} rounded={rounded()} style={style()} palette="primary">
                <span class="material-symbols-outlined mr-1">face</span>icon button
            </Button>
        </div>
    </>;

    const IconButtons = () => <>
        <div class="flex items-center gap-2">
            <For each={colorsWithUndefined}>
                {(c)=>(
                    <IconButton title={c?c:'undefined'} disabled={disabled()} rounded={rounded()} style={style()} palette={c}>sync</IconButton >
                )}
            </For>
            <Button rounded style='fill' palette='tertiary'>对比按钮</Button>
        </div>
    </>;

    const ButtonGroups = () => <div class="flex flex-col items-center gap-y-2">
        <For each={colorsWithUndefined}>
            {(c)=>(
                <>
                    <ButtonGroup rounded={rounded()} palette={c} style={style()} disabled={disabled()}>
                        <Button>abc</Button>
                        <Button>def</Button>
                        <Button>hij</Button>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const Block = () => <div class="flex flex-col gap-y-2">
        <Button disabled={disabled()} rounded={rounded()} style={style()} palette='primary'>block</Button>

        <Button disabled={disabled()} rounded={rounded()} style={style()} palette="primary">
            <span class="material-symbols-outlined mr-1">face</span>icon button
        </Button>

        <ButtonGroup rounded={rounded()} palette='primary' style={style()} disabled={disabled()}>
            <Button>abc</Button>
            <Button>def</Button>
            <Button>hij</Button>
            <Button>klm</Button>
        </ButtonGroup>
    </div>;

    return <div class="m-10">
        {styleS}
        <label><input type="checkbox" onChange={()=>setDisabled(!disabled())} />disabled</label>

        <label class="mr-4">
            <input type="checkbox" onChange={(e)=>setRounded(e.target.checked)} />rounded
        </label>

        <h1 class="my-4">button</h1>
        <Buttons />

        <h1 class="my-4">icon-button</h1>
        <IconButtons />

        <h1 class="my-4">button-group</h1>
        <ButtonGroups />

        <h1 class="my-4">block</h1>
        <Block />
    </div>;
}
