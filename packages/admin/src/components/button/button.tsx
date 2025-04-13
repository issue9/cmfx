// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, splitProps } from 'solid-js';

import { IconSymbol } from '@admin/components/icon';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export type Ref = HTMLButtonElement;

export interface Props extends BaseProps, JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 是否为图标按钮
     *
     * 如果为 true，表示将 children 作为图标内容进行解析。
     */
    icon?: boolean;

    /**
     * 按钮内容，如果 icon 为 true，那么内容应该是图标名称，否则不能显示为正确图标。
     */
    children: JSX.Element | IconSymbol;

    /**
     * 是否处于选中状态
     */
    checked?: boolean;
}

export const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    type: 'button'
};

/**
 * 普通的按钮组件
 */
export function Button(props: Props) {
    props = mergeProps(presetProps, props);
    const [_, btnProps] = splitProps(props, ['kind', 'rounded', 'palette', 'icon', 'children', 'classList']);

    return <button {...btnProps} classList={{
        'c--button': true,
        'c--icon': props.icon,
        'material-symbols-outlined': props.icon,
        'c--button-icon': props.icon,
        [`c--button-${props.kind}`]: true,
        [`palette--${props.palette}`]: !!props.palette,
        'rounded-full': props.rounded,
        'checked': props.checked,
        ...props.classList
    }}>
        {props.children}
    </button>;
}
