// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Props as BaseProps, ButtonType, ClickFunc, presetProps as presetBaseProps } from './types';

export type Ref = HTMLButtonElement;

export interface Props extends BaseProps {
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

    onClick?: ClickFunc;
    title?: string;
    type?: ButtonType;
    accessKey?: string;
    autofocus?: boolean;
    value?: string;
    ref?: { (el: Ref): void; };
}

export const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    type: 'button'
};

/**
 * 普通的按钮组件
 */
export default function(props: Props) {
    props = mergeProps(presetProps, props);

    return <button value={props.value} accessKey={props.accessKey} autofocus={props.autofocus} disabled={props.disabled}
        ref={(el) => { if (props.ref) { props.ref(el); }}}
        type={props.type} title={props.title} onClick={props.onClick} classList={{
            'c--button': true,
            'c--icon-container': true,
            'c--icon': props.icon,
            'c--button-icon': props.icon,
            [`c--button-${props.style}`]: true,
            [`palette--${props.palette}`]: !!props.palette,
            'rounded-full': props.rounded,
        }}>
        {props.children}
    </button>;
}
