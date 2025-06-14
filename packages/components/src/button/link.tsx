// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { A, useNavigate } from '@solidjs/router';
import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { classList } from '@/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps } from './types';

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

/**
 * 普通的按钮组件
 */
export function LinkButton(props: Props) {
    props = mergeProps(presetProps, props);
    const [_, linkProps] = splitProps(props, ['square', 'children', 'disabled', 'kind', 'rounded', 'class']);

    if (props.hotkey) {
        onMount(() => {
            Hotkey.bind(props.hotkey!, () => { useNavigate()(props.href); });
        });
        onCleanup(() => Hotkey.unbind(props.hotkey!));
    }

    // A.href 无法设置为 javascript:void(0)
    return <A {...linkProps} onClick={
        !props.disabled ? undefined : e => e.preventDefault()
    } class={classList( {
        [styles.square]: props.square,
        [`palette--${props.palette}`]: !!props.palette,
        [styles.rounded]: props.rounded,
        [styles['link-enabled']]: !props.disabled,
        [styles['link-disabled']]: props.disabled
    },props.class, styles.button, styles[props.kind!])}>{props.children}</A>;
}
