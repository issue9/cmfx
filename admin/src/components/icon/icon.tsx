// SPDX-FileCopyrightText: 2024 caixw
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
} & JSX.HTMLAttributes<HTMLSpanElement>;

const presetProps: Readonly<Partial<Props>> = {
    role: 'img',
}

export default function(props: Props) {
    const [, spanProps] = splitProps(mergeProps(presetProps, props), ['icon']);
    return <span {...spanProps} classList={{
        ...props.classList,
        'c--icon': true,
    }}>{props.icon}</span>;
}
