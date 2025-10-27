// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { A, useNavigate } from '@solidjs/router';
import { mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';

import { classList, RefProps } from '@/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps } from './types';

export interface Ref {
    element(): HTMLAnchorElement;
}

/**
 * 将 {@link A} 以按钮的形式展示
 */
export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
    /**
     * 跳转的链接
     */
    href: string;

    /**
     * 是否为一个长宽比为 1:1 的按钮
     *
     * @remarks 比如图标之类可能需要此属性，
     * 但是单字符按钮如果需要显示正方形不能指定此属性，因为字符本身就是不是正方式的。
     */
    square?: boolean;
}

/**
 * 普通的按钮组件
 */
export function LinkButton(props: Props) {
    props = mergeProps(presetProps, props);
    const [_, linkProps] = splitProps(props, ['square', 'children', 'disabled', 'kind', 'rounded', 'class', 'ref']);

    if (props.hotkey) {
        onMount(() => {
            Hotkey.bind(props.hotkey!, () => { useNavigate()(props.href); });
        });
        onCleanup(() => Hotkey.unbind(props.hotkey!));
    }

    // A.href 无法设置为 javascript:void(0)
    return <A {...linkProps} onClick={
        !props.disabled ? undefined : e => e.preventDefault()
    } ref={el=>{
        if (!props.ref) { return; }
        props.ref({ element() { return el; } });
    }} class={classList(props.palette, {
        [styles.square]: props.square,
        [styles.rounded]: props.rounded,
        [styles['link-enabled']]: !props.disabled,
        [styles['link-disabled']]: props.disabled
    },props.class, styles.button, styles[props.kind!])}>{props.children}</A>;
}
