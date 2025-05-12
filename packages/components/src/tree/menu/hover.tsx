// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { calcPopoverPos } from '@cmfx/core';
import { JSX, mergeProps, splitProps } from 'solid-js';

import { Props as BaseProps, default as Panel, Ref as PanelRef, presetProps } from './panel';

export interface Props extends Omit<BaseProps, 'onChange' | 'popover' | 'ref'> {
    /**
     * 触发组件的内容
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
export default function(props: Props): JSX.Element {
    props = mergeProps(presetProps as Props, props);
    let pop: PanelRef;
    let activator: HTMLSpanElement;

    const [_, panelProps] = splitProps(props, ['activator', 'onChange', 'children']);

    let onchange: BaseProps['onChange'];
    if (props.onChange) {
        onchange = (selected?: string, old?: string) => {
            if (!props.onChange!(selected, old)) {
                pop.hidePopover();
            }
        };
    } else {
        onchange = () => { pop.hidePopover(); };
    }

    const onmouseenter = () => {
        pop.showPopover();
        const rect = activator.getBoundingClientRect();
        const x = props.direction === 'right' ? rect.right - pop.getBoundingClientRect().width : rect.left;
        calcPopoverPos(pop, new DOMRect(x, rect.y, rect.width, rect.height), '2px');
    };

    return <div class="w-fit" onmouseenter={onmouseenter} onmouseleave={()=>{pop.hidePopover();}}>
        <span ref={el=>activator=el} classList={{[`palette--${props.palette}`]: !!props.palette}}>{props.activator}</span>

        <Panel popover="manual" ref={el=>pop=el} onChange={onchange} {...panelProps}>{props.children}</Panel>
    </div>;
}
