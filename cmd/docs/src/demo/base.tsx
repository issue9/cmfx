// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Checkbox, Choice, ChoiceOption, fieldAccessor, Layout, layouts, Palette, palettes } from '@cmfx/components';
import { PopoverPosition } from '@cmfx/core';
import { Accessor, createSignal, createUniqueId, JSX, Setter } from 'solid-js';

const palettesWithUndefined = [...palettes, undefined] as const;

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
    const [get,set] = createSignal(preset);
    const chk = <Checkbox checked={get()} onChange={v=>set(!!v)} label={label} />;
    return [chk, get, set];
}

/**
 * 创建色盘选择工具
 * @param preset - 默认值
 */
export function paletteSelector(preset?: Palette)
    : [JSX.Element, Accessor<Palette|undefined>, Setter<Palette|undefined>] {
    return arraySelector<Palette | undefined>('颜色', palettesWithUndefined, preset);
}

export function layoutSelector(label: string, preset: Layout = 'horizontal')
    : [JSX.Element, Accessor<Layout>, Setter<Layout>] {
    return arraySelector(label, layouts, preset);
}

/**
 * 将数组生成下拉的单选项
 */
export function arraySelector<T extends string|number|undefined>(
    label: string, array: ReadonlyArray<T>, preset: T
): [JSX.Element, Accessor<T>, Setter<T>] {
    const signal = createSignal<T>(preset);

    const options: Array<ChoiceOption<T>> = array.map(item => {
        return {
            type: 'item',
            value: item,
            label: item ?? 'undefined'
        };
    });
    const name = createUniqueId(); // 保证一组 radio 一个独立的名称
    const elem = <Choice layout='horizontal' label={label} accessor={fieldAccessor(name, signal)} options={options} />;

    return [elem, signal[0], signal[1]];
}
