// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { A, AnchorProps } from '@solidjs/router';
import { JSX, mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';

import { classList, PropsError, RefProps } from '@/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export interface Ref<A extends boolean = false, E = A extends false ? HTMLButtonElement : HTMLAnchorElement> {
    /**
     * 返回组件的根元素
     */
    root(): E;
}

interface Base extends BaseProps, ParentProps {
    /**
     * 鼠标的提示内容
     *
     * @reactive
     */
    title?: string;

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
     * 按钮的点击操作，type 为 'a'，也会触发此事件。
     */
    onclick?: JSX.CustomEventHandlersLowerCase<HTMLElement>['onclick'];
};

/**
 * 按钮类型的属性
 */
export interface BProps extends Base, RefProps<Ref<false>> {
    /**
     * 按钮的类型了
     *
     * @defaultValue 'button'
     */
    type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];

    /**
     * 是否处于选中状态
     *
     * @reactive
     */
    checked?: boolean;

    /**
     * 关联的表单 id
     */
    form?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['form'];
};

/**
 * 链接类型的按钮属性
 */
export interface AProps extends Base, RefProps<Ref<true>> {
    /**
     * 表示这是一个链接类型的按钮
     */
    type: 'a';

    /**
     * 链接上的 target 属性
     *
     * @reactive
     */
    target?: JSX.AnchorHTMLAttributes<HTMLAnchorElement>['target'];

    /**
     * 指向的链接
     *
     * @reactive
     */
    href?: AnchorProps['href'];
};

export type Props = BProps | AProps;

export const presetProps: Readonly<Partial<BProps>> = {
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
            ref = el;
            if (!props.ref) { return; }
            props.ref({ root() { return el; } } as any);
        }} class={classList(props.palette, {
            [styles.square]: props.square,
            [styles.rounded]: props.rounded,
            [styles['link-enabled']]: !props.disabled,
            [styles['link-disabled']]: props.disabled
        }, props.class, styles.button, styles[props.kind!])}>{props.children}</A>;
    }

    // button

    props = mergeProps(presetProps, props);

    const [_, btnProps] = splitProps(props, ['kind', 'rounded', 'palette', 'children', 'square', 'class', 'ref', 'type']);
    return <button {...btnProps} type={props.type} class={classList(props.palette, {
        [styles.square]: props.square,
        [styles.rounded]: props.rounded,
        [styles.checked]: props.checked,
    }, styles.button, styles[props.kind!], props.class)} ref={el => {
        ref = el;
        if (props.checked) { el.ariaChecked = 'true'; }

        if (!props.ref) { return; }
        props.ref({ root: () => el });
    }}
    >
        {props.children}
    </button>;
}
