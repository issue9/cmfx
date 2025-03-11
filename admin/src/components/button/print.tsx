// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import Printd from 'printd';
import { mergeProps, splitProps } from 'solid-js';

import { Props as BaseProps, Button, presetProps } from './button';

export interface Props extends Omit<BaseProps, 'onClick'> {
    /**
     * 获取需要被打印的容器
     */
    container: { (): HTMLElement; };

    /**
     * 打印内容的 CSS
     *
     * NOTE: 打印的内容是复制的对象，无法直接引用原来的 CSS，需要额外指定。
     */
    cssText?: string;
}

/**
 * 打印指定容器的内容
 *
 * NOTE: 需要保证当前组件必须在 [Props#container] 之内，否则可能会无法退回原来状态的可能。
 */
export function PrintButton(props: Props) {
    props = mergeProps(presetProps, props);
    const [_, btnProps] = splitProps(props, ['container']);

    return <Button icon {...btnProps} onClick={() => {
        const d = new Printd();
        d.print(props.container(), props.cssText ? [props.cssText] : undefined);
    }}>print</Button>;
}
