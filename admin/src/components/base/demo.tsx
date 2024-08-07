// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, createSignal, For, JSX, Setter } from 'solid-js';

import { Corner, corners, Palette, palettes } from './types';

export const colorsWithUndefined = [...palettes, undefined] as const;

/**
 * 创建一个 bool 选择项
 *
 * @param label 标题
 * @param preset 默认值
 */
export function boolSelector(label: string, preset: boolean = false):[JSX.Element, Accessor<boolean>, Setter<boolean>] {
    const [get, set] = createSignal(preset);

    return [<label><input checked={get()} type="checkbox" onChange={() => set(!get())} />{label}</label>, get, set];
}

/**
 * 创建色盘选择工具
 * @param preset 默认值
 */
export function paletteSelector(preset?: Palette): [JSX.Element, Accessor<Palette|undefined>, Setter<Palette|undefined>] {
    const [get, set] = createSignal<Palette|undefined>(preset);

    const elem = <fieldset class="border-2 flex flex-wrap px-2 py-1">
        <legend>颜色</legend>
        <For each={colorsWithUndefined}>
            {(item)=>(
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="palette"
                        value={item} onClick={()=>set(item as any)}
                        checked={get()===item}
                    />{item ? item : 'undefined'}
                </label>
            )}
        </For>
    </fieldset>;

    return [elem, get, set];
}

export function cornerSelector(preset: Corner = 'bottomleft'): [JSX.Element, Accessor<Corner>, Setter<Corner>] {
    const [get, set] = createSignal<Corner>(preset);

    const elem = <fieldset class="border-2 flex flex-wrap px-2 py-1">
        <legend>位置</legend>
        <For each={corners}>
            {(item)=>(
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="corner"
                        value={item} onClick={()=>set(item as any)}
                        checked={get()===item}
                    />{item ? item : 'undefined'}
                </label>
            )}
        </For>
    </fieldset>;

    return [elem, get, set];
}

export interface DemoProps {
    /**
     * 设置项的内容
     */
    settings?: JSX.Element;

    /**
     * 展示区的内容
     */
    stages: JSX.Element;
}

/**
 * demo 展示组件
 */
export function Demo(props: DemoProps) {
    return <div class="flex flex-col gap-y-5 p-5">
        <div class="settings flex flex-wrap justify-between">
            {props.settings}
        </div>

        <div class="stages flex flex-wrap justify-between gap-5">
            {props.stages}
        </div>
    </div>;
}

export default function() {
    const [paletteS, palette] = paletteSelector('primary');

    return <Demo settings={paletteS} stages={
        <>
            <button class="w-full text-[var(--fg)] bg-[var(--bg)]" classList={{
                [`palette--${palette()}`]: !!palette()
            }}>button</button>

            <span class="w-full text-[var(--fg)] bg-[var(--bg)]" classList={{
                [`palette--${palette()}`]: !!palette()
            }}>span</span>

            <fieldset class="w-full text-[var(--fg)] bg-[var(--bg)]" classList={{
                [`palette--${palette()}`]: !!palette()
            }}>
                <legend>fieldset</legend>
                content
            </fieldset>
        </>
    } />;
}
