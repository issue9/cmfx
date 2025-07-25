// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { JSX, mergeProps, splitProps } from 'solid-js';

import { AvailableEnumType } from '@/base';
import { default as HoverMenu, Props as HoverProps } from './hover';
import { Props as BaseProps, default as Panel, Ref as PanelRef, presetProps } from './panel';

export interface Props extends HoverProps {
    /**
     * 是否以鼠标滑入滑出作为触发条件，默认为点击。
     *
     * NOTE: 这是一个非响应式的属性。
     */
    hoverable?: boolean;
}

/**
 * 下拉菜单组件
 */
export function Menu(props: Props): JSX.Element {
    props = mergeProps(presetProps as Props, props);

    if (props.hoverable) {
        const [_, hp] = splitProps(props, ['hoverable', 'children']);
        return <HoverMenu {...hp}>{props.children}</HoverMenu>;
    }

    let popRef: PanelRef;
    let activator: HTMLSpanElement;

    const [_, panelProps] = splitProps(props, ['activator', 'onChange', 'children']);

    let onchange: BaseProps['onChange'];
    if (props.onChange) {
        onchange = (selected?: AvailableEnumType, old?: AvailableEnumType) => {
            if (!props.onChange!(selected, old) && popRef.hidePopover) {
                popRef.hidePopover();
            }
        };
    } else {
        onchange = () => { popRef.hidePopover(); };
    }

    return <div class="w-fit">
        <span ref={el=>activator=el} classList={{[`palette--${props.palette}`]: !!props.palette}} onClick={()=>{
            if (popRef.togglePopover) {
                popRef.togglePopover();
            }

            const rect = activator.getBoundingClientRect();
            const x = props.direction === 'right' ? rect.left : rect.right - popRef.getBoundingClientRect().width;
            adjustPopoverPosition(popRef, new DOMRect(x, rect.y, rect.width, rect.height), 2);
        }}>{props.activator}</span>

        <Panel popover="auto" ref={el=>popRef=el} onChange={onchange} {...panelProps}>{props.children}</Panel>
    </div>;
}
