// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { pop } from '@cmfx/core';
import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { Props as BaseProps, default as Panel, presetProps, Ref } from './panel';

export interface Props extends Omit<BaseProps, 'onChange' | 'popover' | 'ref'> {
    /**
     * 触发按钮上的内容
     */
    activator: JSX.Element;

    /**
     * 当选择项发生变化时触发的事件
     *
     * 如果返回了 true，表示不需要关闭弹出的菜单，否则会自动关闭弹出菜单。
     */
    onChange?: { (selected?: string, old?: string): boolean | undefined; };
}

/**
 * 下拉菜单组件
 */
export function ContextMenu(props: Props): JSX.Element {
    props = mergeProps(presetProps as Props, props);
    let popRef: Ref;

    const [_, panelProps] = splitProps(props, ['activator', 'onChange', 'children']);

    let onchange: BaseProps['onChange'];
    if (props.onChange) {
        onchange = (selected?: string, old?: string) => {
            if (!props.onChange!(selected, old)) {
                popRef.hidePopover();
            }
        };
    } else {
        onchange = () => { popRef.hidePopover(); };
    }

    const handleClick = (e: MouseEvent) => {
        if (!popRef.contains(e.target as Node)) {
            popRef.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    return <>
        <span classList={{[`palette--${props.palette}`]:!!props.palette}} onContextMenu={(e)=>{
            e.preventDefault();
            popRef.hidePopover();
            popRef.showPopover();
            const x = props.direction === 'right' ? e.clientX : e.clientX - popRef.getBoundingClientRect().width;
            pop(popRef, new DOMRect(x, e.clientY, 1, 1));
        }}>{props.activator}</span>

        <Panel popover="manual" ref={el=>popRef=el} onChange={onchange} {...panelProps}>{props.children}</Panel>
    </>;
}
