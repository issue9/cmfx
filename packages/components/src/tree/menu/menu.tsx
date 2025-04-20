// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { calcPopoverPos } from '@components/base';
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

    let pop: PanelRef;
    let activator: HTMLSpanElement;

    const handleClick = (e: MouseEvent) => {
        if (!pop.contains(e.target as Node) && !activator.contains(e.target as Node)) {
            pop.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    const [_, panelProps] = splitProps(props, ['activator', 'onChange', 'children']);

    let onchange: BaseProps['onChange'];
    if (props.onChange) {
        onchange = (selected?: string, old?: string) => {
            if (!props.onChange!(selected, old) && pop.hidePopover) {
                pop.hidePopover();
            }
        };
    } else {
        onchange = () => { pop.hidePopover(); };
    }

    return <div class="w-fit">
        <span ref={el=>activator=el} classList={{[`palette--${props.palette}`]: !!props.palette}} onClick={()=>{
            if (pop.togglePopover) {
                pop.togglePopover();
            }

            const rect = activator.getBoundingClientRect();
            const x = props.direction === 'right' ? rect.right - pop.getBoundingClientRect().width : rect.left;
            calcPopoverPos(pop, new DOMRect(x, rect.y, rect.width, rect.height), '2px');
        }}>{props.activator}</span>

        <Panel popover="manual" ref={el=>pop=el} onChange={onchange} {...panelProps}>{props.children}</Panel>
    </div>;
}
