// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, splitProps } from 'solid-js';

import { Value } from '@/components/tree/item';
import { Props as BaseProps, presetProps, default as Panel, Ref } from './panel';

export interface Props extends Omit<BaseProps, 'onChange' | 'popover' | 'ref' | 'direction'> {
    /**
     * 触发按钮上的内容
     */
    activator: JSX.Element;

    /**
     * 当选择项发生变化时触发的事件
     *
     * 如果返回了 true，表示不需要关闭弹出的菜单，否则会自动关闭弹出菜单。
     */
    onChange?: { (selected: Value, old?: Value): boolean | undefined; };
}

/**
 * 下拉菜单组件
 */
export default function(props: Props): JSX.Element {
    props = mergeProps(presetProps as Props, props);
    let pop: Ref;

    const [_, panelProps] = splitProps(props, ['activator', 'onChange', 'children']);

    let onchange: BaseProps['onChange'];
    if (props.onChange) {
        onchange = (selected: Value, old?: Value) => {
            if (!props.onChange!(selected, old)) {
                pop.hidePopover();
            }
        };
    }

    return <>
        <span classList={{[`palette--${props.palette}`]:!!props.palette}} onContextMenu={(e)=>{
            e.preventDefault();
            pop.hidePopover();
            pop.showPopover();

            pop.style.top = e.clientY + 'px';
            pop.style.left = e.clientX + 'px';
        }}>{props.activator}</span>

        <Panel popover="auto" ref={el=>pop=el} onChange={onchange} {...panelProps}>{props.children}</Panel>
    </>;
}
