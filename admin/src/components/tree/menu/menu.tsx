// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { Button, ButtonRef } from '@/components/button';
import { Value } from '@/components/tree/item';
import { Props as BaseProps, defaultProps, default as Panel, Ref } from './panel';

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
    onChange?: { (selected: Value, old?: Value): boolean | undefined; };
}

/**
 * 下拉菜单组件
 */
export default function(props: Props): JSX.Element {
    props = mergeProps(defaultProps as Props, props);
    let pop: Ref;
    let btn: ButtonRef;

    const handleClick = (e: MouseEvent) => {
        if (!pop.contains(e.target as Node) && !btn.contains(e.target as Node)) {
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
        onchange = (selected: Value, old?: Value) => {
            if (!props.onChange!(selected, old)) {
                pop.hidePopover();
            }
        };
    }

    return <>
        <Button ref={el=>btn=el} palette={props.palette} onClick={()=>{
            pop.togglePopover();

            // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
            const rect = btn.getBoundingClientRect();
            pop.style.top = rect.bottom + 'px';
            if (props.direction === 'right') {
                pop.style.left = rect.left + 'px';
            } else {
                const pb = pop.getBoundingClientRect();
                pop.style.left = (rect.right - pb.width) + 'px';
            }
        }}>{props.activator}</Button>

        <Panel popover="manual" ref={el=>pop=el} onChange={onchange} {...panelProps}>{props.children}</Panel>
    </>;
}
