// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, splitProps } from 'solid-js';

import { Value } from '@/components/tree/item';
import { calcPopoverPos } from '@/components/utils';
import { Props as BaseProps, default as Panel, presetProps, Ref } from './panel';

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
    onChange?: { (selected?: Value, old?: Value): boolean | undefined; };
}

/**
 * 下拉菜单组件
 */
export function ContextMenu(props: Props): JSX.Element {
    props = mergeProps(presetProps as Props, props);
    let pop: Ref;

    const [_, panelProps] = splitProps(props, ['activator', 'onChange', 'children']);

    let onchange: BaseProps['onChange'];
    if (props.onChange) {
        onchange = (selected?: Value, old?: Value) => {
            if (!props.onChange!(selected, old)) {
                pop.hidePopover();
            }
        };
    } else {
        onchange = () => { pop.hidePopover(); };
    }

    return <>
        <span classList={{[`palette--${props.palette}`]:!!props.palette}} onContextMenu={(e)=>{
            e.preventDefault();
            pop.hidePopover();
            pop.showPopover();
            calcPopoverPos(pop, new DOMRect(e.clientX, e.clientY, 1, 1));
        }}>{props.activator}</span>

        <Panel popover="auto" ref={el=>pop=el} onChange={onchange} {...panelProps}>{props.children}</Panel>
    </>;
}
