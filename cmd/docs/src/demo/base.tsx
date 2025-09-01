// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, Layout, layouts, Palette, palettes } from '@cmfx/components';
import { PopoverPosition } from '@cmfx/core';
import { Accessor, createSignal, For, JSX, ParentProps, Setter, Show } from 'solid-js';

export const palettesWithUndefined = [...palettes, undefined] as const;

export function posSelector(preset: PopoverPosition = 'right'): [JSX.Element, Accessor<PopoverPosition>, Setter<PopoverPosition>] {
    return arraySelector('pos', ['left', 'right', 'top', 'bottom'], preset);
}

/**
 * 创建一个 bool 选择项
 *
 * @param label - 标题
 * @param preset - 默认值
 */
export function boolSelector(label: string, preset: boolean = false):[JSX.Element, Accessor<boolean>, Setter<boolean>] {
    const [get, set] = createSignal(preset);

    return [<label><input checked={get()} type="checkbox" onChange={() => set(!get())} />{label}</label>, get, set];
}

/**
 * 创建色盘选择工具
 * @param preset - 默认值
 */
export function paletteSelector(preset?: Palette): [JSX.Element, Accessor<Palette|undefined>, Setter<Palette|undefined>] {
    return arraySelector<Palette|undefined>('颜色', palettesWithUndefined, preset);
}

export function layoutSelector(label: string, preset?: Layout): [JSX.Element, Accessor<Layout|undefined>, Setter<Layout|undefined>] {
    return arraySelector(label, layouts, preset);
}

export function arraySelector<T extends string|number|undefined>(label: string, array: ReadonlyArray<T>, preset: T): [JSX.Element, Accessor<T>, Setter<T>] {
    const [get, set] = createSignal<T>(preset);

    const elem = <fieldset class="border-2 flex flex-wrap px-2 py-1">
        <legend>{label}</legend>
        <For each={array}>
            {(item) => (
                <label class="me-4">
                    <input class="me-1" type="radio" name={label}
                        value={item} onClick={() => set(item as any)}
                        checked={get() === item}
                    />{item !== undefined ? item : 'undefined'}
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
    children: JSX.Element;
}

export function Stage(props: ParentProps<{title?: string, class?: string}>) {
    return <fieldset class={joinClass('border border-palette-fg p-2 flex flex-col gap-4 ',props.class)}>
        <Show when={props.title}>
            <legend>{props.title}</legend>
        </Show>
        {props.children}
    </fieldset>;
}

/**
 * demo 展示组件
 */
export function Demo(props: DemoProps) {
    return <div class="flex flex-col gap-y-5 justify-between">
        <div class="settings flex flex-wrap gap-5 p-5 sticky top-0 bg-palette-bg border-b border-palette-bg-high z-50">
            {props.settings}
        </div>

        <div class="stages flex flex-wrap justify-between gap-5 p-5">
            {props.children}
        </div>
    </div>;
}
