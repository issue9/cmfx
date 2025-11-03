// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Checkbox, Choice, ChoiceOption, fieldAccessor, Layout, layouts, Palette, palettes, ButtonKind, buttonKinds
} from '@cmfx/components';
import { PopoverPosition } from '@cmfx/core';
import { Accessor, createSignal, createUniqueId, JSX, Setter } from 'solid-js';

export function posSelector(
    preset: PopoverPosition = 'right'
): [JSX.Element, Accessor<PopoverPosition|undefined>, Setter<PopoverPosition|undefined>] {
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
export function paletteSelector(preset?: Palette) {
    return arraySelector('颜色', palettes, preset);
}

export function layoutSelector(label: string, preset?: Layout) {
    return arraySelector(label, layouts, preset);
}

export function buttonKindSelector(v?: ButtonKind) {
    return arraySelector('风格', buttonKinds, v);
}

/**
 * 将数组生成下拉的单选项
 */
export function arraySelector<T extends string|number>(
    label: string, array: ReadonlyArray<T>, preset?: T
): [JSX.Element, Accessor<T|undefined>, Setter<T|undefined>] {
    const signal = createSignal<T|undefined>(preset);

    const options: Array<ChoiceOption<T>> = array.map(item => {
        return {
            type: 'item',
            value: item,
            label: item
        };
    });
    const name = createUniqueId(); // 保证一组 radio 一个独立的名称
    const elem = <Choice closable layout='horizontal' placeholder={label}
        accessor={fieldAccessor(name, signal)} options={options} />;

    return [elem, signal[0], signal[1]];
}
