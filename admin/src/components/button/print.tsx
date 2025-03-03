// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { Props as BaseProps, Button, presetProps } from './button';

export interface Props extends Omit<BaseProps, 'children' | 'icon'> {
    /**
     * 获取需要被打印的容器
     */
    container: { (): HTMLElement; };
}

/**
 * 打印指定容器的内容
 *
 * NOTE: 需要保证当前组件必须在 [Props#container] 之内，否则可能会无法退回原来状态的可能。
 */
export function PrintButton(props: Props) {
    props = mergeProps(presetProps, props);
    const [_, btnProps] = splitProps(props, ['onClick']);

    return <Button icon {...btnProps} onClick={() => {
        const c = props.container();

        onMount(() => {
            c.classList.add('c--fit-screen');
        });

        onCleanup(() => {
            c.classList.remove('c--fit-screen');
        });

        window.print();
    }}>print</Button>;
}