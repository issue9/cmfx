// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, splitProps } from 'solid-js';

import { IconSymbol } from '@admin/components/icon';
import { Props as BaseProps, Button, presetProps } from './button';

export interface Props extends Omit<BaseProps, 'onClick' | 'children'> {
    /**
     * 展开状态下的内容
     */
    collapse: IconSymbol | string;

    /**
     * 未展开状态下的内容
     */
    expand: IconSymbol | string;

    /**
     * 获取需要被全屏的容器
     */
    container: { (): HTMLElement; };
}

/**
 * 将指定的容器扩展至整个屏幕大小
 *
 * NOTE: 需要保证当前组件必须在 [Props#container] 之内，否则可能会无法退回原来状态的可能。
 */
export function FitScreenButton(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [fit, setFit] = createSignal<boolean>(false);

    const [_, btnProps] = splitProps(props, ['container']);

    return <Button icon {...btnProps} onClick={() => {
        setFit(!fit());
        if (fit()) {
            props.container().classList.add('c--fit-screen');
        } else {
            props.container().classList.remove('c--fit-screen');
        }
    }}>{fit() ? props.collapse : props.expand}</Button>;
}