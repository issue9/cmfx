// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MaterialSymbol } from 'material-symbols';
import { JSX, mergeProps, splitProps } from 'solid-js';

/**
 * 所有可用的图标名称组成的联合类型
 */
export type IconSymbol = MaterialSymbol;

export type Props = {
    icon: IconSymbol;
} & Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'>;

const presetProps: Readonly<Partial<Props>> = {
    role: 'img',
};

export function Icon(props: Props) {
    const [, spanProps] = splitProps(mergeProps(presetProps, props), ['icon']);
    return <span {...spanProps} classList={{
        ...props.classList,
        'c--icon': true,
        'material-symbols-outlined': true
    }}>{props.icon}</span>;
}
