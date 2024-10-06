// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { A } from '@solidjs/router';
import { JSX, mergeProps } from 'solid-js';

import { Props as BaseProps, presetProps as presetBaseProps } from './types';

/**
 * 将 {@link A} 以按钮的形式展示
 */
export interface Props extends BaseProps {
    /**
     * 跳转的链接
     */
    href: string;

    /**
     * 是否为图标按钮
     *
     * 如果为 true，表示将 children 作为图标内容进行解析。
     */
    icon?: boolean;

    /**
     * 按钮内容，如果 icon 为 true，那么内容应该是图标名称，否则不能显示为正确图标。
     */
    children: JSX.Element;

    title?: string;
    accessKey?: string;
}

export const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
};

/**
 * 普通的按钮组件
 */
export default function(props: Props) {
    props = mergeProps(presetProps, props);

    // A.href 无法设置为 javascript:void(0)
    return <A href={props.href} accessKey={props.accessKey} title={props.title} onClick={
        !props.disabled ? undefined : e => e.preventDefault()
    } classList={{
        'c--button': true,
        'c--icon-container': true,
        'c--icon': props.icon,
        'c--button-icon': props.icon,
        [`c--button-${props.style}`]: true,
        [`palette--${props.palette}`]: !!props.palette,
        'rounded-full': props.rounded,
        'link-enabled': !props.disabled,
        'link-disabled': props.disabled
    }}>{props.children}</A>;
}