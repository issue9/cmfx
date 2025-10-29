// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Layout, layouts, Palette, palettes } from '@cmfx/components';
import { PopoverPosition } from '@cmfx/core';
import { Accessor, createSignal, createUniqueId, For, JSX, Setter } from 'solid-js';

import styles from './style.module.css';

export const palettesWithUndefined = [...palettes, undefined] as const;

export function posSelector(
    preset: PopoverPosition = 'right'
): [JSX.Element, Accessor<PopoverPosition>, Setter<PopoverPosition>] {
    return arraySelector('pos', ['left', 'right', 'top', 'bottom'], preset);
}

/**
 * 创建一个 bool 选择项
 *
 * @param label - 标题
 * @param preset - 默认值
 */
export function boolSelector(
    label: string, preset: boolean = false
): [JSX.Element, Accessor<boolean>, Setter<boolean>] {
    const [get, set] = createSignal(preset);
    return [<label><input checked={get()} type="checkbox" onChange={() => set(!get())} />{label}</label>, get, set];
}

/**
 * 创建色盘选择工具
 * @param preset - 默认值
 */
export function paletteSelector(preset?: Palette)
    : [JSX.Element, Accessor<Palette|undefined>, Setter<Palette|undefined>] {
    return arraySelector<Palette | undefined>('颜色', palettesWithUndefined, preset);
}

export function layoutSelector(label: string, preset?: Layout)
    : [JSX.Element, Accessor<Layout|undefined>, Setter<Layout|undefined>] {
    return arraySelector(label, layouts, preset);
}

export function arraySelector<T extends string|number|undefined>(
    label: string, array: ReadonlyArray<T>, preset: T
): [JSX.Element, Accessor<T>, Setter<T>] {
    const [get, set] = createSignal<T>(preset);

    const name = createUniqueId(); // 保证一组 radio 一个独立的名称
    const elem = <fieldset class={styles['radio-selector']}>
        <legend>{label}</legend>
        <For each={array}>
            {item => <label>
                <input type="radio" name={name}
                    value={item} onClick={() => set(item as any)}
                    checked={get() === item}
                />{item !== undefined ? item : 'undefined'}
            </label>
            }
        </For>
    </fieldset>;

    return [elem, get, set];
}
