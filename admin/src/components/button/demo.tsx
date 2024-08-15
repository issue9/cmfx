// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, createSignal, For, JSX, Setter } from 'solid-js';

import { Button, ButtonGroup, ConfirmButton } from '@/components';
import { boolSelector, colorsWithUndefined, Demo } from '@/components/base/demo';
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
    const [styleS, style] = styleSelector('fill');
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    const Buttons = ()=> <>
        <div class="flex items-center gap-2 my-4">
            <For each={colorsWithUndefined}>
                {(c)=>(
                    <Button disabled={disabled()} rounded={rounded()} style={style()} palette={c}>{c ? c : 'undefined'}</Button>
                )}
            </For>
            <Button disabled={disabled()} rounded={rounded()} style={style()} palette="primary">
                <span class="c--icon mr-1">face</span>with icon
            </Button>

            <ConfirmButton onClick={()=>alert('confirm')} disabled={disabled()} rounded={rounded()} style={style()} palette='tertiary'>confirm button</ConfirmButton>
        </div>
    </>;

    const IconButtons = () => <>
        <div class="flex items-center gap-2">
            <For each={colorsWithUndefined}>
                {(c)=>(
                    <Button icon title={c?c:'undefined'} disabled={disabled()} rounded={rounded()} style={style()} palette={c}>sync</Button>
                )}
            </For>
            <Button rounded style='fill' palette='tertiary'>对比按钮</Button>
            <ConfirmButton prompt={<p>这是一段比较长的文字内容</p>} onClick={()=>alert('confirm')} disabled={disabled()} rounded={rounded()} style={style()} palette='tertiary' icon ok={<><span class="material-symbols-outlined mr-2">task_alt</span>OK</>} cancel='cancel'>recommend</ConfirmButton>
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
            <span class="c--icon mr-1">face</span>with icon
        </Button>

        <ButtonGroup rounded={rounded()} palette='primary' style={style()} disabled={disabled()}>
            <Button>abc</Button>
            <Button>def</Button>
            <Button>hij</Button>
            <Button>klm</Button>
        </ButtonGroup>
    </div>;

    return <Demo settings={
        <>
            {styleS}
            {disabledS}
            {roundedS}
        </>
    } stages={
        <>
            <div class="w-full">
                <h1 class="my-4">button</h1>
                <Buttons />
            </div>

            <div class="w-full">
                <h1 class="my-4">icon-button</h1>
                <IconButtons />
            </div>

            <div class="w-full">
                <h1 class="my-4">button-group</h1>
                <ButtonGroups />
            </div>

            <div class="w-full">
                <h1 class="my-4">block</h1>
                <Block />
            </div>
        </>
    } />;
}
