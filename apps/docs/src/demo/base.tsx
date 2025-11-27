// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Checkbox, Choice, ChoiceOption, fieldAccessor, Layout, labelAlignments,
    LabelAlignment, layouts, Palette, palettes, ButtonKind, buttonKinds, useLocale
} from '@cmfx/components';
import { PopoverPosition } from '@cmfx/core';
import { Accessor, createSignal, createUniqueId, JSX, Setter } from 'solid-js';

export function posSelector(preset?: PopoverPosition) {
    return arraySelector('pos', ['left', 'right', 'top', 'bottom'], preset);
}

export function labelAlignSelector(preset: LabelAlignment) {
    return arraySelector('label align', labelAlignments, preset);
}

/**
 * 创建一个 bool 选择项
 *
 * @param label - 标题；
 * @param preset - 默认值；
 */
export function boolSelector(label: string, preset: boolean = false)
    : [JSX.Element, Accessor<boolean>, Setter<boolean>] {
    const [get,set] = createSignal(preset);
    const chk = <Checkbox checked={get()} onChange={v=>set(!!v)} label={label} />;
    return [chk, get, set];
}

/**
 * 创建色盘选择工具
 * @param preset - 默认值
 */
export function paletteSelector(preset?: Palette) {
    const l = useLocale();
    return arraySelector(l.t('_d.demo.palette'), palettes, preset);
}

export function layoutSelector(label: string, preset?: Layout) {
    return arraySelector(label, layouts, preset);
}

export function buttonKindSelector(v?: ButtonKind) {
    const l = useLocale();
    return arraySelector(l.t('_d.demo.buttonKind'), buttonKinds, v);
}

/**
 * 将数组或是 Map 生成下拉的单选项
 *
 * @param label - 标题；
 * @param array - 数组或是 Map，如果是数组，数组的元素值将作为选项值和选项名称展示，如果是 map，键名为选项值，键值为选项名称；
 * @param preset - 默认值；
 */
export function arraySelector<T extends string|number>(
    label: string, array: ReadonlyArray<T> | ReadonlyMap<T, string>, preset?: T
): [JSX.Element, Accessor<T|undefined>, Setter<T|undefined>] {
    const signal = createSignal<T | undefined>(preset);

    let options: Array<ChoiceOption<T>>;

    if (Array.isArray(array)) {
        options = array.map(item => {
            return {
                type: 'item',
                value: item,
                label: item
            };
        });
    } else {
        const m = array as ReadonlyMap<T, string>;
        options = Array.from(m.entries()).map(([key, val]) => {
            return {
                type: 'item',
                value: key,
                label: val
            };
        });
    }
    const name = createUniqueId(); // 保证一组 radio 一个独立的名称
    const elem = <Choice closable layout='horizontal' placeholder={label}
        accessor={fieldAccessor(name, signal)} options={options} />;

    return [elem, signal[0], signal[1]];
}
