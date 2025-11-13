// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { A } from '@solidjs/router';
import { JSX, mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';

import { classList, PropsError, RefProps } from '@/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export interface Ref {
    /**
     * 返回组件的根元素
     *
     * @returns 根据 {@link Props#"type"} 的不同，返回的类型是不同的。
     */
    element(): HTMLButtonElement | HTMLAnchorElement;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
    /**
     * 是否为一个长宽比为 1:1 的按钮
     *
     * @remarks
     * 比如图标之类可能需要此属性，
     * 但是单字符按钮如果需要显示正方形不能指定此属性，因为字符本身就是不是正方式的。
     *
     * @reactive
     */
    square?: boolean;

    /**
     * 是否处于选中状态
     *
     * @reactive
     */
    checked?: boolean;

    /**
     * 鼠标的提示内容
     *
     * @reactive
     */
    title?: string;

    /**
     * 按钮的类型了
     *
     * @remarks
     * 除了 html 中有关 button 的类型之外，还添加了以下类型：
     *  - a 表示这是一个链接，但是看起来看个按钮；
     *
     * @defaultValue 'button'
     */
    type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'] | 'a';

    /**
     * 按钮的点击操作，type 为 'a'，也会触发此事件。
     */
    onclick?: JSX.CustomEventHandlersLowerCase<HTMLElement>['onclick'];

    /**
     * 指向的链接，仅在 type 为 'a' 时有效。
     */
    href?: string;
}

export const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    type: 'button'
};

/**
 * 普通的按钮组件
 */
export function Button(props: Props) {
    let ref: HTMLElement;

    if (props.hotkey && props.onclick) {
        onMount(() => {
            Hotkey.bind(props.hotkey!, () => { ref!.click(); });
        });
        onCleanup(() => Hotkey.unbind(props.hotkey!));
    }

    // anchor

    if (props.type === 'a') {
        if (props.href === undefined) { throw new PropsError('href', '不能为空'); }

        props = mergeProps(presetBaseProps, props);

        const [_, btnProps] = splitProps(props, ['kind', 'rounded', 'palette', 'children', 'square', 'class', 'ref', 'type', 'href']);

        // A.href 无法设置为 javascript:void(0)
        return <A {...btnProps} href={props.href!} onClick={
            !props.disabled ? undefined : e => e.preventDefault()
        } ref={el => {
            if (!props.ref) { return; }
            props.ref({ element() { return el; } });
        }} class={classList(props.palette, {
            [styles.square]: props.square,
            [styles.rounded]: props.rounded,
            [styles['link-enabled']]: !props.disabled,
            [styles['link-disabled']]: props.disabled
        }, props.class, styles.button, styles[props.kind!])}>{props.children}</A>;
    }

    // button

    props = mergeProps(presetProps, props);

    const [_, btnProps] = splitProps(props, ['kind', 'rounded', 'palette', 'children', 'square', 'class', 'ref', 'type', 'href']);
    return <button {...btnProps} type={props.type as any} class={classList(props.palette, {
        [styles.square]: props.square,
        [styles.rounded]: props.rounded,
        [styles.checked]: props.checked,
    }, styles.button, styles[props.kind!], props.class)} ref={el => {
        ref = el;
        if (!props.ref) { return; }
        props.ref({ element: () => el });
    }}
    >
        {props.children}
    </button>;
}
