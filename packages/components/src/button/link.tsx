// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { A, useNavigate } from '@solidjs/router';
import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { Props as BaseProps, presetProps as presetBaseProps } from './types';

/**
 * 将 {@link A} 以按钮的形式展示
 */
export interface Props extends BaseProps, Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
    /**
     * 跳转的链接
     */
    href: string;

    /**
     * 是否为图标按钮
     *
     * 如果为 true，表示将 children 作为图标内容进行解析。
     */
    square?: boolean;

    /**
     * 按钮内容，如果 icon 为 true，那么内容应该是图标名称，否则不能显示为正确图标。
     */
    children: JSX.Element;

    disabled?: boolean;
}

export const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
};

/**
 * 普通的按钮组件
 */
export function LinkButton(props: Props) {
    props = mergeProps(presetProps, props);
    const [_, linkProps] = splitProps(props, ['square', 'children', 'disabled', 'kind', 'rounded']);

    if (props.hotkey) {
        onMount(() => {
            Hotkey.bind(props.hotkey!, () => { useNavigate()(props.href); });
        });
        onCleanup(() => Hotkey.unbind(props.hotkey!));
    }


    // A.href 无法设置为 javascript:void(0)
    return <A {...linkProps} onClick={
        !props.disabled ? undefined : e => e.preventDefault()
    } classList={{
        'c--button': true,
        'c--button-square': props.square,
        [`c--button-${props.kind}`]: true,
        [`palette--${props.palette}`]: !!props.palette,
        'rounded-full': props.rounded,
        'link-enabled': !props.disabled,
        'link-disabled': props.disabled
    }}>{props.children}</A>;
}
