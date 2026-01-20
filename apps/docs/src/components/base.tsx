// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    ButtonKind, buttonKinds, Checkbox, Choice, ChoiceOption, fieldAccessor,
    LabelAlignment, labelAlignments, Layout, layouts, Palette, palettes, useLocale
} from '@cmfx/components';
import { DictKeys, PopoverPosition } from '@cmfx/core';
import { RouteDefinition } from '@solidjs/router';
import { Accessor, Component, createSignal, createUniqueId, Setter } from 'solid-js';

import messages from '@docs/messages/en.lang';

export function posSelector(preset?: PopoverPosition) {
    return arraySelector('_d.demo.tooltipPos', ['left', 'right', 'top', 'bottom'], preset ?? 'left');
}

export function labelAlignSelector(preset: LabelAlignment) {
    return arraySelector('_d.demo.labelAlign', labelAlignments, preset);
}

/**
 * 组件的分类
 */
export type Kind
    = 'general' | 'layout' | 'navigation' | 'data-input' | 'data-display' | 'feedback' | 'config' | 'function';

/**
 * 表示演示组件的信息
 */
export type Info = RouteDefinition & {
    kind: Kind,
    title: DictKeys<typeof messages>,
    icon?: Component, // 在侧边栏和 overview 中都有显示，所以直接采用函数。
};

/**
 * 创建一个 bool 选择项
 *
 * @param label - 标题的翻译 ID；
 * @param preset - 默认值；
 */
export function boolSelector(label: string, preset: boolean = false)
    : [Component, Accessor<boolean>, Setter<boolean>] {
    const [get, set] = createSignal(preset);
    const chk = () => {
        const l = useLocale();
        return <Checkbox checked={get()} onChange={v => set(!!v)} label={l.t(label)} />;
    };
    return [chk, get, set];
}

/**
 * 创建色盘选择工具
 * @param preset - 默认值
 */
export function paletteSelector(preset?: Palette) {
    return arraySelector('_d.demo.palette', palettes, preset);
}

export function layoutSelector(label: string, preset?: Layout) {
    return arraySelector(label, layouts, preset);
}

export function buttonKindSelector(v?: ButtonKind) {
    return arraySelector('_d.demo.buttonKind', buttonKinds, v);
}

/**
 * 将数组或是 Map 生成下拉的单选项
 *
 * @param label - 标题的翻译 ID；
 * @param array - 数组或是 Map，如果是数组，数组的元素值将作为选项值和选项名称展示，如果是 map，键名为选项值，键值为选项名称；
 * @param preset - 默认值；
 */
export function arraySelector<T extends string | number>(
    label: string, array: ReadonlyArray<T> | ReadonlyMap<T, string>, preset?: T
): [Component, Accessor<T|undefined>, Setter<T|undefined>] {
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

    const elem = () => {
        const l = useLocale();
        return <Choice closable layout='horizontal' placeholder={l.t(label)}
            accessor={fieldAccessor(name, signal)} options={options} />;
    };

    return [elem, signal[0], signal[1]];
}
